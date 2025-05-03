/**
 * App routes configuration
 * This file contains all the routes used in the Haya application
 */

/**
 * Authentication related routes - PENDING REDESIGN
 */
export const authRoutes = {
  // These routes will be redesigned
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyEmail: "/auth/verify-email",
};

/**
 * Onboarding related routes - PENDING REDESIGN
 */
export const onboardingRoutes = {
  // These routes will be redesigned
  active: "/setup",
};

/**
 * Authentication flow routes - sequential steps users must complete
 */
export const authFlowRoutes = {
  verifyEmail: "/verify-email",
  createOrganization: "/onboarding/create-organization"
};

/**
 * Main application routes
 */
export const appRoutes = {
  home: "/",
  dashboard: "/dashboard",
  experiences: "/experiences",
  customers: "/customers",
  bookings: "/bookings",
  analytics: "/analytics",
  settings: "/settings",
  agents: "/agents",
  profile: "/profile",
  billing: "/billing",
};

/**
 * API routes
 */
export const apiRoutes = {
  base: "/api",
  auth: "/api/auth",
  organization: "/api/organization",
  experiences: "/api/experiences",
  customers: "/api/customers",
  bookings: "/api/bookings",
};

/**
 * Utility function to check if a route is public (doesn't require authentication)
 */
export const isPublicRoute = (path: string): boolean => {
  // Define public paths - all auth routes are public by default
  const publicPaths = [
    // Auth routes will be accessible without login
    ...Object.values(authRoutes),
    // Verification and onboarding paths that handle their own auth checks
    '/verify-email',
    '/onboarding/create-organization',
    // Shortcut routes that should redirect to auth routes
    '/register', '/signup', '/login', '/forgot-password', '/reset-password',
    // Home page and other public pages
    appRoutes.home,
    // Development/testing routes
    '/test-auth-flow',
  ];

  return publicPaths.some(route => path === route || path.startsWith(`${route}/`));
};

/**
 * Utility function to check if a route is an onboarding route
 * Will be updated as part of redesign
 */
export const isOnboardingRoute = (path: string): boolean => {
  // Simplified to only check against the active route
  return path === onboardingRoutes.active || path.startsWith(onboardingRoutes.active + '/');
};

/**
 * Get the active onboarding route
 */
export const getActiveOnboardingRoute = (): string => {
  return onboardingRoutes.active;
};

/**
 * Utility function to check if a route is part of the auth flow
 */
export const isAuthFlowRoute = (path: string): boolean => {
  // Auth flow routes are both public and require authentication to function
  return Object.values(authFlowRoutes).some(route => 
    path === route || path.startsWith(`${route}/`)
  );
};

/**
 * Get the next step in the authentication flow based on user's current state
 * @param currentStep The current step in the auth flow
 * @returns The next step in the auth flow
 */
export const getNextAuthFlowStep = (currentStep: 'verify-email' | 'create-organization' | 'dashboard') => {
  const steps = ['verify-email', 'create-organization', 'dashboard'];
  const currentIndex = steps.indexOf(currentStep);
  
  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return null;
  }
  
  return steps[currentIndex + 1];
};
