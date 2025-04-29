'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

/**
 * This file creates a Supabase client for browser components that automatically
 * connects to the appropriate Supabase instance based on the environment.
 * 
 * In development mode: Uses localhost Supabase
 * In production mode: Uses cloud Supabase
 */

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton client instance for browser use
export const supabaseClient = createClientComponentClient<Database>({
  // Force the URL and anon key to ensure we're using the right environment
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
  // We're not using the cache-busting mechanism anymore as it interferes with complex queries
  // Instead, we'll use a more targeted approach in specific functions that need it
})


/**
 * IMPORTANT: To avoid the 'Multiple GoTrueClient instances detected' warning,
 * always import the supabaseClient from '@/lib/supabase/auth-client'
 * Instead of creating new clients with createClientComponentClient()
 */

