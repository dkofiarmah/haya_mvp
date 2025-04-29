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
