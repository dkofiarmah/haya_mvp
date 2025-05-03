'use client'

import { supabaseClient } from "./supabase/auth-client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@supabase/supabase-js' // Import User type directly

// Move the Organization type definition before the provider function
export type Organization = {
  id: string
  name: string
  logo_url?: string | null // Allow null
  contact_email: string
  phone?: string
  stripe_customer_id?: string
  subscription_status?: string
  subscription_tier?: string
  created_at: string
  max_users?: number
  max_experiences?: number
  slug?: string
}

// Type for the context
export type OrganizationContextType = {
  organizations: Organization[]
  currentOrganization: Organization | null
  setCurrentOrganization: (org: Organization | null) => void
  isLoading: boolean
  error: string | null
  userRole: string | null
  refreshOrganizations: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ 
  children,
  initialOrganization
}: { 
  children: ReactNode
  initialOrganization?: Organization | null 
}) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(initialOrganization || null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // Load user and their organizations
  useEffect(() => {
    const loadUserAndOrgs = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Get current session
        const { data: { session } } = await supabaseClient.auth.getSession()
        if (!session) {
          setIsLoading(false)
          return
        }
        
        setUser(session.user)
        
        // Get user's organizations
        const userOrgs = await getUserOrganizations(session.user.id)
        setOrganizations(userOrgs)
        
        // Set current organization if not already set
        if (!currentOrganization && userOrgs.length > 0) {
          setCurrentOrganization(userOrgs[0])
        }
        
        // If the current organization is set, get the user's role in it
        if (currentOrganization) {
          const { data: roleData, error: roleError } = await supabaseClient
            .from('organization_users')
            .select('role')
            .eq('organization_id', currentOrganization.id)
            .eq('user_id', session.user.id)
            .single()
          
          if (!roleError && roleData) {
            setUserRole(roleData.role)
          }
        }
      } catch (error: any) {
        setError(error.message || 'Failed to load organizations')
        console.error('Error loading organizations:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserAndOrgs()
  }, [])

  // Update user role when current organization changes
  useEffect(() => {
    const updateUserRole = async () => {
      if (!user || !currentOrganization) {
        setUserRole(null)
        return
      }
      
      try {
        const { data, error } = await supabaseClient
          .from('organization_users')
          .select('role')
          .eq('organization_id', currentOrganization.id)
          .eq('user_id', user.id)
          .single()
        
        if (!error && data) {
          setUserRole(data.role)
        } else {
          setUserRole(null)
        }
      } catch (error) {
        console.error('Error getting user role:', error)
        setUserRole(null)
      }
    }
    
    updateUserRole()
  }, [currentOrganization, user])

  // Function to refresh organizations
  const refreshOrganizations = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const userOrgs = await getUserOrganizations(user.id)
      setOrganizations(userOrgs)
      
      // Ensure current organization is still in the list
      if (currentOrganization) {
        const stillExists = userOrgs.some(org => org.id === currentOrganization.id)
        if (!stillExists && userOrgs.length > 0) {
          setCurrentOrganization(userOrgs[0])
        } else if (!stillExists) {
          setCurrentOrganization(null)
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to refresh organizations')
      console.error('Error refreshing organizations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const providerValue: OrganizationContextType = {
    organizations,
    currentOrganization,
    setCurrentOrganization,
    isLoading,
    error,
    userRole,
    refreshOrganizations
  }

  return (
    <OrganizationContext.Provider value={providerValue}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}

export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  try {
    // First approach: Use our custom API endpoint instead of the RPC function
    try {
      // Only run this in the browser
      if (typeof window !== 'undefined') {
        const response = await fetch('/api/organizations/user-organizations');
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            // Convert the API result to Organization format
            const orgs = await supabaseClient
              .from('organizations')
              .select('*')
              .in('id', data.map((item: any) => item.organization_id))
            
            return (orgs.data || []) as Organization[]
          }
        }
      }
    } catch (apiError) {
      console.warn('Failed to fetch organizations via API:', apiError);
    
      console.warn('RPC function failed, falling back to direct query:', rpcError)
    }
    
    // Fallback approach: Direct query to organization_users
    const { data, error } = await supabaseClient
      .from('organization_users')
      .select(`
        organization_id,
        organizations (*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    
    if (!data || !data.length) return []
    
    return data.map(item => item.organizations) as Organization[]
  } catch (error) {
    console.error('Error getting user organizations:', error)
    throw error
  }
}

// Add more organization-related functions below
export async function createOrganization(orgData: Partial<Organization>) {
  try {
    // First create the organization
    const { data: org, error: orgError } = await supabaseClient
      .from('organizations')
      .insert([orgData])
      .select()
      .single()
    
    if (orgError) throw orgError
    
    // Then add the current user as owner
    const { error: userError } = await supabaseClient
      .from('organization_users')
      .insert([{
        organization_id: org.id,
        user_id: (await supabaseClient.auth.getUser()).data.user?.id,
        role: 'owner'
      }])
    
    if (userError) throw userError
    
    return org
  } catch (error) {
    console.error('Error creating organization:', error)
    throw error
  }
}

export async function updateOrganization(orgId: string, updates: Partial<Organization>) {
  try {
    const { data, error } = await supabaseClient
      .from('organizations')
      .update(updates)
      .eq('id', orgId)
      .select()
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error updating organization:', error)
    throw error
  }
}

export async function deleteOrganization(orgId: string) {
  try {
    const { error } = await supabaseClient
      .from('organizations')
      .delete()
      .eq('id', orgId)
    
    if (error) throw error
    
    return true
  } catch (error) {
    console.error('Error deleting organization:', error)
    throw error
  }
}

export async function getOrganizationMembers(orgId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('organization_users')
      .select(`
        user_id,
        role,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('organization_id', orgId)
    
    if (error) throw error
    
    return data.map(item => ({
      ...item.users,
      role: item.role
    }))
  } catch (error) {
    console.error('Error getting organization members:', error)
    throw error
  }
}

export async function addOrganizationMember(orgId: string, email: string, role: string) {
  try {
    // First check if the user exists
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        throw new Error('User not found with this email')
      }
      throw userError
    }
    
    // Then add them to the organization
    const { data, error } = await supabaseClient
      .from('organization_users')
      .insert([{
        organization_id: orgId,
        user_id: userData.id,
        role
      }])
      .select()
    
    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('User is already a member of this organization')
      }
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error adding organization member:', error)
    throw error
  }
}

export async function updateOrganizationMember(orgId: string, userId: string, role: string) {
  try {
    const { data, error } = await supabaseClient
      .from('organization_users')
      .update({ role })
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error updating organization member:', error)
    throw error
  }
}

export async function removeOrganizationMember(orgId: string, userId: string) {
  try {
    const { error } = await supabaseClient
      .from('organization_users')
      .delete()
      .eq('organization_id', orgId)
      .eq('user_id', userId)
    
    if (error) throw error
    
    return true
  } catch (error) {
    console.error('Error removing organization member:', error)
    throw error
  }
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabaseClient
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      throw error
    }
    
    return data as Organization
  } catch (error) {
    console.error('Error getting organization by slug:', error)
    throw error
  }
}
