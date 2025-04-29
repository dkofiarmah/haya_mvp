"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { EnhancedOnboardingBanner } from "@/components/enhanced-onboarding-banner"
import { MenuIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/hooks/use-onboarding"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { isComplete } = useOnboarding()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar - responsive with mobile overlay - full height */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <DashboardSidebar 
          pathname={pathname} 
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Content wrapper - includes top nav and main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation starts at right edge of the sidebar */}
        <div className="lg:pl-0 w-full z-40">
          <TopNavigation />
        </div>

        {/* Mobile sidebar toggle */}
        <div className="fixed left-4 top-4 z-50 lg:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-background shadow-md"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content - with top padding to avoid content hiding under the top navigation */}
        <div className="flex-1 overflow-auto">
          <main className="container mx-auto p-4 lg:p-6 mt-16">
            {!isComplete && <EnhancedOnboardingBanner />}
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
