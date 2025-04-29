'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

// Create a client for server components that uses cookies for auth
export async function createServerClient() {
  return createServerComponentClient<Database>({
    cookies,
  })
}

// Create a standalone Supabase client (for compatibility with older code)
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    db: { schema: 'public' }
  })
}

// Create a client for API routes that uses cookies for auth
export async function createApiClient() {
  return createRouteHandlerClient({
    cookies,
  })
}

// Create a direct server client for server actions, without cookie dependency
export async function createDirectServerClient() {
  // Default to localhost values for Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
  
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Create an admin client for server-side operations
export async function createAdminClient() {
  // Default to localhost values for Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
  
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  })
}