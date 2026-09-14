import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  (supabaseServiceKey || supabaseAnonKey) &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

/**
 * Server-only client for read and server-side data fetching.
 * Uses anon key for public RLS compliance unless admin operation is specifically needed.
 */
export function createServerClient() {
  if (!isServerSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Service-role client for background administration and queue triage.
 * NEVER call this from client components or expose to frontend.
 */
export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey || supabaseUrl === 'https://your-project.supabase.co') {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
