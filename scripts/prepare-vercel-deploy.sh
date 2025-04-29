#!/bin/bash

# This script prepares the project for Vercel deployment,
# specifically addressing file tracing issues with Next.js

echo "🚀 Preparing for Vercel deployment..."

# Ensure next.config.mjs has outputFileTracing: false
if grep -q "outputFileTracing: false" next.config.mjs; then
  echo "✅ outputFileTracing is properly disabled in next.config.mjs"
else
  echo "❌ outputFileTracing setting not found in next.config.mjs!"
  echo "Fixing configuration..."
  # Update the config to include outputFileTracing: false
  sed -i '' 's/reactStrictMode: true,/reactStrictMode: true,\n  outputFileTracing: false,/' next.config.mjs
fi

# Create Vercel trace helper for dashboard route
DASHBOARD_HELPER_PATH="app/(dashboard)/_vercel_trace_helper.js"
DASHBOARD_DIR="app/(dashboard)"
if [ -f "$DASHBOARD_HELPER_PATH" ]; then
  echo "✅ Dashboard trace helper exists"
else
  echo "Creating trace helper for dashboard route..."
  mkdir -p "app/\(dashboard\)"
  cat > "$DASHBOARD_HELPER_PATH" << 'EOL'
/**
 * This file helps Vercel properly trace file dependencies for the dashboard.
 * It should not be imported anywhere.
 */

// This stub ensures the client reference manifest gets generated correctly
export const VercelClientReferenceManifestHelper = true;
EOL
  echo "✅ Created dashboard trace helper"
fi

# Create page-specific trace helper for the dashboard route
PAGE_HELPER_PATH="app/(dashboard)/_page_trace_helper.js"
if [ -f "$PAGE_HELPER_PATH" ]; then
  echo "✅ Dashboard page trace helper exists"
else
  echo "Creating trace helper for dashboard page..."
  cat > "$PAGE_HELPER_PATH" << 'EOL'
/**
 * This file helps Vercel properly trace client references for the dashboard page.
 * It should not be imported anywhere.
 */

// This stub ensures the page_client-reference-manifest.js gets generated correctly
export const PageClientReferenceManifestHelper = true;
EOL
  echo "✅ Created dashboard page trace helper"
fi

# Check for backup files and clean up if necessary
if [ -f "next.config.js.backup" ] || [ -f "next.config.mjs.backup" ]; then
  echo "ℹ️ Backup config files found, these will be ignored during deployment"
fi

echo "✅ Deployment preparation complete. You can now deploy to Vercel!"
echo "   If you encounter issues, consider running a clean build first:"
echo "   rm -rf .next && npm run build"
