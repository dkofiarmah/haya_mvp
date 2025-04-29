'use server'

import { cache } from 'react'
import { createServerClient } from "./supabase-server"
import type { Database } from "@/types/supabase"

export const getDocuments = async () => {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching documents:", error)
    throw error
  }

  return data
}
