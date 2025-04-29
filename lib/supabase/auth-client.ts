'use client';

import { supabaseClient } from './browser'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * This file provides Supabase clients for client components.
 * It uses the SSR browser client to prevent multiple GoTrueClient instances.
 */

// Re-export the singleton client
export { supabaseClient }

// Type for convenience
export type TypedSupabaseClient = SupabaseClient<Database>
