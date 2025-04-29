'use server'

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

export async function getDocuments() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
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
