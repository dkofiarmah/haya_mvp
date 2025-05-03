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
        async get(name) {
          // Get the cookie value using the async cookies() function
          const cookieStore = await cookies()
          return cookieStore.get(name)?.value
        },
        async set(name, value, options) {
          // Set the cookie using the async cookies() function
          const cookieStore = await cookies()
          cookieStore.set({ name, value, ...options })
        },
        async remove(name, options) {
          // Delete the cookie using the async cookies() function
          const cookieStore = await cookies()
          cookieStore.delete({ name, ...options })
        }
      }
    }
  )
}

/**
 * Alias for createServerClient to support direct server actions
 * that expect this function name
 */
export async function createDirectServerClient() {
  return createServerClient()
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
