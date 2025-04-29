/**
 * Canvas Mock for Vercel
 * 
 * This file provides a mock implementation of the canvas module
 * for environments where native canvas dependencies aren't available.
 */

class MockContext {
  constructor() {
    this.fillStyle = '#000000';
    this.font = '10px sans-serif';
    this.textAlign = 'start';
    this.textBaseline = 'alphabetic';
  }
  
  fillRect() {}
  fillText() {}
  measureText() { return { width: 0 }; }
  getImageData() { return { data: new Uint8ClampedArray() }; }
  putImageData() {}
  drawImage() {}
  scale() {}
  clearRect() {}
}

class MockCanvas {
  constructor(width, height) {
    this.width = width || 300;
    this.height = height || 150;
  }
  
  getContext() {
    return new MockContext();
  }
  
  toBuffer() {
    return Buffer.from([]);
  }
  
  toDataURL() {
    return 'data:image/png;base64,';
  }
  
  createPNGStream() {
    const { Readable } = require('stream');
    const readable = new Readable();
    readable.push(null);
    return readable;
  }
}

const createCanvas = (width, height) => {
  return new MockCanvas(width, height);
};

// Export the mock functions and constructors
module.exports = {
  createCanvas,
  Canvas: MockCanvas,
  Image: class {},
  ImageData: class {},
  PNGStream: class {}
};