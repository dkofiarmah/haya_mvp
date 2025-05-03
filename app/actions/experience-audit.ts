'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { ExperienceAuditRecord } from '@/types/experience-audit'

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
    
    // Get the organization_id - either from changes if this is a create action or from the experience
    let organizationId: string | null = null
    
    // For 'created' action, the org_id should be in the changes
    if (actionType === 'created' && changes && changes.org_id) {
      organizationId = changes.org_id
    } else {
      // Otherwise look it up from the experience record
      const { data: experience } = await supabase
        .from('experiences')
        .select('org_id')
        .eq('id', experienceId)
        .single()
      
      organizationId = experience?.org_id || null
    }
    
    if (!organizationId) {
      console.error('Failed to determine organization_id for audit log:', experienceId)
      return { success: false }
    }
    
    try {
      // Direct insertion into experience_audit_log table to avoid type issues
      // This ensures organization_id is properly included
      const { error } = await supabase.from('experience_audit_log').insert({
        experience_id: experienceId,
        organization_id: organizationId,
        user_id: userId,
        action_type: actionType,
        changes: changes || {}
      });
      
      if (error) {
        console.error(`Failed to log experience ${actionType} action:`, error)
      }
      
      return { success: !error }
    } catch (insertError) {
      console.error('Error inserting audit log:', insertError)
      return { success: false }
    }
  } catch (error) {
    console.error('Error in logExperienceAction:', error)
    return { success: false }
  }
}

// Function to get audit logs for an experience
export async function getExperienceAuditLogs(experienceId: string) {
  try {
    const supabase = await createServerClient()
    
    try {
      // Use raw SQL to get audit logs
      const query = `
        SELECT 
          el.id,
          el.experience_id,
          el.organization_id,
          el.user_id,
          el.action_type,
          el.changes,
          el.created_at,
          u.email as user_email,
          u.raw_user_meta_data->>'full_name' as user_name
        FROM 
          experience_audit_log el
        LEFT JOIN 
          auth.users u ON el.user_id = u.id
        WHERE 
          el.experience_id = '${experienceId}'
        ORDER BY 
          el.created_at DESC
      `;
      
      // Execute the raw query
      const { data, error } = await (supabase as any).rpc('exec_sql', { sql: query });
      
      if (error) {
        throw new Error(`Failed to fetch audit logs: ${error.message}`)
      }
      
      return data || []
    } catch (sqlError) {
      console.error('SQL error fetching audit logs:', sqlError)
      
      // If even the raw SQL fails, return empty array
      return []
    }
  } catch (error) {
    console.error('Error in getExperienceAuditLogs:', error)
    return []
  }
}
