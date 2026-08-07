// manages the SLA policies - anyone can view them but only admins can change them
import express from 'express';
import supabaseAdmin, { supabaseDB } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// only admins can save changes to SLA policies

// returns all 4 SLA tiers (low, medium, high, critical)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseDB
      .from('sla_policies')
      .select('*')
      .order('resolution_hours', { ascending: false });

    if (error) throw error;
    res.json({ policies: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// updates a specific SLA tier's response and resolution times
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { first_response_hours, resolution_hours } = req.body;

  if (
    typeof first_response_hours !== 'number' || first_response_hours < 1 ||
    typeof resolution_hours !== 'number' || resolution_hours < 1
  ) {
    return res.status(400).json({ message: 'Hours must be positive numbers.' });
  }

  if (resolution_hours < first_response_hours) {
    return res.status(400).json({ message: 'Resolution time must be >= First Response time.' });
  }

  try {
    const { data, error } = await supabaseDB
      .from('sla_policies')
      .update({
        first_response_hours,
        resolution_hours,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'SLA policy saved!', policy: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
