'use client'

import { ReactNode } from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { supabaseClient } from "@/lib/supabase/auth-client"
import { User } from '@supabase/supabase-js'
import { getUserOrganizations, getCurrentUserRole, Organization } from "@/lib/organizations"

// Organization type definition
export type Organization = {
  id: string
  name: string
  logo_url?: string | null
  contact_email: string
  phone?: string
  stripe_customer_id?: string
  subscription_status?: string
  subscription_tier?: string
  created_at: string
  max_users?: number
  max_experiences?: number
  max_ai_agents?: number
  settings?: Record<string, any>
}

// Context type definition
type OrganizationContextType = {
  currentOrganization: Organization | null
  userOrganizations: Organization[]
  userRole: string | null
  isLoading: boolean
  setCurrentOrganization: (org: Organization | null) => void
  refreshOrganizations: () => Promise<void>
}

// Create the context
const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

// This is a standalone provider component
export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<Organization[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the user from supabaseClient
  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    // Initial user fetch
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchOrganizations = async () => {
    if (!user) {
      setIsLoading(false);
      setUserOrganizations([]);
      setCurrentOrganization(null);
      setUserRole(null);
      return;
    }
    setIsLoading(true);
    try {
      const orgs = await getUserOrganizations(user.id);
      setUserOrganizations(orgs);
      if (orgs.length > 0) {
        const currentOrgStillValid = currentOrganization && orgs.some(org => org.id === currentOrganization.id);
        if (!currentOrgStillValid) {
          const firstOrg = orgs[0];
          setCurrentOrganization(firstOrg);
        }
      } else {
        setCurrentOrganization(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error fetching organizations in provider:", error);
      setUserOrganizations([]);
      setCurrentOrganization(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const fetchRole = async () => {
      if (currentOrganization && user) {
        try {
          const role = await getCurrentUserRole(user.id, currentOrganization.id);
          setUserRole(role);
        } catch (error) {
          console.error("Error fetching user role in provider:", error);
          setUserRole(null);
        }
      } else {
        if (!isLoading) {
            setUserRole(null);
        }
      }
    };
    fetchRole();
  }, [currentOrganization, user, isLoading]);

  const refreshOrganizations = async () => {
    await fetchOrganizations();
  };

  const handleSetCurrentOrganization = (org: Organization | null) => {
    setCurrentOrganization(org);
  };

  const providerValue: OrganizationContextType = {
    currentOrganization,
    userOrganizations,
    userRole,
    isLoading,
    setCurrentOrganization: handleSetCurrentOrganization,
    refreshOrganizations
  };

  return (
    <OrganizationContext.Provider value={providerValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

// Helper functions

export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  try {
    // Try to use the RPC function first
    try {
      const { data, error } = await supabaseClient
        .rpc('get_user_orgs', { user_id: userId })
      
      if (error) throw error
      
      return (data as Organization[]) || []
    } catch (rpcError) {
      console.log("RPC function failed, falling back to direct query:", rpcError);
      
      // Fallback to direct query
      const { data: userOrgs, error: userOrgsError } = await supabaseClient
        .from('organization_users')
        .select('organization_id')
        .eq('user_id', userId)
      
      if (userOrgsError) throw userOrgsError
      
      if (!userOrgs || userOrgs.length === 0) {
        return []
      }
      
      const orgIds = userOrgs.map(org => org.organization_id)
      const { data: organizations, error: orgsError } = await supabaseClient
        .from('organizations')
        .select('*')
        .in('id', orgIds)
      
      if (orgsError) throw orgsError
      
      return (organizations as Organization[]) || []
    }
  } catch (error: any) {
    console.error('Error fetching user organizations:', error?.message || error)
    return []
  }
}

export async function getCurrentUserRole(userId: string, organizationId: string): Promise<string | null> {
  try {
    // Try the RPC function first
    try {
      const { data, error } = await supabaseClient
        .rpc('get_user_org_role', { 
          user_id: userId,
          org_id: organizationId 
        })
      
      if (error) throw error
      
      return data || null
    } catch (rpcError) {
      console.log("RPC role function failed, falling back to direct query:", rpcError);
      
      // Fallback to direct query
      const { data, error } = await supabaseClient
        .from('organization_users')
        .select('role')
        .eq('user_id', userId)
        .eq('organization_id', organizationId)
        .single()
      
      if (error) throw error
      
      return data?.role || null
    }
  } catch (error) {
    console.error('Error fetching user role:', error)
    return null
  }
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}

// Export additional types and functions that were in the original module
export type OrganizationUser = {
  id: string
  user_id: string
  organization_id: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
}

export async function createOrganization(name: string, contactEmail: string, userId: string): Promise<Organization | null> {
  try {
    const { data: org, error: orgError } = await supabaseClient
      .from('organizations')
      .insert([
        { 
          name, 
          contact_email: contactEmail,
          subscription_status: 'trial',
          subscription_tier: 'starter'
        }
      ])
      .select()
      .single()
    
    if (orgError) throw orgError
    
    const { error: memberError } = await supabaseClient
      .from('organization_users')
      .insert([
        { 
          user_id: userId, 
          organization_id: org.id,
          role: 'owner'
        }
      ])
    
    if (memberError) throw memberError
    
    return org as Organization
  } catch (error) {
    console.error('Error creating organization:', error)
    return null
  }
}
