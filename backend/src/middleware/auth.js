// this middleware checks if the request has a valid token before allowing access
import supabaseAdmin, { supabaseDB } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }

    // read the role from profiles using the dedicated DB client so RLS doesn't interfere
    const { data: profilesList } = await supabaseDB
      .from('profiles')
      .select('role')
      .eq('id', user.id);

    const profile = profilesList && profilesList.length > 0 ? profilesList[0] : null;

    // attach the user object and their role to the request so other routes can use it
    req.user = {
      ...user,
      role: profile?.role || 'customer',
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: `Unauthorized: ${err.message}` });
  }
};
