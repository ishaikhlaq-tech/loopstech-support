// fetches and manages notifications for the logged in user
import express from 'express';
import { supabaseDB } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// get the 20 most recent notifications for whoever is logged in
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseDB
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20); // Only grab the last 20 to avoid slowing down the database

    if (error) throw error;

    const formatted = data.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.description,
      relatedTicketId: n.related_ticket_id,
      // Reshape the data so the frontend receives it in the expected format
      createdAt: n.created_at,
      read: n.read
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// marks a specific single notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseDB
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// marks all unread notifications as read in one go
router.patch('/read-all', async (req, res) => {
  try {
    const { error } = await supabaseDB
      .from('notifications')
      .update({ read: true })
      .eq('user_id', req.user.id)
      .eq('read', false);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
