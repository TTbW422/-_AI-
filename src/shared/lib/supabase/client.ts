import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/shared/types/database.types';

export function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be configured in environment variables.');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
