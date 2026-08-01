// This file handles everything related to tickets - fetching, creating, updating
import express from 'express';
import supabaseAdmin, { supabaseDB } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// every ticket route requires the user to be logged in first
router.use(requireAuth);

// returns live ticket counts - open, resolved, in progress etc.
// this route has to come before /:id otherwise express thinks 'stats' is an id
router.get('/stats', async (req, res) => {
  try {
    let query = supabaseDB
      .from('tickets')
      .select('status, priority');

    // if the user is a customer, only count their own tickets not everyone's
    if (req.user.role === 'customer') {
      query = query.eq('created_by', req.user.id);
    }

    const { data: tickets, error } = await query;
    if (error) throw error;

    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    const highPriority = tickets.filter(t =>
      t.priority === 'high' || t.priority === 'critical'
    ).length;

    res.json({ total, open, inProgress, resolved, closed, highPriority, userRole: req.user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// fetches all tickets with optional search, status filter, priority filter and sorting
router.get('/', async (req, res) => {
  try {
    const { search, status, priority, sortBy = 'created_at', order = 'desc' } = req.query;

    let query = supabaseDB
      .from('tickets')
      .select('*');

    // customers should only ever see their own tickets, not the whole team's queue
    if (req.user.role === 'customer') {
      query = query.eq('created_by', req.user.id);
    }

    // if someone typed something in the search box, filter by title or description
    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query = query.or(`title.ilike.${term},description.ilike.${term}`);
    }

    // apply status filter if user selected something specific
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // apply priority filter if user selected something specific
    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }

    // sort results by whichever column was requested
    const isAscending = order === 'asc';
    query = query.order(sortBy, { ascending: isAscending });

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// creates a new ticket for the logged in user
router.post('/', async (req, res) => {
  const { title, description, priority = 'medium' } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  try {
    // first check if there's an SLA policy matching this priority level
    const { data: sla } = await supabaseDB
      .from('sla_policies')
      .select('resolution_hours')
      .eq('id', priority)
      .single();

    // if we found an SLA policy, work out when the deadline should be
    let sla_deadline = null;
    if (sla && sla.resolution_hours) {
      const now = new Date();
      now.setHours(now.getHours() + sla.resolution_hours);
      sla_deadline = now.toISOString();
    }

    const { data, error } = await supabaseDB
      .from('tickets')
      .insert([
        {
          title,
          description,
          priority,
          created_by: req.user.id,
          sla_deadline,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // now notify all admins and agents so they know a new ticket came in
    const { data: staff } = await supabaseDB
      .from('profiles')
      .select('id')
      .in('role', ['admin', 'agent']);
    
    if (staff && staff.length > 0) {
      const notifs = staff.map(user => ({
        user_id: user.id,
        type: 'NEW_TICKET',
        title: 'New Ticket Created',
        description: `Ticket "${title}" has been created with priority: ${priority}`,
        related_ticket_id: data.id,
        read: false
      }));
      await supabaseDB.from('notifications').insert(notifs);
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// gets a single ticket by its ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: ticket, error } = await supabaseDB
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // make sure a customer can't open someone else's ticket by guessing the ID
    if (req.user.role === 'customer' && ticket.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    res.json({ ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// updates an existing ticket - customers can only edit theirs, admins and agents can edit any
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, priority, title, description } = req.body;

  try {
    // if it's a customer trying to update, confirm they actually own this ticket
    if (req.user.role === 'customer') {
      const { data: ticket } = await supabaseAdmin
        .from('tickets')
        .select('created_by')
        .eq('id', id)
        .single();

      if (!ticket || ticket.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only edit your own tickets' });
      }
    }

    // if the priority changed we need to recalculate the SLA deadline
    let sla_deadline = undefined;
    if (priority) {
      const { data: sla } = await supabaseDB
        .from('sla_policies')
        .select('resolution_hours')
        .eq('id', priority)
        .single();

      if (sla && sla.resolution_hours) {
        const now = new Date();
        now.setHours(now.getHours() + sla.resolution_hours);
        sla_deadline = now.toISOString();
      }
    }

    const { data, error } = await supabaseDB
      .from('tickets')
      .update({
        ...(status && { status }),
        ...(priority && { priority }),
        ...(title && { title }),
        ...(description && { description }),
        ...(sla_deadline !== undefined && { sla_deadline }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
