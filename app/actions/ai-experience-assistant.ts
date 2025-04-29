'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Enhance an experience description using AI
export async function enhanceExperienceDescription(experienceId: string, originalDescription: string) {
  try {
    // In a real implementation, this would call an AI service
    // For now, we'll simulate the enhanced description
    const enhancedDescription = simulateAIEnhancement(originalDescription)
    
    const supabase = await createServerClient()
    
    // Update the experience with the enhanced description
    const { error } = await supabase
      .from('experiences')
      .update({ 
        ai_description: enhancedDescription
      })
      .eq('id', experienceId)
    
    if (error) {
      throw new Error(`Failed to update experience with AI description: ${error.message}`)
    }
    
    revalidatePath(`/experiences/${experienceId}`)
    
    return { 
      success: true, 
      enhancedDescription
    }
  } catch (error) {
    console.error('Error in enhanceExperienceDescription:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Helper function to simulate AI enhancement of a description
// In a real implementation, this would call an AI service like OpenAI
function simulateAIEnhancement(originalDescription: string): string {
  // Simple simulation: add more details and emotive language
  const sentences = originalDescription.split('. ')
  
  // Make the description more detailed and emotive
  let enhancedDescription = ''
  
  if (sentences.length > 0) {
    // Enhance the intro
    enhancedDescription += `Experience the magic of ${sentences[0].toLowerCase()}. `
    
    // Add more details to the middle
    for (let i = 1; i < sentences.length - 1; i++) {
      const sentence = sentences[i]
      enhancedDescription += `${sentence}. `
    }
    
    // Add compelling conclusion
    if (sentences.length > 1) {
      enhancedDescription += `${sentences[sentences.length - 1]}. This unforgettable experience will leave you with memories to cherish for a lifetime.`
    } else {
      enhancedDescription += `This unforgettable experience will leave you with memories to cherish for a lifetime.`
    }
  } else {
    // Fallback if the description is too short
    enhancedDescription = `Experience the magic of this unique adventure. ${originalDescription} This unforgettable experience will leave you with memories to cherish for a lifetime.`
  }
  
  return enhancedDescription
}

// Apply the AI enhanced description
export async function applyAIDescription(experienceId: string) {
  try {
    const supabase = await createServerClient()
    
    // Get the AI-enhanced description
    const { data, error: fetchError } = await supabase
      .from('experiences')
      .select('ai_description')
      .eq('id', experienceId)
      .single()
    
    if (fetchError || !data?.ai_description) {
      throw new Error('No AI description available')
    }
    
    // Update the main description with the AI version
    const { error } = await supabase
      .from('experiences')
      .update({ 
        description: data.ai_description,
        // Clear the AI field to avoid confusion
        ai_description: null
      })
      .eq('id', experienceId)
    
    if (error) {
      throw new Error(`Failed to apply AI description: ${error.message}`)
    }
    
    revalidatePath(`/experiences/${experienceId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error in applyAIDescription:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
