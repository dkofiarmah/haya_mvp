// This file fixes the "cannot find module canvas" error in Next.js
// by providing a mock implementation when real canvas is not available

const mockCanvas = {
  createCanvas: () => ({
    getContext: () => ({
      fillStyle: '',
      fillRect: () => {},
      fillText: () => {},
      measureText: () => ({ width: 0 }),
      getImageData: () => ({ data: new Uint8ClampedArray() }),
      putImageData: () => {},
      drawImage: () => {},
      scale: () => {},
      clearRect: () => {}
    }),
    toBuffer: () => Buffer.from([]),
    toDataURL: () => 'data:image/png;base64,',
    width: 0,
    height: 0
  })
};

export default process.env.VERCEL ? mockCanvas : require('@napi-rs/canvas');
