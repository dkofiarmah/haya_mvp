"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { X, ArrowRight, Sparkles } from "lucide-react"
import { useOnboarding } from "@/hooks/use-onboarding"
import { motion } from "framer-motion"

export function EnhancedOnboardingBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [lastDismissedTime, setLastDismissedTime] = useState<number | null>(null)
  const router = useRouter()
  const { isLoading, error } = useOnboarding()
  const { toast } = useToast()
  
  // Load last dismissed time from localStorage on component mount
  useEffect(() => {
    const storedTime = localStorage.getItem('onboarding_banner_dismissed_time')
    if (storedTime) {
      setLastDismissedTime(parseInt(storedTime, 10))
    }
    
    // Check if it's been more than 24 hours since the last dismissal
    const checkDismissalTime = () => {
      const storedTime = localStorage.getItem('onboarding_banner_dismissed_time')
      if (storedTime) {
        const lastTime = parseInt(storedTime, 10)
        const now = Date.now()
        const hoursSinceLastDismissal = (now - lastTime) / (1000 * 60 * 60)
        
        // If it's been more than 24 hours, show the banner again
        if (hoursSinceLastDismissal > 24) {
          setDismissed(false)
          localStorage.removeItem('onboarding_banner_dismissed_time')
        }
      }
    }
    
    checkDismissalTime()
    
    // Set up a timer to check every hour if the banner should be shown again
    const intervalId = setInterval(checkDismissalTime, 1000 * 60 * 60)
    
    return () => clearInterval(intervalId)
  }, [])
  
  const handleDismiss = () => {
    setDismissed(true)
    const now = Date.now()
    setLastDismissedTime(now)
    localStorage.setItem('onboarding_banner_dismissed_time', now.toString())
  }

  // Don't show the banner if there are server errors or it was dismissed
  if (error || dismissed || isLoading) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="mb-6 overflow-hidden border-primary/20 shadow-md">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Decorative left sidebar */}
            <div className="hidden md:block md:col-span-1 bg-primary/10 p-6 relative">
              <div className="absolute inset-0 opacity-50 pattern-dots pattern-blue-500 pattern-size-4 pattern-opacity-10" />
              <div className="relative z-10 h-full flex flex-col justify-center items-center">
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium text-primary">Get Started</span>
              </div>
            </div>
            
            {/* Main content */}
            <div className="p-6 md:col-span-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Complete your setup</h3>
                <p className="text-sm text-muted-foreground">
                  Finish configuring your account to unlock all features and customize your Haya experience.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-3"
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" />
                  <span className="ml-1 sm:inline">Dismiss for now</span>
                </Button>
                
                <Button 
                  className="h-9 px-4 gap-1.5"
                  onClick={() => {
                    // Check for existing onboarding data to continue
                    const savedData = localStorage.getItem('haya_onboarding_data');
                    
                    if (savedData) {
                      // User has started onboarding before - continue where they left off
                      toast({
                        title: "Continuing your setup",
                        description: "We've saved your progress so you can pick up where you left off."
                      });
                    }
                    
                    router.push("/onboarding");
                  }}
                >
                  <span>Continue Setup</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
