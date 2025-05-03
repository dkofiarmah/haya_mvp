// API route for signing in with email and password
// This handles user login flow

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  try {
    const { email, password } = await request.json()
    
    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    // Check if email is verified
    const emailVerified = data.user.email_confirmed_at !== null
    
    // Get user profile to check onboarding status
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('onboarding_completed, last_active_organization')
      .eq('id', data.user.id)
      .single()
    
    const onboardingCompleted = profileError ? false : profileData?.onboarding_completed
    
    // Get user's organizations
    const { data: orgsData, error: orgsError } = await supabase.rpc(
      'get_user_organizations',
      { p_user_id: data.user.id }
    )
    
    return NextResponse.json({
      user: data.user,
      session: data.session,
      emailVerified,
      onboardingCompleted,
      organizations: orgsError ? [] : orgsData,
      activeOrganization: profileData?.last_active_organization || null,
      redirectTo: !emailVerified 
        ? '/auth/verify-email' 
        : !onboardingCompleted 
          ? '/onboarding'
          : '/dashboard'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during login' },
      { status: 500 }
    )
  }
}
