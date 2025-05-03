"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { useOnboarding } from "@/hooks/use-onboarding"
import { Loading } from "@/components/loading"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuthFlow } from "@/hooks/use-auth-flow"
import { authFlowRoutes } from "@/lib/routes"
import { Button } from "@/components/ui/button"

export default function DashboardLayoutComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { isComplete, isLoading: onboardingLoading } = useOnboarding()
  const { isLoading: flowLoading, isVerified, hasOrganization, navigateToNextStep, error } = useAuthFlow()

  useEffect(() => {
    // Wait for all loading states to resolve
    if (authLoading || flowLoading) {
      return
    }
    
    // First check if user exists
    if (!user) {
      router.push("/auth/login")
      return
    }
    
    // Use the auth flow hook's next step determination
    if (!isVerified || !hasOrganization) {
      navigateToNextStep()
      return
    }
  }, [user, authLoading, flowLoading, isVerified, hasOrganization, router, navigateToNextStep])

  if (authLoading || onboardingLoading || flowLoading) {
    return <Loading />
  }

  // Handle potential errors in the auth flow
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-md text-center p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/auth/login')}>Return to Login</Button>
        </div>
      </div>
    )
  }

  // Only render if user is authenticated, verified and has an organization
  if (user && isVerified && hasOrganization) {
    return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
    )
  }
  
  // This will be rendered briefly before the redirects happen
  return <Loading />
}
