'use client'

import { supabaseClient } from '@/lib/supabase/browser'
import type { Database } from '@/types/supabase'

// Client-side AI service functions
export async function getAIAssistants() {
  const { data, error } = await supabaseClient
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
  const { data, error } = await supabaseClient
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

export async function generateAIResponse(assistantId: string, message: string, conversationId?: string | null) {
  // First get the assistant to check its configuration
  const { data: assistant, error: assistantError } = await supabaseClient
    .from('ai_assistants')
    .select('*')
    .eq('id', assistantId)
    .single()

  if (assistantError) {
    throw assistantError
  }

  // Create or update conversation
  const conversationData = {
    assistant_id: assistantId,
    last_message: message,
    last_response: null,
    status: 'active',
    updated_at: new Date().toISOString()
  }

  let conversation
  if (conversationId) {
    const { data, error } = await supabaseClient
      .from('conversations')
      .update(conversationData)
      .eq('id', conversationId)
      .select()
      .single()

    if (error) throw error
    conversation = data
  } else {
    const { data, error } = await supabaseClient
      .from('conversations')
      .insert([conversationData])
      .select()
      .single()

    if (error) throw error
    conversation = data
  }

  // Store the message
  const { error: messageError } = await supabaseClient
    .from('messages')
    .insert([{
      conversation_id: conversation.id,
      content: message,
      role: 'user'
    }])

  if (messageError) throw messageError

  // Call the AI service here and get the response
  // This is where you would integrate with your specific AI provider

  // For now, return a mock response
  const response = {
    conversationId: conversation.id,
    message: `This is a mock response to: ${message}`
  }

  // Store the AI response
  const { error: responseError } = await supabaseClient
    .from('messages')
    .insert([{
      conversation_id: conversation.id,
      content: response.message,
      role: 'assistant'
    }])

  if (responseError) throw responseError

  // Update conversation with the response
  const { error: updateError } = await supabaseClient
    .from('conversations')
    .update({
      last_response: response.message,
      updated_at: new Date().toISOString()
    })
    .eq('id', conversation.id)

  if (updateError) throw updateError

  return response
}
