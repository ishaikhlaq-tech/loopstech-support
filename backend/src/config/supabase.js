import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables in backend .env');
}

// this is the main client we use for auth stuff like signing users in
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// this is a separate client only for reading and writing data from the database
// we never use this one for login - that way the session state stays clean and RLS doesn't interfere
export const supabaseDB = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: { 'x-supabase-bypass-rls': 'true' }
  }
});

export default supabaseAdmin;
