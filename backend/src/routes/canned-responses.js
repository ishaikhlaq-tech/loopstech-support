import express from 'express';
import supabaseAdmin from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const normalizeTemplate = (template) => ({
  id: template.id,
  title: template.title,
  body: template.body,
  created_at: template.created_at,
  updated_at: template.updated_at,
});

router.use(requireAuth);

// GET /api/canned-responses
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('canned_responses')
      .select('id, title, body, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ templates: (data || []).map(normalizeTemplate) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/canned-responses
router.post('/', async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Template title is required.' });
    }

    if (!body || !body.trim()) {
      return res.status(400).json({ message: 'Template body is required.' });
    }

    const { data, error } = await supabaseAdmin
      .from('canned_responses')
      .insert({
        title: title.trim(),
        body: body.trim(),
        created_by: req.user.id,
      })
      .select('id, title, body, created_at, updated_at')
      .single();

    if (error) throw error;

    res.status(201).json({ template: normalizeTemplate(data) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/canned-responses/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('canned_responses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Template deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;