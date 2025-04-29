'use server'

import { createServerClient } from '@/lib/supabase/server'

// Function to log experience changes in the audit table
export async function logExperienceAction(
  experienceId: string,
  actionType: 'created' | 'updated' | 'deleted' | 'archived' | 'unarchived' | 'viewed' | 'shared' | 'booked',
  changes?: Record<string, any>
) {
  try {
    const supabase = await createServerClient()
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || '00000000-0000-0000-0000-000000000000' // Use default system ID if no user
    
    // Create the audit log entry
    const { error } = await supabase
      .from('experience_audit_logs')
      .insert({
        experience_id: experienceId,
        user_id: userId,
        action_type: actionType,
        changes: changes || null
      })
    
    if (error) {
      console.error(`Failed to log experience ${actionType} action:`, error)
    }
    
    return { success: !error }
  } catch (error) {
    console.error('Error in logExperienceAction:', error)
    return { success: false }
  }
}

// Function to get audit logs for an experience
export async function getExperienceAuditLogs(experienceId: string) {
  try {
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('experience_audit_logs')
      .select(`
        id,
        experience_id,
        user_id,
        action_type,
        changes,
        created_at,
        profiles:user_id (
          display_name,
          email
        )
      `)
      .eq('experience_id', experienceId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Failed to fetch audit logs: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getExperienceAuditLogs:', error)
    return []
  }
}
