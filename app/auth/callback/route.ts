import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { authConfig } from '@/lib/config'
import { appRoutes, authFlowRoutes } from '@/lib/routes'

export async function GET(request: Request) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // Default to verify-email to ensure users go through the proper flow
  const next = searchParams.get('next') ?? authFlowRoutes.verifyEmail

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Get user data to check verification status
  const { data: { session } } = await supabase.auth.getSession()
  
  let redirectUrl = next
  
  // If user is authenticated, direct them to the appropriate step in the flow
  if (session) {
    const user = session.user
    
    // Check if the user has verified their email
    const isDevelopment = process.env.NODE_ENV === 'development'
    const shouldSkipVerification = isDevelopment && authConfig.emailVerification.skipInDevelopment
    
    if (!user.email_confirmed_at && !shouldSkipVerification) {
      // User needs to verify their email
      redirectUrl = authFlowRoutes.verifyEmail
    } else {
      // Email is verified, check if they have an organization
      const { data: orgData } = await supabase
        .from('organization_users')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
      
      if (!orgData || orgData.length === 0) {
        // User doesn't have an organization, send them to create one
        redirectUrl = authFlowRoutes.createOrganization
      } else {
        // User has verified email and has an organization, they can go to dashboard
        redirectUrl = appRoutes.dashboard
      }
    }
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url))
}
