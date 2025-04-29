// A wrapper for the canvas module to handle cases where it can't be loaded
let canvasModule = null;

try {
  // Only try to load canvas if not explicitly disabled
  if (typeof process !== 'undefined' && process.env.CANVAS_DISABLE !== '1') {
    // Use dynamic import with a try/catch to avoid build-time errors
    canvasModule = { createCanvas: () => null, loadImage: () => null };
    
    // This will be executed only in environments where canvas is available
    if (process.env.NODE_ENV !== 'production') {
      try {
        const actualCanvas = require('canvas');
        canvasModule = actualCanvas;
      } catch (e) {
        console.warn('Canvas module not available in development environment');
      }
    }
  }
} catch (error) {
  console.warn('Canvas module could not be loaded. Some features may be unavailable.');
}

export default canvasModule;
