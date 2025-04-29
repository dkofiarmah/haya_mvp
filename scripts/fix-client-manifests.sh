#!/bin/bash

# This script runs as a post-build step to ensure client reference manifests are correctly placed
# It's specifically designed to fix the ENOENT error for page_client-reference-manifest.js files

echo "🔧 Running client reference manifest fix..."

# Function to fix a specific route's client reference manifest
fix_client_reference_manifest() {
  local route=$1
  local build_dir=".next/server/app"
  local client_manifest="${route}/page_client-reference-manifest.js"
  local default_manifest="app/_root_client-reference-manifest.js"
  
  echo "Checking ${route} client reference manifest..."
  
  # If the manifest doesn't exist in the build output, create it
  if [ ! -f "${build_dir}/${client_manifest}" ]; then
    echo "⚠️ Missing manifest: ${build_dir}/${client_manifest}"
    
    # Create directory if it doesn't exist
    mkdir -p "${build_dir}/${route}"
    
    # If a root manifest exists, copy it as a template
    if [ -f "${build_dir}/${default_manifest}" ]; then
      echo "  → Copying from root manifest"
      cp "${build_dir}/${default_manifest}" "${build_dir}/${client_manifest}"
    else
      echo "  → Creating default manifest"
      cat > "${build_dir}/${client_manifest}" << 'EOL'
// Automatically generated client-reference-manifest
globalThis.__RSC_MANIFEST = {
  ssrModuleMapping: {},
  edgeSSRModuleMapping: {},
  clientModules: {},
  entryCSSFiles: {}
};
EOL
    fi
    
    echo "✅ Created manifest for ${route}"
  else
    echo "✅ Manifest exists for ${route}"
  fi
}

# Main execution
echo "Checking build output directory..."
if [ -d ".next/server/app" ]; then
  # Fix specific routes that have issues
  fix_client_reference_manifest "(dashboard)"
  
  # Add more routes as needed
  # fix_client_reference_manifest "other-problematic-route"
  
  echo "✅ Client reference manifest fix completed"
else
  echo "⚠️ Build output directory not found!"
  echo "Make sure the build has run before executing this script."
  exit 1
fi
