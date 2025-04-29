#!/bin/bash

# This script is specifically for Vercel deployments
# It ensures that all required dependencies are properly installed

# Exit on error
set -e

echo "🚀 Running Vercel deployment setup..."

# Log the build environment
echo "Logging build environment..."
node -e "require('./scripts/build-env-log.js')()"

# Create environment indicator for Vercel
echo "VERCEL=1" > .env.local
echo "Setting VERCEL=1 environment variable"

# Make sure critical packages are installed
echo "Installing critical dependencies..."
npm list critters || npm install critters@0.0.20
npm list punycode.js || npm install punycode.js

# Verify modules
echo "Verifying critical modules..."
node ./scripts/verify-modules.js || {
  echo "Module verification failed. Installing missing modules..."
  npm install critters@0.0.20 punycode.js
}

# Custom step to ensure dashboard client reference manifest is included
echo "Pre-build checks for dashboard routes..."
if [ -f "app/(dashboard)/page_client-reference-manifest.js" ]; then
  echo "✅ Dashboard page client reference manifest exists"
else
  echo "⚠️ Dashboard page client reference manifest missing, creating now..."
  cat > "app/(dashboard)/page_client-reference-manifest.js" << 'EOL'
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
  echo "✅ Created dashboard page client reference manifest"
fi

# Make sure we're using the correct Next.js config
echo "Setting up Next.js configuration for Vercel..."
# We're now using next.config.mjs instead of next.config.js
if [ -f "next.config.js" ]; then
  echo "Backing up next.config.js..."
  mv next.config.js next.config.js.backup
fi

# Make sure next.config.mjs exists and is properly formatted
if [ ! -f "next.config.mjs" ]; then
  echo "Creating next.config.mjs..."
  cp next.config.js.backup next.config.mjs
  # Replace module.exports with export default
  sed -i 's/module.exports = nextConfig;/export default nextConfig;/g' next.config.mjs
fi

# Double check that workaround.js exists
if [ ! -f "./app/workaround.js" ]; then
  echo "Creating workaround.js..."
  mkdir -p ./app
  cat > ./app/workaround.js << 'EOL'
/**
 * This file contains workarounds for module resolution issues in the Vercel environment
 * It exports patched versions of problematic dependencies
 */

// Provide a fallback for the critters module
// ES Module version (no require statements)
const crittersWorkaround = {
  process: async (html) => html,
  // Add other methods as needed
};

// Default export for ES modules
export default crittersWorkaround;

// Named exports
export { crittersWorkaround };

// Other workarounds can be added here as needed
EOL
fi

# Make sure canvas-mock.js exists
if [ ! -f "./app/canvas-mock.js" ]; then
  echo "Creating canvas-mock.js..."
  mkdir -p ./app
  cat > ./app/canvas-mock.js << 'EOL'
/**
 * Mock implementation of the canvas module for client-side usage
 * This avoids issues with the canvas module which is primarily for server-side usage
 */

// Export a mock Canvas class
class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getContext() {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (x, y, w, h) => ({
        data: new Array(w * h * 4),
      }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    };
  }

  toDataURL() {
    return '';
  }
}

// Export a mock Image class
class Image {
  constructor() {
    this.onload = null;
    this.width = 0;
    this.height = 0;
    this.src = '';
  }
}

// ES modules export
const createCanvas = (width, height) => new Canvas(width, height);
const loadImage = () => Promise.resolve(new Image());

export { Canvas, Image, createCanvas, loadImage };
export default { Canvas, Image, createCanvas, loadImage };
EOL
fi

# Build with optimizeCss disabled for Vercel
echo "Starting build process with optimizeCss disabled..."

# Verify client reference manifest helpers exist
echo "Checking client reference manifest helpers..."
if [ ! -f "./app/(dashboard)/_vercel_trace_helper.js" ]; then
  echo "Creating trace helper for dashboard pages..."
  mkdir -p ./app/\(dashboard\)
  cat > ./app/\(dashboard\)/_vercel_trace_helper.js << 'EOL'
/**
 * This file helps Vercel properly trace file dependencies for the dashboard.
 * It should not be imported anywhere.
 */

// This stub ensures the client reference manifest gets generated correctly
export const VercelClientReferenceManifestHelper = true;
EOL
  echo "✅ Created dashboard trace helper"
fi

# Run Next.js build with file tracing disabled
echo "Building with file tracing disabled..."
VERCEL=1 NODE_OPTIONS="--max-old-space-size=4096" NEXT_DISABLE_FILE_SYSTEM_CACHE=1 ./node_modules/.bin/next build

# Post-build: Run the client reference manifest fix script
echo "Running post-build client manifest fixes..."
chmod +x ./scripts/fix-client-manifests.sh
./scripts/fix-client-manifests.sh

echo "✅ Vercel build completed successfully!"
