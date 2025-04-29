// This file provides a mock implementation for canvas-related functions
// when the real canvas library can't be loaded in serverless environments

// Detect if we're in a Node.js environment
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

// Mock canvas implementation
class MockCanvas {
  constructor(width, height) {
    this.width = width || 300;
    this.height = height || 150;
    this.style = {};
  }

  getContext() {
    return {
      fillStyle: '',
      font: '',
      textAlign: 'start',
      textBaseline: 'alphabetic',
      fillRect: () => {},
      fillText: () => {},
      measureText: () => ({ width: 0 }),
      createLinearGradient: () => ({
        addColorStop: () => {}
      }),
      beginPath: () => {},
      rect: () => {},
      fill: () => {},
      stroke: () => {},
      arc: () => {},
      drawImage: () => {}
    };
  }

  toDataURL() {
    return 'data:,';
  }

  toBuffer() {
    return Buffer.from([]);
  }
}

// Mock text2png function
function mockText2png(text, options = {}) {
  if (isNode) {
    return Buffer.from([]);
  }
  return 'data:,';
}

// Export the mock implementations if the real ones fail to load
if (typeof window === 'undefined' && isNode) {
  try {
    // First try to use the real modules if available
    module.exports = {
      Canvas: require('canvas').Canvas,
      text2png: require('text2png')
    };
  } catch (e) {
    // If the real modules aren't available, use our mocks
    console.warn('Using mock canvas implementation as native canvas failed to load');
    module.exports = {
      Canvas: MockCanvas,
      text2png: mockText2png
    };
  }
} else if (typeof window !== 'undefined') {
  // In browser environments, use the browser's canvas
  window.MockCanvas = MockCanvas;
  window.mockText2png = mockText2png;
}
