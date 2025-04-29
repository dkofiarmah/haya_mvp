'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logExperienceAction } from './experience-audit'

// Archive an experience (soft delete)
export async function archiveExperience(id: string) {
  try {
    const supabase = await createServerClient()
    
    // First, get the current experience data for the audit log
    const { data: experience, error: fetchError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !experience) {
      throw new Error(`Experience not found: ${fetchError?.message || 'Unknown error'}`)
    }
    
    // Update the experience to mark it as archived
    const { error } = await supabase
      .from('experiences')
      .update({ 
        is_archived: true,
        is_active: false // Also deactivate it
      })
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to archive experience: ${error.message}`)
    }
    
    // Log the archive action
    await logExperienceAction(id, 'archived')
    
    // Revalidate paths
    revalidatePath('/experiences')
    revalidatePath(`/experiences/${id}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error in archiveExperience:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Restore an archived experience
export async function restoreExperience(id: string) {
  try {
    const supabase = await createServerClient()
    
    // First, get the current experience data for the audit log
    const { data: experience, error: fetchError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !experience) {
      throw new Error(`Experience not found: ${fetchError?.message || 'Unknown error'}`)
    }
    
    // Update the experience to unarchive it
    const { error } = await supabase
      .from('experiences')
      .update({ 
        is_archived: false
        // Note: We don't automatically set is_active: true as that's a separate property
      })
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to restore experience: ${error.message}`)
    }
    
    // Log the unarchive action
    await logExperienceAction(id, 'unarchived')
    
    // Revalidate paths
    revalidatePath('/experiences')
    revalidatePath(`/experiences/${id}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error in restoreExperience:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Activate/deactivate an experience
export async function toggleExperienceStatus(id: string, active: boolean) {
  try {
    const supabase = await createServerClient()
    
    // Update the experience status
    const { error } = await supabase
      .from('experiences')
      .update({ is_active: active })
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to update experience status: ${error.message}`)
    }
    
    // Log the update action
    await logExperienceAction(id, 'updated', { is_active: active })
    
    // Revalidate paths
    revalidatePath('/experiences')
    revalidatePath(`/experiences/${id}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error in toggleExperienceStatus:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
