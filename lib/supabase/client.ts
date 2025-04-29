import { supabaseClient } from './auth-client'

// Re-export the client component client to avoid multiple instances
export const supabase = supabaseClient
