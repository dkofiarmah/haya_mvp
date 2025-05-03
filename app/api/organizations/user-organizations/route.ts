import { createRouteHandler } from '@/lib/supabase/route-handler';
import { NextResponse } from 'next/server';

/**
 * This API route serves as a fallback for the missing get_user_organizations_safe RPC function
 * It provides the same functionality by directly querying the database
 */
export const GET = async (req: Request) => {
  try {
    // Create Supabase client with proper auth
    const supabase = await createRouteHandler();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Extract the user_uuid from query params if provided
    const url = new URL(req.url);
    const userUuid = url.searchParams.get('user_uuid') || user.id;
    
    // Direct query to get user organizations without using the missing RPC function
    const { data: userOrganizations, error } = await supabase
      .from('organization_users')
      .select('organization_id, role, organizations:organization_id(id, name, logo_url, contact_email, subscription_status, subscription_tier)')
      .eq('user_id', userUuid);
    
    if (error) {
      console.error('Error fetching user organizations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user organizations' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(userOrganizations, { status: 200 });
  } catch (error) {
    console.error('Error in user-organizations route:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
};
