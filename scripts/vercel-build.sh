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

# Make sure we're using the correct Next.js config
echo "Setting up Next.js configuration for Vercel..."
# Make sure we're using next.config.js and not next.config.mjs
if [ -f "next.config.mjs" ]; then
  mv next.config.mjs next.config.mjs.backup
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
export const crittersWorkaround = () => {
  try {
    // Try to load the critters module
    const critters = require('critters');
    return critters;
  } catch (error) {
    // Return a mock implementation if the real module can't be loaded
    console.warn('WARNING: Could not load critters module, using mock implementation');
    return {
      process: async (html) => html,
      // Add other methods as needed
    };
  }
};

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

module.exports = {
  Canvas,
  Image,
  createCanvas: (width, height) => new Canvas(width, height),
  loadImage: () => Promise.resolve(new Image()),
};
EOL
fi

# Build with optimizeCss disabled for Vercel
echo "Starting build process with optimizeCss disabled..."
VERCEL=1 NODE_OPTIONS="--max-old-space-size=4096" ./node_modules/.bin/next build
