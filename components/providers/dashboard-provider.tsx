"use client"

import * as React from "react"
import { createContext, useContext, useEffect, ReactNode } from "react"
import { useAuth } from "./supabase-auth-provider"
import { useOrganization } from "@/lib/organizations"
// We're not using the DashboardHeader anymore as it's replaced by TopNavigation
// which is now included in the DashboardLayout

interface DashboardContextType {
  organizationName: string | null
}

const DashboardContext = createContext<DashboardContextType>({ organizationName: null })

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { currentOrganization } = useOrganization()

  return (
    <DashboardContext.Provider value={{ organizationName: currentOrganization?.name || null }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  return useContext(DashboardContext)
}