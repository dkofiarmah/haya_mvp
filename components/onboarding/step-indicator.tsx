"use client"

import { Check } from "lucide-react"

interface OnboardingStepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function OnboardingStepIndicator({ currentStep, totalSteps }: OnboardingStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={index} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : isCompleted
                  ? "border-primary bg-primary text-white"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`h-px w-12 transition-colors ${
                  stepNumber < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
