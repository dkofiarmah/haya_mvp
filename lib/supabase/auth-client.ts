'use client';

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { getSupabaseClient } from './global-client'

/**
 * This file provides Supabase clients for client components and admin operations.
 * It uses the singleton pattern to prevent multiple GoTrueClient instances.
 */

// Export the global singleton client 
export const supabaseClient = getSupabaseClient()

// Create a service role client for admin operations (only use in server contexts)
// This should only be imported in server-side code
export const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ? createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : null;
