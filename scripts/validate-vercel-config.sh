#!/bin/bash

# This script validates the configuration for Vercel deployment
# Run this before deploying to check for common issues

# Exit on error
set -e

echo "🔍 Validating Vercel deployment configuration..."

# Check for presence of key files
echo "Checking for required configuration files..."

# Check next.config.mjs
if [ -f "next.config.mjs" ]; then
  echo "✅ Found next.config.mjs"
else
  echo "❌ next.config.mjs is missing!"
  exit 1
fi

# Check for vercel.json
if [ -f "vercel.json" ]; then
  echo "✅ Found vercel.json"
else
  echo "❌ vercel.json is missing!"
  exit 1
fi

# Check for Vercel build scripts
if [ -f "scripts/vercel-build.sh" ] && [ -f "scripts/vercel-install.sh" ]; then
  echo "✅ Found Vercel build scripts"
else
  echo "❌ One or more Vercel build scripts are missing!"
  exit 1
fi

# Check for required app files
if [ -f "app/workaround.js" ] && [ -f "app/canvas-mock.js" ]; then
  echo "✅ Found required app workaround files"
else
  echo "❌ One or more app workaround files are missing!"
  exit 1
fi

# Validate next.config.mjs syntax
echo "Validating next.config.mjs syntax..."
node --check next.config.mjs && echo "✅ next.config.mjs syntax is valid" || {
  echo "❌ next.config.mjs contains syntax errors!"
  exit 1
}

# Validate ES modules compatibility in key files
echo "Checking ES modules compatibility..."
grep -l "export default" next.config.mjs > /dev/null && echo "✅ next.config.mjs uses ES module exports" || {
  echo "❌ next.config.mjs does not use ES module exports!"
  exit 1
}

grep -l "require(" app/workaround.js > /dev/null && {
  echo "❌ app/workaround.js contains CommonJS require statements!"
  exit 1
} || echo "✅ app/workaround.js is compatible with ES modules"

grep -l "module.exports" app/canvas-mock.js > /dev/null && {
  echo "❌ app/canvas-mock.js uses CommonJS exports!"
  exit 1
} || echo "✅ app/canvas-mock.js is compatible with ES modules"

# Check for AI service functions
echo "Checking AI service implementation..."
grep -l "generateAssistantResponse" lib/ai/ai-service.ts > /dev/null && echo "✅ generateAssistantResponse function is implemented" || {
  echo "❌ generateAssistantResponse function is missing from lib/ai/ai-service.ts!"
  exit 1
}

grep -l "saveMessage" lib/ai/ai-service.ts > /dev/null && echo "✅ saveMessage function is implemented" || {
  echo "❌ saveMessage function is missing from lib/ai/ai-service.ts!"
  exit 1
}

# Check Supabase client implementation
echo "Checking Supabase client implementation..."
grep -l "createServerClient" lib/supabase/server.ts > /dev/null && echo "✅ createServerClient function is implemented" || {
  echo "❌ createServerClient function is missing from lib/supabase/server.ts!"
  exit 1
}

echo "✅ All validation checks passed! Your configuration is ready for Vercel deployment."
