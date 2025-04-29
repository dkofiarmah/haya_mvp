import type { Database } from './supabase'

export type Document = Database['public']['Tables']['documents']['Row']

export type DocumentsList = Document[]
