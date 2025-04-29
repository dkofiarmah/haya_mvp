import { createClient } from '@supabase/supabase-js';

// Create and export a function to get the Supabase client
// This helps prevent multiple client instances in Next.js

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

let supabaseInstance = null;

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}
