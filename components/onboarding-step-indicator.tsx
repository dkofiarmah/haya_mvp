"use client"

import { Check } from "lucide-react"
import { useCallback } from "react"

export interface Step {
  id: number
  title: string
  Icon: React.ElementType
  color: string
  description: string
  context?: {
    orgName?: string
    location?: string
  }
}

interface OnboardingStepIndicatorProps {
  steps: Step[]
  currentStep: number
  progress: number
  onStepClickAction?: (step: number) => void
}

export function OnboardingStepIndicator({ 
  steps,
  currentStep,
  progress,
  onStepClickAction 
}: OnboardingStepIndicatorProps) {
  const handleStepClick = useCallback((stepId: number) => {
    if (onStepClickAction) {
      onStepClickAction(stepId);
    }
  }, [onStepClickAction]);
  
  return (
    <div className="relative">
      {/* Progress indicator */}
      <div className="mb-4 px-2">
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Start</span>
          <span>Complete</span>
        </div>
      </div>
      
      {/* Steps with NO connecting lines */}
      <div className="flex items-center justify-between w-full mb-6">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep
          const isClickable = step.id < currentStep && onStepClickAction

            return (
              <div 
                key={step.id} 
                className={`flex flex-col items-center ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={() => isClickable && handleStepClick(step.id)}
              >
                {/* Step circle with elevated design */}
                <div 
                  className={`
                    relative flex h-12 w-12 items-center justify-center rounded-full 
                    transition-all shadow-sm
                    ${isActive 
                      ? `${step.color} text-white shadow-md ring-2 ring-offset-2 ring-${step.color.replace('bg-', '').split('-')[0]}` 
                      : isCompleted 
                        ? `${step.color} text-white` 
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.Icon className="h-5 w-5" />
                  )}
                  
                  {/* Step number badge (only for inactive and not completed steps) */}
                  {!isActive && !isCompleted && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground text-[10px] text-white">
                      {step.id}
                    </span>
                  )}
                </div>
                
                {/* Step title with improved spacing */}
                <div className={`
                  mt-3 text-sm font-medium transition-colors
                  ${isActive 
                    ? "text-foreground" 
                    : isCompleted 
                      ? "text-foreground" 
                      : "text-muted-foreground"
                  }
                `}>
                  {step.title}
                </div>
                
                {/* Step description and context - visible on larger screens */}
                {isActive && (
                  <div className="hidden md:block mt-2">
                    <div className="text-xs text-muted-foreground text-center max-w-[180px]">{step.description}</div>
                    
                    {step.context?.orgName && (
                      <div className="mt-2 px-3 py-2 bg-muted rounded-md">
                        <span className="block truncate max-w-[180px] text-xs font-medium text-foreground">{step.context.orgName}</span>
                        {step.context.location && (
                          <span className="block text-xs text-muted-foreground truncate max-w-[180px] mt-0.5">
                            {step.context.location}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
