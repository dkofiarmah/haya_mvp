'use server'

import { createServerClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { logExperienceAction } from './experience-audit'

// Generate or regenerate a shareable token for an experience
export async function generateExperienceShareableToken(id: string) {
  try {
    const supabase = await createServerClient()
    
    // Generate a new token
    const shareable_token = uuidv4()
    
    // Update the experience with the new token
    const { error } = await supabase
      .from('experiences')
      .update({ 
        shareable_token,
        is_shareable: true // Make sure it's shareable when generating a token
      })
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to generate shareable token: ${error.message}`)
    }
    
    // Get the base URL from environment or default to localhost
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const shareable_url = `${baseUrl}/experiences/public/${shareable_token}`
    
    // Update with the shareable URL
    await supabase
      .from('experiences')
      .update({ shareable_url })
      .eq('id', id)
    
    // Log the sharing action
    await logExperienceAction(id, 'shared')
    
    return { 
      success: true, 
      shareable_token,
      shareable_url
    }
  } catch (error) {
    console.error('Error in generateExperienceShareableToken:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// This is an alias for the function above to match component expectations
export const regenerateShareableToken = generateExperienceShareableToken

// Toggle the shareable status of an experience
export async function toggleExperienceShareableStatus(id: string, shareable: boolean) {
  try {
    const supabase = await createServerClient()
    
    // Generate a token if making shareable and no token exists
    let updateData: any = { is_shareable: shareable }
    
    if (shareable) {
      // Check if the experience already has a token
      const { data } = await supabase
        .from('experiences')
        .select('shareable_token')
        .eq('id', id)
        .single()
      
      if (!data?.shareable_token) {
        // Generate a new token
        updateData.shareable_token = uuidv4()
        
        // Get the base URL from environment or default to localhost
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        updateData.shareable_url = `${baseUrl}/experiences/public/${updateData.shareable_token}`
      }
    }
    
    // Update the experience
    const { error } = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to update experience shareable status: ${error.message}`)
    }
    
    // Log the action
    await logExperienceAction(id, 'updated', { is_shareable: shareable })
    
    return { 
      success: true,
      ...updateData 
    }
  } catch (error) {
    console.error('Error in toggleExperienceShareableStatus:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Update experience sharing settings
export async function updateExperienceSharingSettings(
  id: string, 
  settings: { isShareable: boolean, isBookable: boolean }
) {
  try {
    const supabase = await createServerClient()
    
    // Prepare update data
    const updateData: {
      is_shareable: boolean;
      is_bookable_online: boolean;
      shareable_token?: string;
      shareable_url?: string;
    } = {
      is_shareable: settings.isShareable,
      is_bookable_online: settings.isBookable
    }
    
    // Generate token if needed
    if (settings.isShareable) {
      // Check if the experience already has a token
      const { data } = await supabase
        .from('experiences')
        .select('shareable_token')
        .eq('id', id)
        .single()
      
      if (!data?.shareable_token) {
        updateData.shareable_token = uuidv4()
        
        // Get the base URL from environment or default to localhost
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        updateData.shareable_url = `${baseUrl}/experiences/public/${updateData.shareable_token}`
      }
    }
    
    // Update the experience
    const { error } = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to update sharing settings: ${error.message}`)
    }
    
    // Get the updated experience with token
    const { data: updatedExperience } = await supabase
      .from('experiences')
      .select('shareable_token, shareable_url')
      .eq('id', id)
      .single()
    
    // Log the action
    await logExperienceAction(id, 'updated', { 
      is_shareable: settings.isShareable,
      is_bookable_online: settings.isBookable
    })
    
    return { 
      success: true,
      shareable_token: updatedExperience?.shareable_token,
      shareable_url: updatedExperience?.shareable_url
    }
  } catch (error) {
    console.error('Error in updateExperienceSharingSettings:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Get experience by shareable token
export async function getExperienceByShareableToken(token: string) {
  try {
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('experiences')
      .select(`
        *,
        organizations (
          id,
          name,
          logo_url
        )
      `)
      .eq('shareable_token', token)
      .eq('is_shareable', true) // Must be shareable
      .eq('is_archived', false) // Must not be archived
      .single()
    
    if (error) {
      throw new Error(`Experience not found: ${error.message}`)
    }
    
    // Log the view
    await logExperienceAction(data.id, 'viewed')
    
    // Increment view count
    await supabase.rpc('increment_experience_view_count', { 
      experience_id: data.id 
    }).catch((err: Error) => {
      console.error('Error incrementing view count:', err)
    })
    
    return { success: true, experience: data }
  } catch (error) {
    console.error('Error in getExperienceByShareableToken:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
