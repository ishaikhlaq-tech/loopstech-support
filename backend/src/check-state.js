import 'dotenv/config';
import supabaseAdmin from './config/supabase.js';

async function checkState() {
  console.log("Checking profiles:");
  const { data: profiles } = await supabaseAdmin.from('profiles').select('*');
  console.log(profiles);

  console.log("\nChecking auth.users:");
  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  users.users.forEach(u => {
    console.log(`- ${u.email} (ID: ${u.id})`);
  });
}
checkState();
