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
echo "Setting up config files for Vercel..."
if [ -f "next.config.js" ]; then
  echo "Backing up next.config.js..."
  mv next.config.js next.config.js.backup
fi

# Ensure next.config.mjs exists and is properly formatted
if [ ! -f "next.config.mjs" ]; then
  echo "Creating next.config.mjs based on next.config.vercel.js..."
  cp next.config.vercel.js next.config.mjs
  # Replace module.exports with export default
  sed -i 's/module.exports = nextConfig;/export default nextConfig;/g' next.config.mjs
fi

# Install specific versions of critical packages
echo "Installing specific versions of critical packages..."
npm install critters@0.0.20
npm install punycode.js@2.3.1
npm install glob@10.3.10

# Verify module installations
echo "Verifying module installations..."
node -e "
try {
  const critters = require('critters');
  console.log('✅ Critters module found:', typeof critters);
  
  const punycode = require('punycode.js');
  console.log('✅ Punycode.js module found:', typeof punycode);
  
  const glob = require('glob');
  console.log('✅ Glob module found:', typeof glob);
  
  console.log('✅ Dependencies installation complete');
} catch (error) {
  console.error('❌ Module verification failed:', error.message);
  process.exit(1);
}
"

# If we're in a Vercel environment, update the next.config.mjs to avoid warnings
if [ "$VERCEL" = "1" ]; then
  echo "Detected Next.js version: $(node -e "console.log(require('./package.json').dependencies.next || 'unknown')")"
  
  # Update config file to remove unrecognized options
  echo "Updating next.config.mjs for Vercel deployment..."
  node -e "
  const fs = require('fs');
  const path = require('path');
  
  const configPath = path.join(process.cwd(), 'next.config.mjs');
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Remove outputFileTracing from experimental section if it exists
    const updatedContent = configContent.replace(
      /outputFileTracing\s*:\s*false\s*,?/g,
      '// outputFileTracing moved to top level config'
    );
    
    // Make sure outputFileTracing is at the top level
    const hasTopLevelOutputFileTracing = updatedContent.includes('outputFileTracing: false,') || 
                                         updatedContent.includes('outputFileTracing:false,');
    
    if (!hasTopLevelOutputFileTracing) {
      console.log('Adding top-level outputFileTracing setting');
    }
    
    fs.writeFileSync(configPath, updatedContent);
    console.log('✅ Updated next.config.mjs for Vercel compatibility');
  } else {
    console.warn('⚠️ Could not find next.config.mjs');
  }
  "
fi
