// helper for fixing common RLS policy issues
import { supabaseClient } from './auth-client';

/**
 * Checks if we can properly insert records into user_profiles table
 * and returns true if the test succeeds, false otherwise
 */
export async function testUserProfilesPermissions(): Promise<boolean> {
  try {
    // Try to create a temporary test user profile
    const testId = 'test-' + Math.random().toString(36).substring(2, 15);
    
    const { error } = await supabaseClient
      .from('user_profiles')
      .insert([{
        id: testId,
        full_name: 'Test User (Delete)',
        onboarding_completed: false,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
      
    if (error) {
      // The RLS policy is likely restricting inserts
      console.error('Failed user_profiles permission test:', error);
      return false;
    }
    
    // Clean up the test record
    await supabaseClient
      .from('user_profiles')
      .delete()
      .eq('id', testId);
      
    return true;
  } catch (e) {
    console.error('Error testing user_profiles permissions:', e);
    return false;
  }
}

/**
 * Try to fix RLS issues by calling the fix-rls API endpoint
 */
export async function fixRlsPolicy(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/fix-rls');
    if (!response.ok) {
      const data = await response.json();
      console.error('Failed to fix RLS policy:', data.error || response.statusText);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error fixing RLS policy:', e);
    return false;
  }
}
