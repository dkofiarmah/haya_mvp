#!/bin/bash

# This script performs a final check before deploying to Vercel
# It verifies that all the necessary files and configurations are in place

# Exit on error
set -e

echo "🔍 Running pre-deployment checks..."

# Check for critical files
echo "Checking for critical files..."
FILES_OK=true

# Check for config files
if [ ! -f "next.config.js" ]; then
  echo "❌ next.config.js is missing"
  FILES_OK=false
fi

if [ ! -f "vercel.json" ]; then
  echo "❌ vercel.json is missing"
  FILES_OK=false
fi

# Check for build scripts
if [ ! -f "scripts/vercel-build.sh" ]; then
  echo "❌ scripts/vercel-build.sh is missing"
  FILES_OK=false
fi

if [ ! -f "scripts/vercel-install.sh" ]; then
  echo "❌ scripts/vercel-install.sh is missing"
  FILES_OK=false
fi

if [ ! -f "scripts/verify-modules.js" ]; then
  echo "❌ scripts/verify-modules.js is missing"
  FILES_OK=false
fi

if [ ! -f "scripts/test-critters.js" ]; then
  echo "❌ scripts/test-critters.js is missing"
  FILES_OK=false
fi

# Check for workaround files
if [ ! -f "app/workaround.js" ]; then
  echo "❌ app/workaround.js is missing"
  FILES_OK=false
fi

if [ ! -f "app/canvas-mock.js" ]; then
  echo "❌ app/canvas-mock.js is missing"
  FILES_OK=false
fi

# Check if all files are present
if [ "$FILES_OK" = true ]; then
  echo "✅ All critical files are present"
else
  echo "❌ Some critical files are missing. Please fix before deploying."
  exit 1
fi

# Verify modules are installed
echo "Verifying module installation..."
node ./scripts/verify-modules.js || {
  echo "❌ Module verification failed. Please run 'npm install critters@0.0.20 punycode.js' before deploying."
  exit 1
}

# Check for executable permissions on shell scripts
echo "Checking executable permissions on shell scripts..."
if [ ! -x "scripts/vercel-build.sh" ]; then
  echo "❌ scripts/vercel-build.sh is not executable. Running: chmod +x scripts/vercel-build.sh"
  chmod +x scripts/vercel-build.sh
fi

if [ ! -x "scripts/vercel-install.sh" ]; then
  echo "❌ scripts/vercel-install.sh is not executable. Running: chmod +x scripts/vercel-install.sh"
  chmod +x scripts/vercel-install.sh
fi

if [ ! -x "scripts/test-vercel-build.sh" ]; then
  echo "❌ scripts/test-vercel-build.sh is not executable. Running: chmod +x scripts/test-vercel-build.sh"
  chmod +x scripts/test-vercel-build.sh
fi

# All checks passed
echo "✅ All pre-deployment checks passed!"
echo "Your project is ready to be deployed to Vercel."
echo ""
echo "To run a local Vercel build test, use:"
echo "  npm run test-vercel-build"
echo ""
echo "To deploy to Vercel, use:"
echo "  vercel"
echo ""
