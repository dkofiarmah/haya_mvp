import React, { useContext, createContext, useEffect, useState, useCallback } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase/auth-client'

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, orgId: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Enhance session persistence and dynamic UI updates
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (session) {
        localStorage.setItem('supabaseSession', JSON.stringify(session))
      } else {
        localStorage.removeItem('supabaseSession')
      }
      setSession(session)
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error refreshing session:', error)
    }
  }, [])

  useEffect(() => {
    // Restore session from localStorage on app load
    const storedSession = localStorage.getItem('supabaseSession')
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession)
      setSession(parsedSession)
      setUser(parsedSession.user ?? null)
    }

    refreshSession()

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem('supabaseSession', JSON.stringify(session))
      } else {
        localStorage.removeItem('supabaseSession')
      }
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshSession])

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUpWithEmail = async (email: string, password: string, orgId: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          org_id: orgId,
        },
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    await supabaseClient.auth.signOut()
    router.push('/login')
  }

  const value = {
    user,
    session,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshSession,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}