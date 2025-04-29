// A wrapper for the canvas module to handle cases where it can't be loaded
let canvasModule = null;

try {
  // Only try to load canvas if not explicitly disabled
  if (typeof process !== 'undefined' && process.env.CANVAS_DISABLE !== '1') {
    canvasModule = require('canvas');
  }
} catch (error) {
  console.warn('Canvas module could not be loaded. Some features may be unavailable.');
}

export default canvasModule;
