import { createServerClient as supabaseCreateServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase server client to be used in server components,
 * route handlers, and API routes
 */
export async function createServerClient() {
  // Create and return the Supabase client
  return supabaseCreateServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          // Get the cookie value directly from the cookies() function
          return cookies().get(name)?.value
        },
        set(name, value, options) {
          // Set the cookie using the cookies() function
          cookies().set({ name, value, ...options })
        },
        remove(name, options) {
          // Delete the cookie using the cookies() function
          cookies().delete({ name, ...options })
        }
      }
    }
  )
}

/**
 * Legacy function for backward compatibility
 * @deprecated - Use createServerClient instead
 */
export async function createClient() {
  return createServerClient()
}

/**
 * Creates an admin client with service role key
 */
export function createAdminClient() {
  return supabaseCreateServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name) {
          return undefined // Admin client doesn't need cookies
        },
        set(name, value, options) {
          // Admin client doesn't need to set cookies
        },
        remove(name, options) {
          // Admin client doesn't need to remove cookies
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
