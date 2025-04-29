"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { supabaseClient } from '@/lib/supabase/auth-client'

interface Organization {
  id: string
  name: string
  logo_url?: string
  contact_email: string
}

interface OrganizationContextType {
  organization: Organization | null
  isLoading: boolean
  error: string | null
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  isLoading: true,
  error: null
})

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOrganization() {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        // First get the user's organization ID
        const { data: userData, error: userError } = await supabaseClient
          .from('user_profiles')
          .select('org_id')
          .eq('id', user.id)
          .single()

        if (userError) throw userError

        if (!userData?.org_id) {
          setError('No organization found for user')
          setIsLoading(false)
          return
        }

        // Then get the organization details
        const { data: orgData, error: orgError } = await supabaseClient
          .from('organizations')
          .select('*')
          .eq('id', userData.org_id)
          .single()

        if (orgError) throw orgError

        setOrganization(orgData)
        setError(null)
      } catch (err) {
        console.error('Error loading organization:', err)
        setError('Failed to load organization data')
        setOrganization(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrganization()
  }, [user])

  return (
    <OrganizationContext.Provider value={{ organization, isLoading, error }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
