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
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{userId: string, organizationId: string | null}>
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
      // Step 1: Sign up user with Supabase Auth
      const { data: authData, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/verification-pending`,
        },
      })
      if (signUpError) throw signUpError
      if (!authData.user) throw new Error("Failed to create user account")

      const userId = authData.user.id
      
      try {
        // Step 2: Create user profile using the admin API (bypasses RLS)
        const response = await fetch('/api/auth/create-user-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userId,
            fullName: fullName,
            email: email
          }),
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to create user profile')
        }

        // Step 3: Save info to localStorage for onboarding
        localStorage.setItem('newUserInfo', JSON.stringify({
          fullName: fullName,
          email: email,
          registeredAt: new Date().toISOString()
        }))

        return {
          userId: userId,
          organizationId: null as string | null // No organization created yet
        }
      } catch (error: any) {
        // Clean up if organization creation fails
        console.error("Registration error:", error)
        await supabaseClient.auth.signOut()
        throw new Error(error.message || "Failed to set up your account. Please try again.")
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
