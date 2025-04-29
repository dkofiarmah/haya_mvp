import { type CookieOptions, createServerClient as supabaseCreateServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

// Export a wrapper function for convenience - this is what most of the app uses
export async function createServerClient() {
  const cookieStore = cookies()
  
  return supabaseCreateServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )
}

// Keep the original function for backward compatibility
export { supabaseCreateServerClient as createServerClient }

export async function createClient() {
  const cookieStore = cookies()
  
  return supabaseCreateServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )
}

// Create an admin client with the service role key
export function createAdminClient() {
  return supabaseCreateServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return undefined // Admin client doesn't need cookies
        },
        set(name: string, value: string, options: CookieOptions) {
          // Admin client doesn't need to set cookies
        },
        remove(name: string, options: CookieOptions) {
          // Admin client doesn't need to remove cookies
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
