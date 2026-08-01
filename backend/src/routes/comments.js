import express from 'express';
import supabaseAdmin from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// GET /api/comments/:ticketId - Fetch comments for a ticket
router.get('/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Verify user has access to the ticket first
    const { data: ticket, error: ticketErr } = await supabaseAdmin
      .from('tickets')
      .select('created_by')
      .eq('id', ticketId)
      .single();

    if (ticketErr || !ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'customer' && ticket.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    // Build comment query with profile join
    let query = supabaseAdmin
      .from('ticket_comments')
      .select('*, profiles(email, role)')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    // Filter out internal notes for customers
    if (req.user.role === 'customer') {
      query = query.eq('is_internal', false);
    }

    const { data: comments, error } = await query;
    if (error) throw error;

    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/comments/:ticketId - Post a new comment
router.post('/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message, is_internal } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Comment message is required' });
    }

    // Prevent customers from marking notes as internal
    const forceIsInternal = req.user.role === 'customer' ? false : Boolean(is_internal);

    const { data: comment, error } = await supabaseAdmin
      .from('ticket_comments')
      .insert({
        ticket_id: ticketId,
        user_id: req.user.id,
        message: message.trim(),
        is_internal: forceIsInternal
      })
      .select('*, profiles(email, role)')
      .single();

    if (error) throw error;

    res.status(201).json({ comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
