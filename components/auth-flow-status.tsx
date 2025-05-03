"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { OnboardingStepIndicator, type Step } from "@/components/onboarding-step-indicator"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { useAuthFlow } from "@/hooks/use-auth-flow"
import { Mail, Building, LayoutDashboard } from "lucide-react"
import { authConfig } from "@/lib/config"
import { supabaseClient } from "@/lib/supabase/auth-client"

interface AuthFlowStatusProps {
  currentStep: 'verify-email' | 'create-organization' | 'dashboard'
}

export function AuthFlowStatus({ currentStep }: AuthFlowStatusProps) {
  const { user } = useAuth()
  const { isVerified, hasOrganization, organizationId } = useAuthFlow()
  const [orgData, setOrgData] = useState<{ name?: string; location?: string }>({})
  const [loading, setLoading] = useState(false)
  
  // Fetch organization data if user has one
  useEffect(() => {
    const fetchOrgData = async () => {
      if (hasOrganization && organizationId) {
        setLoading(true)
        try {
          // Get organization details
          const { data: org, error } = await supabaseClient
            .from('organizations')
            .select('name, settings')
            .eq('id', organizationId)
            .single()
          
          if (!error && org) {
            setOrgData({
              name: org.name,
              location: org.settings?.companyDetails?.locations?.headquarters || null
            })
          }
        } catch (err) {
          console.error("Error fetching organization data", err)
        } finally {
          setLoading(false)
        }
      }
    }
    
    fetchOrgData()
  }, [hasOrganization, organizationId])
  
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
    // Base step configuration
    const baseStep = {
      id: index + 1,
      title: step.title,
      Icon: getIconForStep(step.id),
      color: index === 0 ? "bg-blue-500" : index === 1 ? "bg-green-500" : "bg-purple-500",
      description: step.description
    };
    
    // Add organization context to the create-org and dashboard steps
    if ((index === 1 || index === 2) && orgData.name) {
      return {
        ...baseStep,
        context: {
          orgName: orgData.name,
          location: orgData.location
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
  )
}
