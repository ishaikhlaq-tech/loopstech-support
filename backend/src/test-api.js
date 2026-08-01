import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const API_URL = 'http://localhost:5000/api';

async function testBackend() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  // Actually we need to login via the API to simulate the frontend
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ali@gmail.com', password: 'password123' }) // Assuming password is password123, or I can just use auth/me with a token if I can generate one
    });
    const loginData = await loginRes.json();
    console.log("Login data:", Object.keys(loginData));
    
    if (!loginData.token) {
      console.log("Could not login. Please check credentials.");
      return;
    }
    
    const token = loginData.token;
    
    // Check auth/me
    const meRes = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    console.log("Auth /me role:", meData.user?.role);
    
    // Check tickets
    const ticketsRes = await fetch(`${API_URL}/tickets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const ticketsData = await ticketsRes.json();
    console.log(`Fetched ${ticketsData.length || 0} tickets:`, ticketsData.map(t => t.title));
    
  } catch(err) {
    console.error("Test failed:", err);
  }
}

testBackend();
