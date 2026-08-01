import 'dotenv/config';
import supabaseAdmin from './config/supabase.js';

async function testSupabase() {
  console.log("Testing supabaseAdmin with SUPABASE_SERVICE_ROLE_KEY...");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("Key starts with:", key ? key.substring(0, 15) : "undefined");
  
  try {
    // Attempt an insert that violates RLS (if we are anon) but succeeds if service_role
    // Wait, let's just insert a dummy ticket
    const { data, error } = await supabaseAdmin
      .from('tickets')
      .insert([
        {
          title: "Test RLS bypass",
          description: "Testing if backend bypasses RLS",
          priority: "low",
          // Don't provide created_by, if RLS is bypassed it shouldn't matter (assuming created_by allows null or there is no policy requiring it, wait! created_by might be required by schema NOT NULL)
          // Let's check if we can select
        }
      ])
      .select();

    if (error) {
      console.error("Error inserting:", error);
    } else {
      console.log("Success! Data:", data);
      
      // cleanup
      if (data && data.length > 0) {
        await supabaseAdmin.from('tickets').delete().eq('id', data[0].id);
      }
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

testSupabase();
