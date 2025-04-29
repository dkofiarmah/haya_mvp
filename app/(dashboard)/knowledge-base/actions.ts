'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

export async function getDocuments() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching documents:", error)
    throw error
  }

  return data
}
