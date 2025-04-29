#!/bin/bash

# This script is specifically for Vercel installation
# It ensures that all required dependencies are properly installed

# Exit on error
set -e

echo "🔧 Installing dependencies for Vercel deployment..."

# Install base dependencies with pnpm
echo "Installing base dependencies with pnpm..."
pnpm install --no-frozen-lockfile

# Clean up existing config files that might cause issues
echo "Cleaning up potential problematic config files..."
if [ -f "next.config.mjs" ]; then
  mv next.config.mjs next.config.mjs.backup
fi

# Install specific versions of critical packages
echo "Installing specific versions of critical packages..."
npm install critters@0.0.20
npm install punycode.js@2.3.1

# Verify module installations
echo "Verifying module installations..."
node -e "
try {
  const critters = require('critters');
  console.log('✅ Critters module found:', typeof critters);
  
  const punycode = require('punycode.js');
  console.log('✅ Punycode.js module found:', typeof punycode);
  
  console.log('✅ Dependencies installation complete');
} catch (error) {
  console.error('❌ Module verification failed:', error.message);
  process.exit(1);
}
"

# If we're in a Vercel environment, update the next.config.js to avoid warnings
if [ "$VERCEL" = "1" ]; then
  echo "Detected Next.js version: $(node -e "console.log(require('./package.json').dependencies.next || 'unknown')")"
  
  # Update config file to remove unrecognized options
  echo "Updating next.config.js for Vercel deployment..."
  node -e "
  const fs = require('fs');
  const path = require('path');
  
  const configPath = path.join(process.cwd(), 'next.config.js');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Remove outputFileTracing from experimental section if it exists
  const updatedContent = configContent.replace(
    /outputFileTracing\s*:\s*false\s*,?/g,
    '// outputFileTracing removed for Vercel compatibility'
  );
  
  fs.writeFileSync(configPath, updatedContent);
  console.log('✅ Updated next.config.js for Vercel compatibility');
  "
fi
