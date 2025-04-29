// filepath: /Users/danny_1/_PROJECTS_/haya/haya_mvp/lib/supabase/server-client.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

/**
 * This file creates a Supabase client for server components.
 * For client components, use client-singleton.ts instead.
 */

/**
 * Creates a Supabase client for use in server components
 * This function should be called within server components when needed
 */
export function createServerClient() {
  return createServerComponentClient<Database>({
    cookies,
  })
}
