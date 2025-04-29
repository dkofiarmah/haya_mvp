'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { supabaseClient } from '@/lib/supabase/client-singleton'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
  user: User | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Use the singleton Supabase client instance
  const supabase = supabaseClient

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_IN') {
        router.refresh()
      }
      
      if (event === 'SIGNED_OUT') {
        router.refresh()
        router.push('/login')
      }
    })

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <Context.Provider value={{ supabase, user }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
}
