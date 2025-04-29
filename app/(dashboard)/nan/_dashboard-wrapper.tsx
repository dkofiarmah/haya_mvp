"use client";

/**
 * This is a special wrapper for the dashboard page that helps ensure
 * the client reference manifest gets properly generated during build time.
 * 
 * The issue with the missing page_client-reference-manifest.js file is often
 * related to Vercel's file tracing algorithm not properly detecting client
 * components in the route.
 */

// Import the main page component
import DashboardPage from '../page';

// Export an explicit client component wrapper to help with manifest generation
export default function DashboardPageWrapper() {
  return <DashboardPage />;
}

// Export a manifest helper that should trigger the generation of the client reference manifest
export const __VERCEL_MANIFEST_HELPER__ = {
  __clientManifestPath: 'app/(dashboard)/page_client-reference-manifest.js'
};
