import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * API route to create a user profile with admin privileges (bypassing RLS)
 * This is used during the registration process to create the initial user profile
 * when the user doesn't yet have permissions
 */
export async function POST(request: Request) {
  try {
    const { id, fullName, email } = await request.json();
    
    if (!id || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields: id, fullName' },
        { status: 400 }
      );
    }
    
    // Use the admin client which bypasses RLS
    const adminClient = createAdminClient();
    
    // Check if profile already exists
    const { data: existingProfile } = await adminClient
      .from('user_profiles')
      .select('id')
      .eq('id', id)
      .single();
      
    if (existingProfile) {
      // Profile already exists, don't create a duplicate
      return NextResponse.json({ 
        success: true, 
        message: 'User profile already exists',
        id
      });
    }
    
    // Create the user profile with admin privileges
    const { data, error } = await adminClient
      .from('user_profiles')
      .insert([{
        id,
        full_name: fullName,
        onboarding_completed: false,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('id')
      .single();
      
    if (error) {
      console.error('Admin profile creation failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Log success for debugging
    console.log(`Successfully created user profile for ${fullName} (${id})`);
    
    return NextResponse.json({ 
      success: true,
      id: data.id
    });
    
  } catch (error) {
    console.error('Error in create-user-profile API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}
