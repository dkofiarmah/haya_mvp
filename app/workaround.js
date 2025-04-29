/**
 * Workaround helpers for organization-related queries
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Get organizations for the current user using a database function instead of direct queries
 * This avoids the infinite recursion issue
 */
export async function getUserOrganizationsWorkaround() {
  try {
    const { data, error } = await supabase.rpc('get_my_organizations');
    
    if (error) {
      console.error('Error fetching user organizations with workaround:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching user organizations with workaround:', error);
    return [];
  }
}

/**
 * Check if a user belongs to an organization using a direct query
 * This avoids the recursive RLS policies
 */
export async function checkUserOrganizationAccess(orgId) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user?.id) {
      return false;
    }
    
    const { data, error } = await supabase.rpc('check_user_in_organization', {
      org_uuid: orgId
    });
    
    if (error) {
      console.error('Error checking organization access:', error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error('Exception checking organization access:', error);
    return false;
  }
}
