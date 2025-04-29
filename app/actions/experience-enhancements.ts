'use server'

import { createServerClient } from '@/lib/supabase/server'
import { logExperienceAction } from './experience-audit'
import { revalidatePath } from 'next/cache'

// Archive experience
export async function archiveExperience(experienceId: string) {
  try {
    const supabase = await createServerClient()
    
    // Update the experience
    const { error } = await supabase
      .from('experiences')
      .update({
        is_archived: true,
        is_active: false // Also deactivate when archiving
      })
      .eq('id', experienceId)
    
    if (error) throw error
    
    // Log the action
    await logExperienceAction(experienceId, 'archived')
    
    // Revalidate paths
    revalidatePath('/experiences')
    revalidatePath(`/experiences/${experienceId}`)
    
    return { success: true }
    
  } catch (error) {
    console.error('Error archiving experience:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Restore experience from archive
export async function restoreExperience(experienceId: string) {
  try {
    const supabase = await createServerClient()
    
    // Update the experience
    const { error } = await supabase
      .from('experiences')
      .update({
        is_archived: false
        // Note: we don't automatically reactivate it
      })
      .eq('id', experienceId)
    
    if (error) throw error
    
    // Log the action
    await logExperienceAction(experienceId, 'unarchived')
    
    // Revalidate paths
    revalidatePath('/experiences')
    revalidatePath(`/experiences/${experienceId}`)
    
    return { success: true }
    
  } catch (error) {
    console.error('Error restoring experience:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Duplicate an experience
export async function duplicateExperience(experienceId: string) {
  try {
    const supabase = await createServerClient()
    
    // Get the experience to duplicate
    const { data: sourceExperience, error: fetchError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', experienceId)
      .single()
    
    if (fetchError || !sourceExperience) {
      throw new Error(`Experience not found: ${fetchError?.message || 'Unknown error'}`)
    }
    
    // Create a copy with a new ID and updated fields
    const newId = crypto.randomUUID()
    
    // Prepare the new experience data
    const newExperience = {
      ...sourceExperience,
      id: newId,
      name: `${sourceExperience.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: false, // Set to inactive by default
      view_count: 0,
      booking_count: 0,
      // Keep a reference to the original
      duplicated_from: sourceExperience.id,
      // Generate a new shareable token if the original was shareable
      shareable_token: sourceExperience.is_shareable ? crypto.randomUUID() : null
    }
    
    // Remove fields that shouldn't be copied
    delete newExperience.slug // Will be generated on insert
    
    // Insert the new experience
    const { error: insertError } = await supabase
      .from('experiences')
      .insert(newExperience)
    
    if (insertError) {
      throw new Error(`Failed to duplicate experience: ${insertError.message}`)
    }
    
    // Log the action
    await logExperienceAction(newId, 'created', { 
      duplicated_from: sourceExperience.id 
    })
    
    // Log the duplication on the original experience
    await logExperienceAction(experienceId, 'updated', { 
      duplicated_to: newId 
    })
    
    // Revalidate paths
    revalidatePath('/experiences')
    
    return { 
      success: true,
      newId
    }
    
  } catch (error) {
    console.error('Error duplicating experience:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Toggle the active/inactive status of an experience
export async function toggleExperienceStatus(experienceId: string, active: boolean) {
  try {
    const supabase = await createServerClient()
    
    // Update the experience
    const { error } = await supabase
      .from('experiences')
      .update({ is_active: active })
      .eq('id', experienceId)
    
    if (error) throw error
    
    // Log the action
    await logExperienceAction(experienceId, 'updated', { 
      is_active: active 
    })
    
    // Revalidate paths
    revalidatePath('/experiences')
    revalidatePath(`/experiences/${experienceId}`)
    
    return { success: true }
    
  } catch (error) {
    console.error('Error toggling experience status:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
