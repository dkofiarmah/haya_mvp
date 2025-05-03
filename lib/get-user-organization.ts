// This is a simplified version of the organization finder that uses 
// the get_organization_for_user database function directly

import { supabaseClient } from "@/lib/supabase/auth-client";
import { User } from "@supabase/supabase-js";

export async function getUserOrganizationId(user: User): Promise<string | null> {
  if (!user) return null;
  
  try {
    // First check localStorage for organization ID from signup
    // This is the most reliable for newly registered users
    try {
      const newUserInfo = localStorage.getItem('newUserInfo');
      if (newUserInfo) {
        const userData = JSON.parse(newUserInfo);
        if (userData && userData.organizationId) {
          console.log("Found organization ID from signup data:", userData.organizationId);
          return userData.organizationId;
        }
      }
    } catch (localStorageError) {
      console.warn("Error reading from localStorage:", localStorageError);
    }

    // If not found in localStorage, use the secure database function
    console.log("Calling get_organization_for_user function for user:", user.id);
    const { data, error } = await supabaseClient
      .rpc('get_organization_for_user', { user_uuid: user.id });
    
    if (error) {
      console.error("Error getting organization:", error);
      return null;
    }
    
    if (data) {
      console.log("Found organization via database function:", data);
      return data;
    }
  } catch (error) {
    console.error("Error in getUserOrganizationId:", error);
  }
  
  return null;
}
