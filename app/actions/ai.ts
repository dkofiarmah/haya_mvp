'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

export async function getAIAssistants() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ai_assistants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching AI assistants:", error)
    throw error
  }

  return data
}

export async function getAIAssistant(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ai_assistants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error("Error fetching AI assistant:", error)
    throw error
  }

  return data
}

export async function createAIAssistant(assistantData: any) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ai_assistants')
    .insert([assistantData])
    .select()
    .single()

  if (error) {
    console.error("Error creating AI assistant:", error)
    throw error
  }

  return data
}

export async function updateAIAssistant(id: string, assistantData: any) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ai_assistants')
    .update(assistantData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error("Error updating AI assistant:", error)
    throw error
  }

  return data
}

export async function deleteAIAssistant(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('ai_assistants')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error deleting AI assistant:", error)
    throw error
  }
}
