import { supabaseClient } from '@/lib/supabase/browser'

// Create a single instance of the client
const aiServiceClient = supabaseClient

// Fetch all AI assistants
export async function getAIAssistants() {
  const { data, error } = await aiServiceClient
    .from('ai_assistants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching AI assistants:", error)
    throw error
  }

  // Ensure the data is serializable for Next.js by creating a plain JSON object
  return data ? JSON.parse(JSON.stringify(data)) : []
}

// Fetch a single AI assistant by ID
export async function getAIAssistant(id: string) {
  const { data, error } = await aiServiceClient
    .from('ai_assistants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error("Error fetching AI assistant:", error)
    throw error
  }

  // Ensure the data is serializable for Next.js
  return data ? JSON.parse(JSON.stringify(data)) : null
}

// Create a new AI assistant
export async function createAIAssistant(assistantData: any) {
  const { data, error } = await aiServiceClient
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

// Update an existing AI assistant
export async function updateAIAssistant(id: string, assistantData: any) {
  const { data, error } = await aiServiceClient
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

// Delete an AI assistant
export async function deleteAIAssistant(id: string) {
  const { error } = await aiServiceClient
    .from('ai_assistants')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error deleting AI assistant:", error)
    throw error
  }
}

// Generate a response from an AI assistant
export async function generateAIResponse(assistantId: string, message: string, conversationId?: string | null) {
  // First get the assistant to check its configuration
  const { data: assistant, error: assistantError } = await aiServiceClient
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
    const { data, error } = await aiServiceClient
      .from('conversations')
      .update(conversationData)
      .eq('id', conversationId)
      .select()
      .single()

    if (error) throw error
    conversation = data
  } else {
    const { data, error } = await aiServiceClient
      .from('conversations')
      .insert([conversationData])
      .select()
      .single()

    if (error) throw error
    conversation = data
  }

  // Store the message
  const { error: messageError } = await aiServiceClient
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
  const { error: responseError } = await aiServiceClient
    .from('messages')
    .insert([{
      conversation_id: conversation.id,
      content: response.message,
      role: 'assistant'
    }])

  if (responseError) throw responseError

  // Update conversation with the response
  const { error: updateError } = await aiServiceClient
    .from('conversations')
    .update({
      last_response: response.message,
      updated_at: new Date().toISOString()
    })
    .eq('id', conversation.id)

  if (updateError) throw updateError

  return response
}

/**
 * Generate a response from an assistant based on a prompt and conversation history
 * This is the function expected by the API route
 */
export async function generateAssistantResponse(assistantId: string, prompt: string, conversationHistory: any[] = []) {
  try {
    // Get the assistant details
    const { data: assistant, error: assistantError } = await aiServiceClient
      .from('ai_assistants')
      .select('*')
      .eq('id', assistantId)
      .single()
    
    if (assistantError) {
      console.error("Error fetching assistant:", assistantError)
      throw assistantError
    }

    if (!assistant) {
      throw new Error(`Assistant with ID ${assistantId} not found`)
    }

    // You would typically call an AI service here with the conversation history
    // For now, return a simple response with the assistant name
    
    // Process the conversation history if needed
    const processedHistory = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Construct a response
    // This is where you would integrate with your AI provider (OpenAI, Anthropic, etc.)
    return `This is a response from assistant "${assistant.name}" to your prompt: "${prompt}"`
  } catch (error) {
    console.error("Error generating assistant response:", error)
    throw error
  }
}

/**
 * Save a message to the database
 * Used by the API route to save both user prompts and assistant responses
 */
export async function saveMessage(conversationId: string, role: 'user' | 'assistant', content: string, assistantId?: string) {
  try {
    const messageData = {
      conversation_id: conversationId,
      content: content,
      role: role,
      assistant_id: assistantId || null,
      created_at: new Date().toISOString()
    }

    const { data, error } = await aiServiceClient
      .from('messages')
      .insert([messageData])
      .select()
      .single()

    if (error) {
      console.error("Error saving message:", error)
      throw error
    }

    // Update the conversation's last message or response
    const updateData = role === 'user' 
      ? { last_message: content, updated_at: new Date().toISOString() }
      : { last_response: content, updated_at: new Date().toISOString() }

    const { error: updateError } = await aiServiceClient
      .from('conversations')
      .update(updateData)
      .eq('id', conversationId)

    if (updateError) {
      console.error("Error updating conversation:", updateError)
      throw updateError
    }

    return data
  } catch (error) {
    console.error("Error in saveMessage:", error)
    throw error
  }
}
