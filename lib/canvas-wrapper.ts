// A wrapper for the canvas module to handle cases where it can't be loaded
// Provides fallback functionality when canvas is not available

// Create a mock canvas module with all the commonly used functions
const mockCanvas = {
  createCanvas: (width: number, height: number) => ({
    width,
    height,
    getContext: () => ({
      clearRect: () => {},
      fillRect: () => {},
      fillText: () => {},
      measureText: () => ({ width: 0 }),
      getImageData: () => ({ data: new Uint8Array() }),
      putImageData: () => {},
      drawImage: () => {},
      createImageData: () => ({ data: new Uint8Array() }),
      setTransform: () => {},
      save: () => {},
      restore: () => {},
      scale: () => {},
      rotate: () => {},
      translate: () => {},
      transform: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      stroke: () => {},
      fill: () => {},
    }),
    toBuffer: () => Buffer.from([]),
    toDataURL: () => '',
  }),
  loadImage: async () => ({ width: 0, height: 0 }),
  Image: function() { this.src = ''; this.onload = null; this.onerror = null; },
  registerFont: () => {},
};

let canvasModule = mockCanvas;

// Only try to load the real canvas module if:
// 1. We're in a Node.js environment
// 2. We're not in a environment where CANVAS_DISABLE is set to '1'
// 3. We're not in Vercel's serverless environment
if (
  typeof process !== 'undefined' && 
  process.env.CANVAS_DISABLE !== '1' &&
  process.env.VERCEL !== '1'
) {
  try {
    // Dynamic require to avoid build-time errors
    const actualCanvas = require('canvas');
    canvasModule = actualCanvas;
    console.log('Canvas module loaded successfully');
  } catch (error) {
    console.warn('Canvas module could not be loaded. Using mock implementation.');
  }
}

export default canvasModule;
