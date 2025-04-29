import { Check } from "lucide-react"

interface OnboardingStepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function OnboardingStepIndicator({ currentStep, totalSteps }: OnboardingStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={index} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : isCompleted
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div className={`h-1 w-12 ${stepNumber < currentStep ? "bg-primary" : "bg-muted-foreground/30"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
