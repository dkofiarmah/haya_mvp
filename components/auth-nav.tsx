"use client"

import { useAuth } from '@/components/providers/supabase-auth-provider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function AuthNav() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-8 h-8">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/register">Register</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button 
        variant="outline" 
        onClick={() => {
          signOut()
          router.push('/login')
        }}
      >
        Sign Out
      </Button>
    </div>
  )
}
