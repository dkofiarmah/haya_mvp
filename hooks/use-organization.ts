import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { supabaseClient } from '@/lib/supabase/auth-client'
import type { Database } from '@/types/supabase'

type Organization = Database['public']['Tables']['organizations']['Row']
type OrganizationPreferences = Database['public']['Tables']['organization_preferences']['Row']

export function useOrganization() {
  const { user } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [preferences, setPreferences] = useState<OrganizationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOrganizationData() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        // First get the user's organization ID
        const { data: userData, error: userError } = await supabaseClient
          .from('users')
          .select('org_id')
          .eq('id', user.id)
          .single()

        if (userError) throw userError

        if (userData?.org_id) {
          // Load organization details
          const { data: orgData, error: orgError } = await supabaseClient
            .from('organizations')
            .select('*')
            .eq('id', userData.org_id)
            .single()

          if (orgError) throw orgError
          setOrganization(orgData)

          // Load organization preferences
          const { data: prefData, error: prefError } = await supabaseClient
            .from('organization_preferences')
            .select('*')
            .eq('org_id', userData.org_id)
            .single()

          if (prefError && prefError.code !== 'PGRST116') throw prefError // Ignore not found error
          setPreferences(prefData)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrganizationData()
  }, [user])

  return {
    organization,
    preferences,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true)
      setError(null)
    },
  }
}
