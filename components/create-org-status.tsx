"use client"

import { OnboardingStepIndicator, type Step } from "@/components/onboarding-step-indicator"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { Mail, Building, LayoutDashboard } from "lucide-react"
import { authConfig } from "@/lib/config"

interface CreateOrgStatusProps {
  currentStep: 'verify-email' | 'create-organization' | 'dashboard'
  orgName?: string
  location?: string
}

/**
 * A special version of AuthFlowStatus that shows organization name and location
 * while the user is filling the form
 */
export function CreateOrgStatus({ currentStep, orgName, location }: CreateOrgStatusProps) {
  const { user } = useAuth()
  
  // Map flow step IDs to numeric steps
  const stepMap = {
    'verify-email': 1,
    'create-organization': 2,
    'dashboard': 3
  };
  
  // Calculate the numeric step value
  const numericStep = stepMap[currentStep];
  
  // Calculate progress
  const totalSteps = authConfig.authFlow.steps.length;
  const progress = (numericStep / totalSteps) * 100;
  
  // Get icons for steps
  const getIconForStep = (stepId: string) => {
    switch(stepId) {
      case 'verify-email': return Mail;
      case 'create-organization': return Building;
      case 'dashboard': return LayoutDashboard;
      default: return Mail;
    }
  };
  
  // Define the steps using the config
  const steps: Step[] = authConfig.authFlow.steps.map((step, index) => {
    const baseStep = {
      id: index + 1,
      title: step.title,
      Icon: getIconForStep(step.id),
      color: index === 0 ? "bg-blue-500" : index === 1 ? "bg-green-500" : "bg-purple-500",
      description: step.description
    };
    
    // Add context to the current step (organization creation)
    if (index === 1 && (orgName || location)) {
      return {
        ...baseStep,
        context: {
          orgName: orgName || undefined,
          location: location || undefined
        }
      };
    }
    
    return baseStep;
  });
  
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <OnboardingStepIndicator
        steps={steps}
        currentStep={numericStep}
        progress={progress}
      />
    </div>
  );
}
