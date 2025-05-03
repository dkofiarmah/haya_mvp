'use client';

import { supabaseClient } from './auth-client';

/**
 * Check if the get_user_organizations_safe RPC function exists
 * and create a fallback if it doesn't
 * 
 * @returns True if the function exists or was created, false otherwise
 */
export async function checkOrFixRpcFunction(userId: string): Promise<boolean> {
  try {
    // Try to call the function to check if it exists
    const { data, error } = await (supabaseClient as any)
      .rpc('get_user_organizations_safe', { user_uuid: userId });
      
    if (error && error.message && 
        (error.message.includes('function') && error.message.includes('does not exist'))) {
      // Function doesn't exist, try to get data through our fallback API
      try {
        const response = await fetch('/api/organizations/user-organizations');
        if (response.ok) {
          // Our fallback API works
          return true;
        }
        
        // Fallback API doesn't work, try to create the function
        const fixResponse = await fetch('/api/admin/fix-rpc');
        return fixResponse.ok;
      } catch (apiError) {
        console.error('Failed to use fallback API or fix RPC:', apiError);
        return false;
      }
    }
    
    // Function exists or there was a different error
    return !error || !error.message.includes('function');
  } catch (e) {
    console.error('Error checking RPC function:', e);
    return false;
  }
}
