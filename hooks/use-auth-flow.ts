import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/supabase-auth-provider';
import { supabaseClient } from '@/lib/supabase/auth-client';
import { authConfig } from '@/lib/config';
import { authFlowRoutes, appRoutes } from '@/lib/routes';

interface AuthFlowReturn {
  isLoading: boolean;
  isVerified: boolean;
  hasOrganization: boolean;
  organizationId: string | null;
  error: string | null;
  navigateToNextStep: () => void;
  currentStep: 'verify-email' | 'create-organization' | 'dashboard';
  isCompleted: boolean;
  nextStep: string | null;
}

/**
 * Hook to manage the authentication flow including email verification and organization setup
 * Ensures users follow the required steps: login -> email verification -> organization creation -> dashboard
 */
export function useAuthFlow(): AuthFlowReturn {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [hasOrganization, setHasOrganization] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize values based on user state
  useEffect(() => {
    const checkVerificationAndOrg = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if email is verified
        const isDevelopment = process.env.NODE_ENV === 'development';
        const shouldSkipVerification = isDevelopment && authConfig.emailVerification.skipInDevelopment;
        
        setIsVerified(!!user.email_confirmed_at || shouldSkipVerification);

        // Check if user has an organization
        const { data: orgData, error: orgError } = await supabaseClient
          .from('organization_users')
          .select('organization_id')
          .eq('user_id', user.id)
          .limit(1);

        if (orgError) {
          console.error('Error checking organization:', orgError);
          setError('Failed to check organization status');
        } else if (orgData && orgData.length > 0) {
          setHasOrganization(true);
          setOrganizationId(orgData[0].organization_id);
        } else {
          setHasOrganization(false);
          setOrganizationId(null);
        }
      } catch (err: any) {
        setError(err.message || 'Error checking authentication flow status');
        console.error('Auth flow error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      checkVerificationAndOrg();
    }
  }, [user, authLoading]);

  // Determine the current step and next step
  const getCurrentStep = () => {
    if (!user) return null;
    if (!isVerified) return 'verify-email';
    if (!hasOrganization) return 'create-organization';
    return 'dashboard';
  };

  const currentStep = getCurrentStep() || 'verify-email';
  const isCompleted = currentStep === 'dashboard';
  
  // Determine the next step in the flow
  const getNextStep = () => {
    if (!user) return '/auth/login';
    if (!isVerified) return authFlowRoutes.verifyEmail;
    if (!hasOrganization) return authFlowRoutes.createOrganization;
    return appRoutes.dashboard;
  };
  
  const nextStep = getNextStep();
  
  // Navigate to the appropriate next step in the flow
  const navigateToNextStep = () => {
    if (nextStep) {
      router.push(nextStep);
    }
  };

  return {
    isLoading: authLoading || isLoading,
    isVerified,
    hasOrganization,
    organizationId,
    error,
    navigateToNextStep,
    currentStep: currentStep as 'verify-email' | 'create-organization' | 'dashboard',
    isCompleted,
    nextStep,
  };
}
