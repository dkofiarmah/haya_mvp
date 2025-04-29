"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { useOnboarding } from "@/hooks/use-onboarding"
import { Loading } from "@/components/loading"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DashboardLayoutComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { isComplete, isLoading: onboardingLoading } = useOnboarding()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    
    // Check local storage directly as a fallback
    const locallyComplete = localStorage.getItem('onboarding_completed') === 'true'
    const locallySkipped = localStorage.getItem('onboarding_skipped') === 'true'
    
    // Only redirect to onboarding if it's not complete AND not skipped
    if (!onboardingLoading && !isComplete && !locallyComplete && !locallySkipped) {
      router.push("/onboarding")
    }
  }, [user, isComplete, authLoading, onboardingLoading, router])

  if (authLoading || onboardingLoading) {
    return <Loading />
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
