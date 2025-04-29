"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { WelcomeDialog } from "@/components/onboarding/welcome-dialog"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { useOnboarding } from "@/hooks/use-onboarding"
import { Loading } from "@/components/loading"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { isComplete, isLoading: onboardingLoading } = useOnboarding()
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    // Only show welcome dialog if it's a fresh start from login
    const fromLogin = sessionStorage.getItem('from_login') === 'true'
    const onboardingSeen = localStorage.getItem('onboarding_seen') === 'true'

    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    
    if (!onboardingLoading) {
      if (isComplete) {
        router.push("/dashboard")
        return
      }
      
      // If coming directly from login and hasn't seen onboarding yet
      if (fromLogin && !onboardingSeen) {
        setShowWelcomeDialog(true)
        sessionStorage.removeItem('from_login')
      } else {
        setShowForm(true)
      }
    }
  }, [user, isComplete, authLoading, onboardingLoading, router])

  if (authLoading || onboardingLoading) {
    return <Loading />
  }

  return (
    <>
      <WelcomeDialog 
        open={showWelcomeDialog} 
        onOpenChange={(open) => {
          setShowWelcomeDialog(open)
          if (!open) setShowForm(true)
        }} 
      />
      
      {showForm && (
        <div className="container max-w-4xl mx-auto py-10">
          <OnboardingForm />
        </div>
      )}
    </>
  )
}
