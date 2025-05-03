"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, Info, CheckCircle, Clock } from "lucide-react"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { supabaseClient } from "@/lib/supabase/auth-client"
import { Progress } from "@/components/ui/progress"

export function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const router = useRouter()
  const { user } = useAuth()
  const { isComplete, isLoading, error } = useOnboarding()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user has skipped onboarding
    const checkOnboardingStatus = async () => {
      if (!user) return
      
      try {
        // Check local storage first for better performance
        const isSkipped = localStorage.getItem('onboarding_skipped') === 'true'
        const isCompleted = localStorage.getItem('onboarding_completed') === 'true'
        
        if (isSkipped && !isCompleted) {
          setShowBanner(true)
          
          // Calculate completion percentage from saved data
          const savedData = localStorage.getItem('haya_onboarding_data')
          if (savedData) {
            try {
              const { lastStep } = JSON.parse(savedData)
              setCompletionPercentage(Math.round((lastStep - 1) / 5 * 100))
            } catch (error) {
              console.error("Failed to parse onboarding data:", error)
              setCompletionPercentage(0)
            }
          }
          return
        }
        
        // If not in localStorage, check database
        const { data: userProfile } = await supabaseClient
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        const preferences = userProfile?.preferences
        const skipped = preferences && 
          typeof preferences === 'object' && 
          'onboarding_skipped' in preferences && 
          preferences.onboarding_skipped === true
          
        if (skipped && !isComplete) {
          setShowBanner(true)
          // Update local storage for future reference
          localStorage.setItem('onboarding_skipped', 'true')
          
          // Try to get completion percentage
          if (preferences && 
              'onboarding_progress' in preferences && 
              typeof preferences.onboarding_progress === 'number') {
            setCompletionPercentage(preferences.onboarding_progress)
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error)
      }
    }
    
    checkOnboardingStatus()
  }, [user, isComplete])
  
  if (dismissed || !showBanner || isComplete) return null
  
  const handleContinue = () => {
    router.push('/onboarding')
  }
  
  const handleDismiss = () => {
    setDismissed(true)
    toast({
      description: "You can always complete your profile from the settings menu",
      duration: 5000,
    })
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-1 shadow-sm">
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-lg text-indigo-900">Complete your setup</h3>
          </div>
          
          <p className="text-sm text-slate-700">
            You're just a few steps away from unlocking the full potential of HAYA for your tour business. 
            {completionPercentage > 0 && ` You've completed ${completionPercentage}% so far.`}
          </p>
          
          {completionPercentage > 0 && (
            <div className="w-full pt-1">
              <Progress value={completionPercentage} className="h-2" />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button
            onClick={handleContinue}
            className="bg-indigo-600 hover:bg-indigo-700"
            size="sm"
          >
            Continue Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-500 hover:text-slate-700" 
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
