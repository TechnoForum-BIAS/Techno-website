const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase Client initialized successfully.');
} else {
  console.warn('⚠️ Supabase credentials not found or placeholder values used. Using in-memory fallback for local intern development.');
}

module.exports = { supabase };
