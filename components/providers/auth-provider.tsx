'use client'

import { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { useSupabase } from './supabase-provider'
import type { User } from '@supabase/supabase-js'

interface AuthContextData {
  user: User | null
  isLoading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, orgId: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { supabase, user } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(() => {
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const signUpWithEmail = useCallback(async (email: string, password: string, orgId: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            org_id: orgId
          }
        }
      })
      if (error) throw error
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
