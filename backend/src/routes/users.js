// handles all user management - listing, editing roles, creating and deleting users
import express from 'express';
import supabaseAdmin, { supabaseDB } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// only let admins through for any write operations
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// returns all users merged from both the auth table and profiles table
router.get('/', requireAuth, async (req, res) => {
  try {
    const [{ data: profiles, error: profilesError }, { data: authData, error: authError }] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false }),
      supabaseAdmin.auth.admin.listUsers(),
    ]);

    if (profilesError) throw profilesError;
    if (authError) throw authError;

    const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]));
    const authUsers = authData?.users || [];

    const mergedUsers = authUsers.map((authUser) => {
      const profile = profileMap.get(authUser.id) || {};
      const nameFromProfile = typeof profile.full_name === 'string' ? profile.full_name.trim() : '';
      const nameFromAuth = typeof authUser.user_metadata?.name === 'string' ? authUser.user_metadata.name.trim() : '';

      return {
        id: authUser.id,
        email: authUser.email,
        full_name: nameFromProfile || nameFromAuth || authUser.email?.split('@')[0] || 'User',
        role: profile.role || authUser.user_metadata?.app_role || 'customer',
        department: profile.department || null,
        created_at: profile.created_at || authUser.created_at,
        updated_at: profile.updated_at || authUser.updated_at || authUser.created_at,
      };
    });

    const profileOnlyUsers = (profiles || [])
      .filter((profile) => !authUsers.some((authUser) => authUser.id === profile.id))
      .map((profile) => ({
        ...profile,
        full_name: profile.full_name || profile.email?.split('@')[0] || 'User',
        role: profile.role || 'customer',
      }));

    const users = [...mergedUsers, ...profileOnlyUsers].sort((left, right) => {
      return new Date(right.created_at || 0) - new Date(left.created_at || 0);
    });

    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// changes a single user's role - has the 2 admin max rule built in
router.patch('/:id/role', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['admin', 'agent', 'customer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
  }

  if (req.user.id === id) {
    return res.status(400).json({ message: "You cannot change your own role." });
  }

    // MAX 2 ADMINS - don't allow a third admin to be promoted
  if (role === 'admin') {
    const { data: currentAdmins } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'admin');
    
    if (currentAdmins && currentAdmins.length >= 2) {
      return res.status(400).json({ message: 'Maximum 2 admins allowed. Please remove an existing admin first.' });
    }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: `Role updated to ${role}`, user: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// update a user's profile details including role, department, and name
router.patch('/:id/profile', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role, department, full_name } = req.body;

    // if someone is trying to change the role, run through the validation checks first
  if (role) {
    const validRoles = ['admin', 'agent', 'customer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    if (req.user.id === id && role !== req.user.role) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }

    if (role === 'admin') {
      const { data: currentAdmins } = await supabaseAdmin
        .from('profiles').select('id').eq('role', 'admin');
      
      // if they're already an admin we don't count them again against the limit
      const isAlreadyAdmin = currentAdmins?.some(a => a.id === id);
      if (!isAlreadyAdmin && currentAdmins && currentAdmins.length >= 2) {
        return res.status(400).json({ message: 'Maximum 2 admins allowed. Please remove an existing admin first.' });
      }
    }
  }

  try {
    const updatePayload = {};
    if (role) updatePayload.role = role;
    if (department !== undefined) updatePayload.department = department === 'No Department' ? null : department;
    // full_name will work once the column is added to the database via migration

    const { data, error } = await supabaseDB
      .from('profiles')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Profile updated successfully', user: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// lets an admin reset any user's password
router.patch('/:id/password', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.trim().length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { password });
    if (error) throw error;
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// creates a brand new user account with a specified role
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { email, password, name, role = 'customer' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const validRoles = ['admin', 'agent', 'customer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

    // MAX 2 ADMINS - same rule applies when creating a new admin account
  if (role === 'admin') {
    const { data: currentAdmins } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'admin');
    
    if (currentAdmins && currentAdmins.length >= 2) {
      return res.status(400).json({ message: 'Maximum 2 admins allowed. Please remove an existing admin first.' });
    }
  }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: name || email },
    });

    if (authError) throw authError;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: authData.user.email,
        role,
      }, { onConflict: 'id' })
      .select()
      .single();

    if (profileError) throw profileError;

    res.status(201).json({ message: 'User created successfully', user: profile });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// permanently removes a user from both auth and the profiles table
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (req.user.id === id) {
    return res.status(400).json({ message: "You cannot delete your own account." });
  }

  try {
    // delete from auth first, then clean up the profile row in case there's no cascade set up
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) throw authError;

    // Also delete profile row manually in case there's no cascade
    await supabaseAdmin.from('profiles').delete().eq('id', id);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
