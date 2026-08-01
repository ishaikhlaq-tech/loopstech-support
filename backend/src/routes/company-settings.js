import express from 'express';
import supabaseAdmin from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const GLOBAL_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

const DEFAULT_SETTINGS = {
  departments: [],
  clients: [],
  routingRules: [],
  modules: [],
};

const normalizeTextList = (value, fallback = []) => {
  if (!Array.isArray(value)) return [...fallback];

  return [...new Set(
    value
      .map(item => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
  )];
};

const normalizeRoutingRules = (value) => {
  if (!Array.isArray(value)) return [];

  const rules = value
    .map((rule, index) => ({
      id: String(rule?.id || `${Date.now()}-${index}`),
      owner: typeof rule?.owner === 'string' ? rule.owner.trim() : '',
      client: typeof rule?.client === 'string' && rule.client.trim() ? rule.client.trim() : 'All clients',
      module: typeof rule?.module === 'string' && rule.module.trim() ? rule.module.trim() : 'All modules',
    }))
    .filter(rule => rule.owner);

  return rules;
};

const normalizeModules = (value) => {
  if (!Array.isArray(value)) return [];

  const modules = value
    .map((module, index) => ({
      id: String(module?.id || `${Date.now()}-${index}`),
      name: typeof module?.name === 'string' ? module.name.trim() : '',
      subModules: normalizeTextList(module?.subModules),
    }))
    .filter(module => module.name);

  return modules;
};

const normalizeSettings = (record = {}) => ({
  id: record.id || GLOBAL_SETTINGS_ID,
  departments: normalizeTextList(record.departments, DEFAULT_SETTINGS.departments),
  clients: normalizeTextList(record.clients, DEFAULT_SETTINGS.clients),
  routingRules: normalizeRoutingRules(record.routing_rules ?? record.routingRules),
  modules: normalizeModules(record.modules),
  updated_at: record.updated_at || null,
});

const toDbPayload = (settings) => ({
  id: GLOBAL_SETTINGS_ID,
  departments: normalizeTextList(settings.departments, DEFAULT_SETTINGS.departments),
  clients: normalizeTextList(settings.clients, DEFAULT_SETTINGS.clients),
  routing_rules: normalizeRoutingRules(settings.routingRules),
  modules: normalizeModules(settings.modules),
  updated_at: new Date().toISOString(),
});

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

const readSettings = async () => {
  const { data, error } = await supabaseAdmin
    .from('company_settings')
    .select('*')
    .eq('id', GLOBAL_SETTINGS_ID)
    .limit(1);

  if (error) throw error;

  const row = Array.isArray(data) && data.length > 0 ? data[0] : null;
  if (!row) {
    return normalizeSettings({ id: GLOBAL_SETTINGS_ID });
  }

  return normalizeSettings(row);
};

// GET /api/company-settings
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const settings = await readSettings();
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/company-settings
router.put('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const currentSettings = await readSettings();
    const nextSettings = normalizeSettings({
      ...currentSettings,
      ...req.body,
    });

    const { data, error } = await supabaseAdmin
      .from('company_settings')
      .upsert(toDbPayload(nextSettings), { onConflict: 'id' })
      .select('*');

    if (error) throw error;

    const saved = Array.isArray(data) && data.length > 0 ? data[0] : nextSettings;
    res.json({ settings: normalizeSettings(saved) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;