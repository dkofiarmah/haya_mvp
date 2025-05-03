import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET handler for user profile endpoint
 * Provides a properly authenticated way to access user profile data
 */
export async function GET(request: Request) {
  try {
    // Get the authenticated server client
    const supabase = await createServerClient()
    
    // Get current user using the secure getUser method
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Fetch user profile with proper authentication
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      return NextResponse.json(
        { error: 'Error fetching profile', details: profileError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error in user profile API:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

/**
 * POST handler to update user profile
 */
export async function POST(request: Request) {
  try {
    const updates = await request.json()
    const supabase = await createServerClient()
    
    // Get current user using the secure getUser method
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Update the profile with proper authentication
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: 'Error updating profile', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error('Error in update user profile API:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
