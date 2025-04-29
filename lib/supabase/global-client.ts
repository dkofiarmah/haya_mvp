'use client';

/**
 * This is a global singleton client fix for Supabase
 * It helps consolidate client instances to avoid the warning:
 * "Multiple GoTrueClient instances detected in the same browser context"
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

// Create a single instance of the client
let supabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    // Create the client only once
    supabaseInstance = createClientComponentClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }
  
  return supabaseInstance;
}
