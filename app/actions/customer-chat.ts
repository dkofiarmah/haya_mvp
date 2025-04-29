'use server'

import { createClient } from '@/app/supabase-server'
import { v4 as uuidv4 } from 'uuid'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Define expected types
type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function sendChatMessage({
  message,
  orgId,
  customerId,
  experienceId,
  sessionId,
  history
}: {
  message: string
  orgId: string
  customerId?: string
  experienceId?: string
  sessionId?: string
  history: ChatMessage[]
}) {
  try {
    // Create Supabase client
    const supabase = createClient()
    
    // Get or create agent for this organization
    const { data: agentData, error: agentError } = await supabase
      .from('agents')
      .select('id, name, type, memory_json')
      .eq('org_id', orgId)
      .eq('type', 'customer_assistant')
      .eq('is_active', true)
      .limit(1)
      .single()
      
    if (agentError && agentError.code !== 'PGRST116') {
      console.error('Error fetching agent:', agentError)
      return { success: false, error: 'Failed to load digital assistant' }
    }
    
    // If no agent exists, create one
    let agentId = ''
    if (!agentData) {
      const { data: newAgent, error: createError } = await supabase
        .from('agents')
        .insert({
          id: uuidv4(),
          org_id: orgId,
          name: 'Customer Assistant',
          type: 'customer_assistant',
          description: 'Helps customers with inquiries and bookings',
          is_active: true,
          state: {},
          memory_json: { conversations: [] },
          metadata: { created_via: 'automated_initialization' }
        })
        .select('id')
        .single()
        
      if (createError) {
        console.error('Error creating agent:', createError)
        return { success: false, error: 'Failed to initialize digital assistant' }
      }
      
      agentId = newAgent.id
    } else {
      agentId = agentData.id
    }
    
    // Prepare context information about the experience if applicable
    let experienceContext = ''
    if (experienceId) {
      const { data: experience } = await supabase
        .from('experiences')
        .select('name, description, category, duration_minutes, price_per_person, location, highlights')
        .eq('id', experienceId)
        .single()
        
      if (experience) {
        experienceContext = `
          Experience Information:
          Name: ${experience.name}
          Category: ${experience.category}
          Location: ${experience.location}
          Duration: ${experience.duration_minutes} minutes
          Price: $${experience.price_per_person} per person
          Description: ${experience.description}
          Highlights: ${experience.highlights?.join(', ') || 'None specified'}
        `
      }
    }
    
    // Prepare context about the customer if applicable
    let customerContext = ''
    if (customerId) {
      const { data: customer } = await supabase
        .from('customers')
        .select('name, preferences, trip_history')
        .eq('id', customerId)
        .single()
        
      if (customer) {
        customerContext = `
          Customer Information:
          Name: ${customer.name || 'Unknown'}
          Preferences: ${JSON.stringify(customer.preferences)}
          Past Trips: ${customer.trip_history?.length || 0} trips on record
        `
      }
    }
    
    // Create conversation ID if needed
    const conversationId = sessionId || uuidv4()
    
    // Build the messages for the AI, including history
    const systemPrompt = `You are a helpful digital travel assistant for a tour operator. 
Your goal is to help customers find and book experiences that match their interests.
Respond in a friendly, conversational manner.

${experienceContext}

${customerContext}

Guidelines:
- Be concise and helpful
- Provide specific information about experiences when asked
- Help with booking processes
- For pricing questions, be specific with the numbers provided
- If asked about availability, suggest checking with specific dates
- Never make up information you don't have
- If you need more information from the customer, ask specific questions
- When a customer seems ready to book, offer to start the booking process for them`

    // Combine system prompt with conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ]
    
    // Get the preferred model from configuration if available
    const { data: modelConfig } = await supabase
      .from('models_config')
      .select('preferred_llm, config_details')
      .eq('org_id', orgId)
      .eq('agent_type', 'customer_assistant')
      .limit(1)
      .single()
      
    const model = modelConfig?.preferred_llm || 'gpt-4-turbo'
    
    // Call OpenAI API for response
    const completion = await openai.chat.completions.create({
      model,
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500
    })
    
    const assistantResponse = completion.choices[0]?.message?.content || 
      "I'm sorry, I'm having trouble processing your request right now. Please try again."
    
    // Log the conversation in agent_logs
    await supabase.from('agent_logs').insert({
      id: uuidv4(),
      agent_id: agentId,
      event: 'customer_chat',
      details: {
        conversation_id: conversationId,
        customer_message: message,
        assistant_response: assistantResponse,
        experience_id: experienceId,
        model_used: model
      },
      customer_id: customerId,
      session_id: conversationId
    })
    
    // Update agent memory with conversation
    const updatedMemory = {
      conversations: [
        ...(agentData?.memory_json?.conversations || []).slice(-5), // Keep last 5 conversations
        {
          id: conversationId,
          timestamp: new Date().toISOString(),
          customer_id: customerId,
          messages: [
            ...history.slice(-5), // Keep just the recent history
            { role: 'user', content: message },
            { role: 'assistant', content: assistantResponse }
          ]
        }
      ]
    }
    
    await supabase
      .from('agents')
      .update({ 
        memory_json: updatedMemory,
        updated_at: new Date().toISOString()
      })
      .eq('id', agentId)
    
    // Return the response
    return {
      success: true,
      response: assistantResponse,
      conversationId
    }
  } catch (error) {
    console.error('Error in sendChatMessage:', error)
    return { 
      success: false, 
      error: 'Failed to process message. Please try again.'
    }
  }
}
