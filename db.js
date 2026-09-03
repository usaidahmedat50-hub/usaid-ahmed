const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_API_KEY || 'placeholder-key';

let supabase = null;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (err) {
  console.warn('Supabase client initialization warning:', err.message || err);
}

module.exports = {
  supabase,
  createClient,
};
