"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DashboardOnboardingNudgeProps {
  completedSteps: number
  totalSteps: number
}

export function DashboardOnboardingNudge({ 
  completedSteps = 0, 
  totalSteps = 5 
}: DashboardOnboardingNudgeProps) {
  const router = useRouter()
  const progress = Math.round((completedSteps / totalSteps) * 100)
  
  const getStatusText = () => {
    if (progress === 0) return "Not started";
    if (progress < 50) return "Just started";
    if (progress < 100) return "In progress";
    return "Complete";
  }

  return (
    <Card className="bg-gradient-to-br from-white to-primary/5 border-primary/20 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full p-2 bg-primary/10 text-primary">
            <CheckCircle className="h-5 w-5" />
          </div>
          
          <div className="space-y-1 flex-1">
            <h3 className="font-medium">Account Setup</h3>
            <p className="text-sm text-muted-foreground">
              {progress < 100 
                ? "Complete your account setup to unlock all features" 
                : "Your account is fully configured and ready to use"}
            </p>
            
            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>{progress}% complete</span>
                <span>{getStatusText()}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
      
      {progress < 100 && (
        <CardFooter className="pb-4 pt-0">
          <Button 
            variant="outline" 
            className="w-full gap-1 border-primary/20 hover:border-primary/40 text-primary"
            onClick={() => router.push('/onboarding')}
          >
            Continue Setup <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
