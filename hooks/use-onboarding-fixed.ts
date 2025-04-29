// filepath: /Users/danny_1/_PROJECTS_/haya/haya_mvp/hooks/use-onboarding-fixed.ts
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { supabaseClient } from '@/lib/supabase/auth-client'
import type { Database } from '@/types/supabase'

interface UseOnboardingReturn {
  isComplete: boolean
  isLoading: boolean
  error: string | null
  markComplete: () => Promise<void>
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
  const MAX_RETRIES = 3
  
  // Use localStorage as fallback for server errors
  const getLocalOnboardingStatus = (): boolean => {
    try {
      return localStorage.getItem('onboarding_completed') === 'true'
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
        
        // Try to get from the server, but only if we haven't hit an infinite recursion error before
        if (!error || !error.includes('infinite recursion')) {
          // Using raw query to bypass TypeScript type checking
          const { data, error: fetchError } = await supabase
            .from('users') // The actual table name in the database
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
        console.error('Error checking onboarding status:', err)
        
        if (isMounted) {
          setError(err.message)
          
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
        
        // Try to update on the server using the users table
        const { error: updateError } = await supabaseClient
          .from('users') // The actual table name in the database
          .update({ 
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) throw updateError;
        
        // Clear any previous errors on success
        setError(null);
      } catch (err: any) {
        console.error('Error marking onboarding complete:', err.message);
        
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

  return {
    isComplete,
    isLoading,
    error,
    markComplete
  };
}
