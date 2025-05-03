// API route for signing up with email and password
// This route handles user registration with email verification
// and creates an organization for the user

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  try {
    const { email, password, fullName, organizationName } = await request.json()
    
    // Validate inputs
    if (!email || !password || !fullName || !organizationName) {
      return NextResponse.json(
        { error: 'Email, password, full name, and organization name are required' },
        { status: 400 }
      )
    }
    
    // Sign up the user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
      }
    })
    
    if (signUpError || !authData.user) {
      return NextResponse.json(
        { error: signUpError?.message || 'Failed to create user account' }, 
        { status: 400 }
      )
    }
    
    // Create organization using our custom function
    const { data: orgData, error: orgError } = await supabase.rpc(
      'create_organization',
      {
        p_name: organizationName,
        p_contact_email: email,
      }
    )
    
    if (orgError) {
      // If organization creation fails, we should log this but not fail the signup
      console.error('Error creating organization:', orgError)
      
      return NextResponse.json(
        { 
          user: authData.user,
          organization: null,
          message: 'Account created successfully, but organization setup failed. You can create an organization later.',
        },
        { status: 201 }
      )
    }
    
    return NextResponse.json(
      { 
        user: authData.user,
        organization: orgData,
        message: 'Account and organization created successfully. Please check your email to verify your account.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration' },
      { status: 500 }
    )
  }
}
