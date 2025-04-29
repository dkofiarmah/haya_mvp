/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suppress the punycode deprecation warnings
  reactStrictMode: true,
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    optimizeCss: true,
    parallelServerCompiles: true,
  },
  // Add this section to handle the punycode deprecation warning and canvas issues
  webpack: (config, { isServer, dev }) => {
    // Force dynamic rendering for experiences route
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();
      return entries;
    };

    // The existing webpack configuration will be merged with this
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
        canvas: false,
        'canvas-prebuilt': false,
        // Additional fallbacks for Node modules
        fs: false,
        path: false,
        os: false
      };
    }
    
    // Add canvas and related packages to the list of external packages
    config.externals = [
      ...(config.externals || []), 
      'canvas',
      'jsdom',
      'canvas-prebuilt',
      'pdfjs-dist'
    ];
    
    // If using canvas in server components, use @napi-rs/canvas
    if (isServer) {
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: 'canvas', alias: '@napi-rs/canvas' });
      } else {
        config.resolve.alias = {
          ...config.resolve.alias,
          canvas: '@napi-rs/canvas'
        };
      }
    }

    // Important: return the modified config
    return config;
  },
}

module.exports = nextConfig;
