'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase/browser'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { useToast } from '@/components/ui/use-toast'

interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  title: string | null
  bio: string | null
  onboarding_completed: boolean
  preferences: any | null
  last_active_organization: string | null
  created_at: string
  updated_at: string
}

/**
 * Hook to safely access the current user's profile without direct API calls
 * This avoids the REST API 400 errors by using the Supabase client
 */
export function useUserProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setProfile(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Use the Supabase client directly which properly handles auth
        const { data, error } = await supabaseClient
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) {
          throw error
        }
        
        setProfile(data)
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
        
        toast({
          variant: 'destructive',
          title: 'Profile Error',
          description: 'Failed to load your profile. Please try refreshing the page.'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, toast])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return { success: false }
    
    try {
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) throw error
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : data)
      
      return { success: true, data }
    } catch (err) {
      console.error('Error updating profile:', err)
      
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update your profile information.'
      })
      
      return { success: false, error: err }
    }
  }

  return {
    profile,
    isLoading,
    error,
    updateProfile
  }
}
