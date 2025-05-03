import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'
import { 
  isPublicRoute, 
  isOnboardingRoute, 
  isAuthFlowRoute,
  appRoutes, 
  authRoutes, 
  authFlowRoutes,
  getActiveOnboardingRoute 
} from './lib/routes'
import { authConfig } from './lib/config'

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: { path: string }) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: { path: string }) {
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if it exists
  const { data: { session } } = await supabase.auth.getSession()

  // Determine if the current path is a protected route
  const isProtectedRoute = !isPublicRoute(request.nextUrl.pathname);
  const isAuthRoute = Object.values(authRoutes).some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(`${route}/`)
  );
  const isOnboarding = isOnboardingRoute(request.nextUrl.pathname);
  
  // Handle shortcut routes - redirect to proper auth routes
  if (request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/signup') {
    return NextResponse.redirect(new URL(authRoutes.register, request.url));
  }
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL(authRoutes.login, request.url));
  }
  if (request.nextUrl.pathname === '/forgot-password') {
    return NextResponse.redirect(new URL(authRoutes.forgotPassword, request.url));
  }
  if (request.nextUrl.pathname === '/reset-password') {
    return NextResponse.redirect(new URL(authRoutes.resetPassword, request.url));
  }
  
  // Enhanced auth flow implementation
  
  // Protect dashboard routes - redirect to login if not authenticated
  if (isProtectedRoute && !session) {
    // Check if the requested path is not /register or /auth/register before redirecting
    if (!request.nextUrl.pathname.includes('/register') && !request.nextUrl.pathname.includes('/signup')) {
      // Store the current URL so we can redirect back after login
      const redirectUrl = new URL(authRoutes.login, request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // For authenticated users, continue with the verification and organization flow
  if (session) {
    // For authenticated users on auth pages, redirect to next step in flow
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
    
    // Get information about the user to determine the next step
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      // Should not happen since we checked for session, but handle it anyway
      return response;
    }    // Skip email verification in development environment if configured
    const isDevelopment = process.env.NODE_ENV === 'development';
    const shouldSkipVerification = isDevelopment && authConfig.emailVerification.skipInDevelopment;
    
    // Check if user has verified their email (unless in dev with skip flag)
    const isEmailVerified = !!userData.user.email_confirmed_at || shouldSkipVerification;
    
    // Check if user has created an organization
    const { data: orgData, error: orgError } = await supabase
      .from('organization_users')
      .select('organization_id')
      .eq('user_id', userData.user.id)
      .limit(1);
    
    const hasOrganization = !orgError && orgData && orgData.length > 0;
    
    // Current URL pathname
    const pathname = request.nextUrl.pathname;
    const isVerifyEmailPage = pathname === authFlowRoutes.verifyEmail || pathname.startsWith(`${authFlowRoutes.verifyEmail}/`);
    const isCreateOrgPage = pathname === authFlowRoutes.createOrganization || pathname.startsWith(`${authFlowRoutes.createOrganization}/`);
    
    // STEP 1: If email not verified and user is not on the verify-email page, redirect there
    if (!isEmailVerified && !isVerifyEmailPage) {
      return NextResponse.redirect(new URL(authFlowRoutes.verifyEmail, request.url));
    }
    
    // STEP 2: If email is verified but no organization, and not on create-organization page, redirect there
    if (isEmailVerified && !hasOrganization && !isCreateOrgPage && !isVerifyEmailPage) {
      return NextResponse.redirect(new URL(authFlowRoutes.createOrganization, request.url));
    }
    
    // STEP 3: Prevent backwards flow - if trying to access earlier steps when already completed
    if ((isVerifyEmailPage && isEmailVerified) || 
        (isCreateOrgPage && hasOrganization)) {
      return NextResponse.redirect(new URL(appRoutes.dashboard, request.url));
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
}
