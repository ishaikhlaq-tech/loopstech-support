// handles signup, login, token refresh and fetching the current user's info
import express from 'express';
import supabaseAdmin, { supabaseDB } from '../config/supabase.js';

const router = express.Router();

// sign up a new user - always creates them as a customer by default
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    // auto-confirm the email so they can log in straight away without verification
      user_metadata: { name },
    });

    if (error) throw error;

    // make sure the profile row gets created with customer role
    // using select at the end so we don't error if a db trigger already made one
    await supabaseAdmin.from('profiles').insert({
      id: data.user.id,
      email: data.user.email,
      role: 'customer',
    }).select();

    res.status(201).json({
      message: 'Signup successful!',
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// log in an existing user and return their token plus their role
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user?.id) {
      console.error('[LOGIN FATAL] data.user.id is missing! data keys:', Object.keys(data || {}));
      throw new Error('Supabase returned missing user ID on login.');
    }

    // read the role from our profiles table using the dedicated DB client so RLS doesn't block it
    const { data: profilesList, error: profileError } = await supabaseDB
      .from('profiles')
      .select('role')
      .eq('id', data.user.id);
      
    console.log(`[LOGIN DEBUG] rows fetched for id ${data.user.id}:`, profilesList);
    
    const profile = profilesList && profilesList.length > 0 ? profilesList[0] : null;

    const resolvedRole = profile?.role || 'customer';
    console.log(`[LOGIN] ${data.user.email} (ID: ${data.user.id}) => profile role: ${profile?.role}, resolved: ${resolvedRole}, profileError: ${profileError?.message}`);

    res.json({
      message: 'Login successful!',
      token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: { ...data.user, app_role: resolvedRole, role: resolvedRole },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// use the refresh token to silently get a new access token when the old one expires
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token,
    });

    if (error || !data.session) throw error || new Error('Could not refresh session.');

    res.json({
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch (err) {
    res.status(401).json({ message: 'Refresh token expired. Please login again.' });
  }
});

// returns the currently logged in user along with their role - used on page refresh
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided.' });
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // read the role from profiles using the dedicated DB client so RLS doesn't block it
    const { data: profilesList, error: profileError } = await supabaseDB
      .from('profiles')
      .select('role, email')
      .eq('id', user.id);

    let profile = profilesList && profilesList.length > 0 ? profilesList[0] : null;

    // if no profile row exists yet, create one now with customer as the default role
    if (!profile) {
      const { data: newProfiles } = await supabaseDB
        .from('profiles')
        .insert({ id: user.id, email: user.email, role: 'customer' })
        .select('role, email');
        
      profile = newProfiles && newProfiles.length > 0 ? newProfiles[0] : null;
      
      const resolvedRole = profile?.role || 'customer';
      console.log(`[ME] ${user.email} => new profile created, role: ${resolvedRole}`);
      return res.json({ user: { ...user, app_role: resolvedRole, role: resolvedRole } });
    }

    const resolvedRole = profile?.role || 'customer';
    console.log(`[ME] ${user.email} => profile role: ${profile?.role}, resolved: ${resolvedRole}, error: ${profileError?.message}`);
    res.json({ user: { ...user, app_role: resolvedRole, role: resolvedRole } });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

export default router;
