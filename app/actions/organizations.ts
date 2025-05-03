'use server'

import { createServerClient } from '@/lib/supabase/server'

// Define interface for organization data
interface Organization {
  id: string;
  name: string;
  description?: string;
  settings?: any;
  created_at: string;
  updated_at: string;
}

/**
 * Server action to fetch user's organizations - bypasses RLS issues
 * @param userId - The user ID to fetch organizations for
 * @returns Array of organizations the user belongs to
 */
export async function getUserOrganizations(userId: string): Promise<Organization[] | null> {
  try {
    console.log("Server action fetching organizations for user:", userId);
    const supabase = await createServerClient();
    
    // First get the organization IDs the user belongs to
    const { data: orgUserData, error: orgUserError } = await supabase
      .from('organization_users')
      .select('organization_id')
      .eq('user_id', userId);
      
    if (orgUserError) {
      console.error("Server action: Error fetching organization_users:", orgUserError);
      return null;
    }
    
    if (!orgUserData || orgUserData.length === 0) {
      console.log("Server action: No organization found for user");
      return null;
    }
    
    // Get the organization details
    const orgIds = orgUserData.map(ou => ou.organization_id);
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, settings, created_at, updated_at')
      .in('id', orgIds);
      
    if (orgError) {
      console.error("Server action: Error fetching organizations:", orgError);
      return null;
    }
    
    console.log("Server action: Successfully fetched organization data:", orgData);
    return orgData;
  } catch (error) {
    console.error("Server action: Error fetching organization data:", error);
    return null;
  }
}
