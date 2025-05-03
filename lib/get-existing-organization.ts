// This function replaces the organization lookup in onboarding-form.tsx
// It prioritizes finding existing organizations rather than creating new ones

import { supabaseClient } from "@/lib/supabase/auth-client";
import { User } from "@supabase/supabase-js";

export async function getExistingOrganization(user: User): Promise<string | null> {
  if (!user) return null;
  
  // First check localStorage for organization ID from signup
  try {
    const newUserInfo = localStorage.getItem('newUserInfo');
    if (newUserInfo) {
      const userData = JSON.parse(newUserInfo);
      if (userData && userData.organizationId) {
        console.log("Found organization ID from signup data:", userData.organizationId);
        return userData.organizationId;
      }
    }
  } catch (error) {
    console.warn("Error reading organization from localStorage:", error);
  }

  // Next try our API endpoint instead of the safe RPC function
  try {
    const response = await fetch('/api/organizations/user-organizations');
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        console.log("Found organization via API endpoint:", data[0].organization_id);
        return data[0].organization_id;
      }
    } else {
      console.warn("Error from API endpoint:", response.statusText);
    }
  } catch (apiError) {
    console.warn("Exception calling API endpoint:", apiError);
  }
  
  // Try direct organization_users query (might hit RLS issues but worth trying)
  try {
    const { data, error } = await supabaseClient
      .from('organization_users')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();
    
    if (!error && data?.organization_id) {
      console.log("Found organization via direct query:", data.organization_id);
      return data.organization_id;
    } else if (error) {
      console.warn("Error in direct query:", error);
    }
  } catch (directQueryError) {
    console.warn("Exception in direct query:", directQueryError);
  }
  
  // Check user_profiles for last_active_organization
  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('last_active_organization')
      .eq('id', user.id)
      .single();
    
    if (!error && data?.last_active_organization) {
      console.log("Found organization from user profile:", data.last_active_organization);
      return data.last_active_organization;
    }
  } catch (profileError) {
    console.warn("Error checking user profile:", profileError);
  }
  
  // No organization found
  console.log("No existing organization found for user");
  return null;
}
