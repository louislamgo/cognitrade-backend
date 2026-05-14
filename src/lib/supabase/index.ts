import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client.
 *
 * Requires SUPABASE_URL and SUPABASE_ANON_KEY environment variables.
 * Falls back gracefully when they are absent (e.g., during local dev without
 * a real Supabase project), returning null so callers can handle the absence.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('[supabase] SUPABASE_URL or SUPABASE_ANON_KEY is not set. Supabase client is unavailable.');
    return null;
  }

  if (!_client) {
    _client = createClient(url, key);
  }

  return _client;
}

/**
 * Returns a Supabase admin client that uses the service-role key.
 * Use only in server-side contexts — never expose to the browser.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn('[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. Admin client is unavailable.');
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
