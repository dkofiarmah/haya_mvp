'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabaseClient } from '@/lib/supabase/browser'
import type { TypedSupabaseClient } from '@/lib/supabase/auth-client'

type AuthContextType = {
  client: TypedSupabaseClient
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, orgName: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>
  confirmEmailVerification: (token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
      router.refresh()
    })

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const value: AuthContextType = {
    client: supabaseClient,
    user,
    isLoading,
    signOut: async () => {
      await supabaseClient.auth.signOut()
      router.push('/login')
    },
    signInWithEmail: async (email: string, password: string) => {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    },
    signUpWithEmail: async (email: string, password: string, orgName: string) => {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            org_name: orgName,
          },
        },
      })
      if (error) throw error
    },
    requestPasswordReset: async (email: string) => {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
    },
    confirmPasswordReset: async (_token: string, newPassword: string) => {
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
