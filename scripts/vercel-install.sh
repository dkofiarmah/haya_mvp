#!/bin/bash

# This script ensures all required dependencies are installed for Vercel deployment
# It's used as the installCommand in vercel.json

# Exit on error
set -e

echo "🔧 Installing dependencies for Vercel deployment..."

# Install dependencies using pnpm
echo "Installing base dependencies with pnpm..."
pnpm install --no-frozen-lockfile

# Install specific versions of problematic packages
echo "Installing specific versions of critical packages..."
npm install critters@0.0.20
npm install punycode.js@2.3.1

# Run verification
echo "Verifying module installations..."
node ./scripts/verify-modules.js || {
  echo "⚠️ Module verification failed. Trying to fix..."
  npm install critters@0.0.20 punycode.js@2.3.1
  # Check again
  node ./scripts/verify-modules.js || {
    echo "❌ Module verification still failing. Build might fail."
  }
}

echo "✅ Dependencies installation complete"
