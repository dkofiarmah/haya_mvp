import { createRouteHandler } from '@/lib/supabase/route-handler';

// SQL to fix the missing RPC function
const CREATE_SAFE_FUNCTION_SQL = `
-- Create a safer function to get user organizations without recursion
CREATE OR REPLACE FUNCTION get_user_organizations_safe(user_uuid UUID)
RETURNS TABLE (
  organization_id UUID,
  role TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use the security definer privilege to access the table directly
  -- without triggering RLS recursion
  RETURN QUERY
  SELECT ou.organization_id, ou.role
  FROM organization_users ou
  WHERE ou.user_id = user_uuid;
END;
$$;

-- Grant execute permission to all authenticated users
GRANT EXECUTE ON FUNCTION get_user_organizations_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_organizations_safe(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_organizations_safe(UUID) TO service_role;
`;

export async function GET(req: Request) {
  const supabase = await createRouteHandler();
  
  try {
    // Try to run the SQL to create the missing function
    const { data: sqlResult, error: sqlError } = await supabase.rpc('exec_sql', {
      sql: CREATE_SAFE_FUNCTION_SQL
    });
    
    if (sqlError) {
      console.error('Failed to create RPC function:', sqlError);
      
      // Even if creating the function fails, we'll still return a success response
      // since we'll provide a fallback mechanism
    } else {
      console.log('Successfully created get_user_organizations_safe function');
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Function fix attempted', 
        success: !sqlError 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
  } catch (error) {
    console.error('Error in fix-rpc route:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fix RPC function' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
  }
}
