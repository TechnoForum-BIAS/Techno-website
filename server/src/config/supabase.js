const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
// Prefer service_role key (which bypasses RLS on the server) if provided, otherwise anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase Client initialized successfully.');
} else {
  console.warn('⚠️ Supabase credentials not found or placeholder values used. Using in-memory fallback for local intern development.');
}

module.exports = { supabase };
