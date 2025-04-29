/**
 * This file provides an adapter for canvas operations
 * It uses @napi-rs/canvas but provides compatibility with node-canvas API
 */

import { createCanvas, Canvas, loadImage } from '@napi-rs/canvas';

// Export the napi-rs/canvas implementation with the same API as node-canvas
export { 
  createCanvas,
  loadImage,
  Canvas
};

// If your app uses text2png, add this compatibility adapter
export function text2png(text, options = {}) {
  const {
    font = '30px sans-serif',
    textAlign = 'left',
    color = 'black',
    backgroundColor = 'transparent',
    lineSpacing = 0,
    padding = 0,
    borderWidth = 0,
    borderColor = 'black',
    output = 'buffer',
    width
  } = options;

  // Estimate width and height based on text
  const canvas = createCanvas(
    width || 500, 
    100
  );
  const ctx = canvas.getContext('2d');
  
  // Apply styles
  ctx.font = font;
  ctx.textAlign = textAlign;
  ctx.fillStyle = backgroundColor;
  
  // Handle background
  if (backgroundColor !== 'transparent') {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Draw text
  ctx.fillStyle = color;
  ctx.fillText(text, padding, 50);
  
  // Handle border if requested
  if (borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }
  
  // Return appropriate format
  if (output === 'buffer') {
    return canvas.toBuffer('image/png');
  } else if (output === 'dataURL') {
    return canvas.toDataURL('image/png');
  } else if (output === 'canvas') {
    return canvas;
  }
  
  // Default to buffer
  return canvas.toBuffer('image/png');
}

export default {
  createCanvas,
  loadImage,
  Canvas,
  text2png
};
