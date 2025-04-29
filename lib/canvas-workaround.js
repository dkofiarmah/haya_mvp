/**
 * Canvas Workaround for Vercel
 * 
 * This file provides compatibility between different canvas implementations
 * and prevents build errors in environments that don't support native modules.
 */

let canvasImplementation;

// Attempt to load @napi-rs/canvas for better performance
try {
  // Check if we're on Vercel
  if (process.env.VERCEL === '1') {
    // Use the mock implementation on Vercel
    canvasImplementation = require('./canvas-mock');
  } else {
    // Use the optimized native implementation when possible
    canvasImplementation = require('@napi-rs/canvas');
  }
} catch (err) {
  console.warn('Failed to load @napi-rs/canvas, using mock canvas implementation');
  // Fallback to the mock implementation
  canvasImplementation = require('./canvas-mock');
}

module.exports = canvasImplementation;
