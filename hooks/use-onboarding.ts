import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { supabaseClient } from '@/lib/supabase/auth-client'
import type { Database } from '@/types/supabase'

interface UseOnboardingReturn {
  isComplete: boolean
  isLoading: boolean
  error: string | null
  markComplete: () => Promise<void>
  skipOnboarding: () => void
  isSkipped: boolean
}

/**
 * Hook to manage onboarding status
 * Uses both database and local storage for resilience against server errors
 */
export function useOnboarding(): UseOnboardingReturn {
  const { user } = useAuth()
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isSkipped, setIsSkipped] = useState(false)
  const MAX_RETRIES = 3
  
  // Use localStorage as fallback for server errors
  const getLocalOnboardingStatus = (): boolean => {
    try {
      return localStorage.getItem('onboarding_completed') === 'true'
    } catch (e) {
      return false
    }
  }
  
  const getLocalOnboardingSkipped = (): boolean => {
    try {
      return localStorage.getItem('onboarding_skipped') === 'true'
    } catch (e) {
      return false
    }
  }
  
  const setLocalOnboardingStatus = (status: boolean): void => {
    try {
      localStorage.setItem('onboarding_completed', status ? 'true' : 'false')
    } catch (e) {
      console.error('Failed to save onboarding status to localStorage', e)
    }
  }
  
  const setLocalOnboardingSkipped = (skipped: boolean): void => {
    try {
      localStorage.setItem('onboarding_skipped', skipped ? 'true' : 'false')
    } catch (e) {
      console.error('Failed to save onboarding skipped status to localStorage', e)
    }
  }

  useEffect(() => {
    let isMounted = true
    let retryTimeout: NodeJS.Timeout

    async function checkOnboardingStatus() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = supabaseClient
        
        // Always check localStorage first for immediate feedback
        if (getLocalOnboardingStatus()) {
          setIsComplete(true)
        }
        
        // Also check if onboarding was skipped
        setIsSkipped(getLocalOnboardingSkipped())
        
        // Try to get from the server, but only if we haven't hit an infinite recursion error before
        if (!error || !error.includes('infinite recursion')) {
          const { data, error: fetchError } = await supabase
            .from('user_profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

          if (fetchError) {
            // Check if this is an infinite recursion error
            if (fetchError.message && fetchError.message.includes('infinite recursion')) {
              // Use localStorage value and don't retry this specific error
              const localStatus = getLocalOnboardingStatus();
              setIsComplete(localStatus);
              setError("Database policy error, using local data");
              // Skip throwing, as we've handled this specific case
              return;
            }
            throw fetchError;
          }

          // Reset retry count on success
          if (isMounted) {
            setRetryCount(0)
            const completed = data?.onboarding_completed ?? false
            setIsComplete(completed)
            setLocalOnboardingStatus(completed)
            setError(null)
          }
        } else {
          // We've seen this error before, use localStorage
          setIsComplete(getLocalOnboardingStatus())
        }
      } catch (err: any) {
        // Log the raw error first for diagnostic purposes
        console.error('Error checking onboarding status:', err);
        
        // Create a safe object for logging that won't cause errors if properties are undefined
        const safeErrorDetails = {
          message: err?.message || 'Unknown error',
          code: err?.code,
          details: err?.details,
          hint: err?.hint,
          name: err?.name,
          stack: err?.stack
        };
        
        console.info('Error details:', safeErrorDetails);
        
        if (isMounted) {
          setError(safeErrorDetails.message);
          
          // Attempt retry if under max retries
          if (retryCount < MAX_RETRIES) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Exponential backoff
            retryTimeout = setTimeout(() => {
              setRetryCount(prev => prev + 1)
              checkOnboardingStatus()
            }, delay)
          } else {
            // Fall back to localStorage after max retries
            setIsComplete(getLocalOnboardingStatus())
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    checkOnboardingStatus()

    return () => {
      isMounted = false
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [user, error, retryCount])

  const markComplete = async (): Promise<void> => {
    if (!user) return;

    let retries = 0;
    const maxRetries = 3;

    const attemptUpdate = async (): Promise<void> => {
      try {
        // Update local state immediately for better UX
        setIsComplete(true);
        setLocalOnboardingStatus(true);
        
        console.log('Updating user profile for user ID:', user.id);
        
        // Use the eq method with the correct parameter - 'id' is the actual column name
        const { error: updateError } = await supabaseClient
          .from('user_profiles')
          .update({ 
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id); // Use 'id' since that's the column name in the user_profiles table

        if (updateError) throw updateError;
        
        // Clear any previous errors on success
        setError(null);
      } catch (err: any) {
        console.error('Error marking onboarding complete:', {
          message: err.message,
          code: err.code,
          details: err.details,
          hint: err.hint
        });
        
        if (retries < maxRetries) {
          retries++;
          const delay = Math.min(1000 * Math.pow(2, retries), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptUpdate();
        }
        
        setError(err.message);
        // Keep the local state as complete even if server update fails
        // A background sync process could handle this later
      }
    };

    await attemptUpdate();
  };

  const skipOnboarding = (): void => {
    // Set local state to indicate the user has skipped onboarding
    setIsSkipped(true);
    setLocalOnboardingSkipped(true);
    
    // IMPORTANT: For UX purposes, we'll treat a skipped onboarding as "complete" 
    // in our application state, even though the DB record is false
    setIsComplete(true);
    setLocalOnboardingStatus(true);
    
    // Important: We're NOT updating the database's onboarding_completed column
    // This allows us to remind the user later to complete the onboarding
    // but doesn't force them to do it immediately
  };

  return {
    isComplete,
    isLoading,
    error,
    markComplete,
    skipOnboarding,
    isSkipped
  };
}
