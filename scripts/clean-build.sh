#!/bin/bash
# clean-build.sh - Script to clean and build the Next.js application

# Print commands and their arguments as they are executed
set -x

# Clean the Next.js cache and build directories
echo "Cleaning Next.js cache and build directories..."
rm -rf .next
rm -rf .vercel/output

# Run the vercel-build script from package.json which already handles canvas cleanup and build
echo "Running vercel-build script..."
npm run vercel-build

# Exit with the status of the last command
exit $?
