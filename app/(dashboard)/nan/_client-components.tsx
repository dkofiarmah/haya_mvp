"use client";

/**
 * This file serves as a client reference wrapper for the dashboard page.
 * It helps Vercel properly identify and trace client components in the dashboard route,
 * preventing the ENOENT error for page_client-reference-manifest.js.
 */

// Import all client components that are used in the dashboard
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { OnboardingBanner } from "@/components/onboarding-banner";
import { useAuth } from "@/components/providers/supabase-auth-provider";
import { useOnboarding } from "@/hooks/use-onboarding";
import { supabaseClient } from "@/lib/supabase/auth-client";

// Re-export client components to ensure they're traced
export {
  DashboardMetrics,
  OnboardingBanner,
  useAuth,
  useOnboarding,
  supabaseClient
};

// This constant helps with client reference manifest generation
export const __NEXTJS_CLIENT_REFERENCES = true;
