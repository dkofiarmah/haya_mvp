"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Session, User } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"
import { supabaseClient } from "@/lib/supabase/auth-client"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, orgName: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>
  confirmEmailVerification: (token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    session,
    isLoading,
    signOut: async () => {
      await supabaseClient.auth.signOut()
      // We'll let the component handle navigation if needed
    },
    signInWithEmail: async (email: string, password: string) => {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    },
    signUpWithEmail: async (email: string, password: string, fullName: string) => {
      const { data: authData, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      if (signUpError) throw signUpError

      if (authData.user) {
        // Create a default organization name from the user's first name
        const firstName = fullName.split(' ')[0]
        const defaultOrgName = `${firstName}'s Company`

        try {
          // Create the organization
          const { data: org, error: orgError } = await supabaseClient
            .from('organizations')
            .insert([
              { 
                name: defaultOrgName,
                contact_email: email,
                subscription_status: 'trial',
                subscription_tier: 'starter',
                slug: defaultOrgName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                metadata: {
                  created_at: new Date().toISOString(),
                  created_by: authData.user.id,
                  allow_name_edit: true // Flag to indicate org name can be edited in onboarding
                }
              }
            ])
            .select()
            .single()
          
          if (orgError) throw orgError

          // Link user to organization
          const { error: linkError } = await supabaseClient
            .from('organization_users')
            .insert([
              { 
                user_id: authData.user.id, 
                organization_id: org.id,
                role: 'owner'
              }
            ])
          
          if (linkError) throw linkError

          // Save org info to localStorage for onboarding
          localStorage.setItem('newOrgInfo', JSON.stringify({
            id: org.id,
            name: defaultOrgName,
            created_at: new Date().toISOString()
          }))
        } catch (error: any) {
          // Clean up if organization creation fails
          await supabaseClient.auth.signOut()
          throw new Error("Failed to set up your workspace. Please try again.")
        }
      }
    },
    requestPasswordReset: async (email: string) => {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
    },
    confirmPasswordReset: async (token: string, newPassword: string) => {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
    },
    confirmEmailVerification: async (token: string) => {
      const { error } = await supabaseClient.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      })
      if (error) throw error
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a SupabaseAuthProvider")
  }
  return context
}
