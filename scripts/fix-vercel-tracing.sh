#!/bin/bash

# This script fixes common issues with Next.js App Router on Vercel deployments
# Run this script right before deploying to Vercel

echo "🛠️ Fixing Next.js configuration for Vercel deployment..."

# Make sure next.config.mjs exists and has the proper settings
if [ -f "next.config.mjs" ]; then
  echo "✅ Found next.config.mjs"
  
  # Check for outputFileTracing setting
  if grep -q "outputFileTracing: false" next.config.mjs; then
    echo "✅ outputFileTracing is correctly set to false"
  else
    echo "⚠️ Adding outputFileTracing: false to next.config.mjs"
    # Use sed to add the setting after the closing brace of the experimental section
    sed -i '' 's/},/},\n  outputFileTracing: false,/' next.config.mjs
  fi
else
  echo "❌ next.config.mjs not found!"
  exit 1
fi

# Make sure the .vercelignore file exists and is properly configured
if [ ! -f ".vercelignore" ]; then
  echo "⚠️ Creating .vercelignore file"
  cat > .vercelignore << 'EOL'
.git
node_modules
.next/cache
tsconfig.tsbuildinfo
EOL
else
  echo "✅ .vercelignore file exists"
fi

# Fix the issue with app directory tracing
echo "Ensuring app directory is properly configured for Vercel..."

# Create a simple page.js file in the app directory if it doesn't exist
if [ ! -f "app/_vercel_trace_helper.js" ]; then
  echo "⚠️ Creating trace helper file"
  cat > app/_vercel_trace_helper.js << 'EOL'
/**
 * This file helps Vercel properly trace file dependencies.
 * It should not be imported anywhere.
 */
export const VercelTraceHelper = true;
EOL
fi

echo "✅ Vercel deployment fixes applied successfully!"
echo "You can now deploy to Vercel with improved compatibility."
