"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles, ArrowRight, Clock } from "lucide-react"

export function WelcomeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const { markComplete } = useOnboarding()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleOnboardLater = async () => {
    setIsLoading(true)
    try {
      // Mark as seen but not complete
      localStorage.setItem('onboarding_seen', 'true')
      
      // Close the dialog
      onOpenChange(false)
      
      // Redirect to dashboard
      router.push("/dashboard")
      
      toast({
        title: "You can complete onboarding later",
        description: "You'll find the setup option in your dashboard when you're ready.",
      })
    } catch (error) {
      console.error("Error deferring onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartOnboarding = () => {
    // Close the dialog and redirect to onboarding
    onOpenChange(false)
    router.push("/onboarding")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-gradient-to-b from-white to-primary/5">
        <div className="relative w-full h-36 bg-primary/10 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full opacity-10 bg-primary pattern-dots" />
          <Image 
            src="/logo.svg"
            alt="Haya"
            width={80}
            height={80}
            className="relative z-10 animate-pulse"
          />
        </div>
        
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            Welcome to Haya <Sparkles className="h-5 w-5 text-primary" />
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Your smart platform for tour operators is ready!
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Complete your setup now</h3>
                <p className="text-sm text-muted-foreground">Customize your experience in just a few minutes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
              <div className="p-2 rounded-full bg-muted text-muted-foreground">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Explore first, setup later</h3>
                <p className="text-sm text-muted-foreground">You can complete your setup anytime</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              className="w-full gap-2" 
              onClick={handleStartOnboarding}
              disabled={isLoading}
            >
              Start Setup <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleOnboardLater}
              disabled={isLoading}
            >
              I'll do it later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
