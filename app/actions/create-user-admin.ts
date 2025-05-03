'use server';

import { createAdminClient } from '@/lib/supabase/server';

/**
 * Server action to create a user profile with admin privileges,
 * bypassing row level security policies
 */
export async function createUserProfileAdmin(userData: {
  id: string;
  full_name: string;
  onboarding_completed?: boolean;
}) {
  try {
    // Use the admin client which bypasses RLS
    const adminClient = createAdminClient();
    
    // Create the user profile with admin privileges
    const { data, error } = await adminClient
      .from('user_profiles')
      .insert([{
        id: userData.id,
        full_name: userData.full_name,
        onboarding_completed: userData.onboarding_completed || false,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Admin profile creation failed:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in createUserProfileAdmin:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error creating user profile'
    };
  }
}
