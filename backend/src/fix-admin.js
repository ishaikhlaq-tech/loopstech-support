import 'dotenv/config';
import supabaseAdmin from './config/supabase.js';

async function fixAdminRole() {
  console.log("Searching for profiles...");
  try {
    const { data: profiles, error } = await supabaseAdmin.from('profiles').select('*');
    if (error) {
      console.error("Error fetching profiles:", error);
      return;
    }
    console.log("Found profiles:", profiles);
    
    // Find a profile that might be ali
    const aliProfile = profiles.find(p => p.email.toLowerCase().includes('ali'));
    
    if (aliProfile) {
      console.log(`Found Ali's profile! ID: ${aliProfile.id}, Email: ${aliProfile.email}`);
      const { data: updated, error: updateErr } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', aliProfile.id)
        .select()
        .single();
        
      if (updateErr) {
        console.error("Error updating role:", updateErr);
      } else {
        console.log("Successfully updated role to ADMIN:", updated);
      }
    } else {
      console.log("Could not find any profile with 'ali' in the email.");
      // Check auth.users just in case profile wasn't created
      const { data: users, error: authErr } = await supabaseAdmin.auth.admin.listUsers();
      if (authErr) {
        console.error("Error fetching users:", authErr);
      } else {
        const aliUser = users.users.find(u => u.email.toLowerCase().includes('ali'));
        if (aliUser) {
          console.log(`Found user in auth.users: ${aliUser.email}, ID: ${aliUser.id}`);
          console.log("Creating profile for this user...");
          const { data: newProfile, error: insertErr } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: aliUser.id,
              email: aliUser.email,
              role: 'admin'
            })
            .select()
            .single();
          if (insertErr) {
            console.error("Error creating profile:", insertErr);
          } else {
            console.log("Successfully created profile with ADMIN role:", newProfile);
          }
        } else {
          console.log("Could not find Ali in auth.users either. Please create an account first.");
        }
      }
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

fixAdminRole();
