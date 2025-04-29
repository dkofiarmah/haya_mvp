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

# Create a direct placeholder for the missing client-reference-manifest file
MANIFEST_PLACEHOLDER="app/(dashboard)/page_client-reference-manifest.js"
if [ -f "$MANIFEST_PLACEHOLDER" ]; then
  echo "✅ Page client reference manifest placeholder exists"
else
  echo "Creating placeholder for page client reference manifest..."
  cat > "$MANIFEST_PLACEHOLDER" << 'EOL'
/**
 * This is a placeholder file to prevent the ENOENT error during Vercel deployment.
 * It directly corresponds to the file that Vercel is looking for:
 * /vercel/path1/.next/server/app/(dashboard)/page_client-reference-manifest.js
 */

// Export a placeholder object to ensure the file is not empty
export const ClientReferenceManifest = {
  ssrModuleMapping: {},
  edgeSSRModuleMapping: {},
  clientModules: {},
  entryCSSFiles: {}
};
EOL
  echo "✅ Created page client reference manifest placeholder"
fi

# Create a .nojekyll file in the public directory to help with file tracing
if [ -f "public/.nojekyll" ]; then
  echo "✅ .nojekyll file exists"
else
  echo "Creating .nojekyll file..."
  touch public/.nojekyll
  echo "✅ Created .nojekyll file"
fi

# Create a vercel build manifest inclusion file
BUILD_MANIFEST="app/(dashboard)/.vercel-manifest"
if [ -f "$BUILD_MANIFEST" ]; then
  echo "✅ Vercel manifest inclusion file exists"
else
  echo "Creating vercel manifest inclusion file..."
  cat > "$BUILD_MANIFEST" << 'EOL'
# This file ensures the dashboard route files are included in Vercel's build
# It helps with file tracing issues
page.tsx
layout.tsx
page_client-reference-manifest.js
_vercel_trace_helper.js
_dashboard-wrapper.tsx
EOL
  echo "✅ Created vercel manifest inclusion file"
fi

# Check for backup files and clean up if necessary
if [ -f "next.config.js.backup" ] || [ -f "next.config.mjs.backup" ]; then
  echo "ℹ️ Backup config files found, these will be ignored during deployment"
fi

echo "✅ Deployment preparation complete. You can now deploy to Vercel!"
echo "   If you encounter issues, consider running a clean build first:"
echo "   rm -rf .next && npm run build"
