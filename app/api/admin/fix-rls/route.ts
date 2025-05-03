import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// SQL fix for the user_profiles RLS policy
const FIX_USER_PROFILES_POLICY = `
-- First, enable RLS on the table if it's not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policy that could be causing the issue
DROP POLICY IF EXISTS user_profiles_policy ON user_profiles;
DROP POLICY IF EXISTS user_profiles_insert_policy ON user_profiles;
DROP POLICY IF EXISTS user_profiles_org_member_policy ON user_profiles;

-- Create a new policy that allows users to view and edit their own profiles
CREATE POLICY user_profiles_policy ON user_profiles
  USING (
    -- Allow users to view their own profile
    auth.uid() = id
  )
  WITH CHECK (
    -- Allow users to edit their own profile
    auth.uid() = id
  );

-- Enable inserts for non-authenticated users during signup process
CREATE POLICY user_profiles_insert_policy ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Add policy for organization members to view profiles of other members in their org
CREATE POLICY user_profiles_org_member_policy ON user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_users ou1
      JOIN organization_users ou2 ON ou1.organization_id = ou2.organization_id
      WHERE ou1.user_id = auth.uid() AND ou2.user_id = user_profiles.id
    )
  );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
`;

export async function GET() {
  try {
    // Use admin client to bypass RLS
    const adminClient = createAdminClient();
    
    // Apply the SQL fix
    const { error } = await adminClient.rpc('exec_sql', {
      sql: FIX_USER_PROFILES_POLICY
    });
    
    if (error) {
      console.error('Failed to fix user_profiles RLS policy:', error);
      return NextResponse.json({ 
        error: 'Failed to fix RLS policy', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully fixed user_profiles RLS policy'
    });
    
  } catch (err) {
    console.error('Error in fix-rls API:', err);
    return NextResponse.json({ 
      error: 'An unexpected error occurred', 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}
