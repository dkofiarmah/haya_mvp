#!/bin/bash

# This script simulates a Vercel build environment locally
# It's useful for testing if the build will work on Vercel

# Exit on error
set -e

echo "🔍 Simulating Vercel build environment locally..."

# Clean existing build artifacts
rm -rf .next
rm -rf node_modules/.cache

# Set Vercel environment variables
export VERCEL=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Make sure next is installed
if [ ! -f "./node_modules/.bin/next" ]; then
  echo "Installing next.js locally..."
  npm install next
fi

# Run the Vercel build script
bash ./scripts/vercel-build.sh

echo "✅ Test build completed successfully!"
echo "If this build succeeds, it should also work on Vercel."
