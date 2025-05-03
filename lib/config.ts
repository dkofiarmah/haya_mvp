/**
 * Application configuration - contains centralized settings for various features
 */
import { authFlowRoutes, appRoutes } from './routes';

/**
 * Authentication Flow Configuration
 */
export const authConfig = {
  /**
   * Email verification settings
   */
  emailVerification: {
    /**
     * Whether to skip email verification in development environment
     * This can be overridden by setting the NEXT_PUBLIC_SKIP_EMAIL_VERIFICATION_IN_DEV environment variable to 'true' or 'false'
     */
    skipInDevelopment: process.env.NEXT_PUBLIC_SKIP_EMAIL_VERIFICATION_IN_DEV === 'true' || false,
    
    /**
     * Redirect path after successful email verification
     */
    redirectAfterVerification: authFlowRoutes.createOrganization,
  },
  
  /**
   * Organization creation settings
   */
  organization: {
    /**
     * Whether creating an organization is required before accessing the dashboard
     */
    requiredForDashboard: true,
    
    /**
     * Redirect path after successful organization creation
     */
    redirectAfterCreation: appRoutes.dashboard,
  },

  /**
   * Auth flow settings
   */
  authFlow: {
    /**
     * The ordered steps in the authentication flow
     */
    steps: [
      {
        id: 'verify-email',
        route: authFlowRoutes.verifyEmail,
        title: 'Verify Email',
        description: 'Confirm your email address to proceed'
      },
      {
        id: 'create-organization',
        route: authFlowRoutes.createOrganization,
        title: 'Create Organization',
        description: 'Set up your tour operator organization'
      },
      {
        id: 'dashboard',
        route: appRoutes.dashboard,
        title: 'Dashboard',
        description: 'Access your dashboard'
      }
    ],
  },
};
