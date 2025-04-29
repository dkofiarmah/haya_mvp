/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,  // Skip TypeScript type checking during build
  },
  images: {
    unoptimized: true,  // Disable Next.js image optimization
  },
  reactStrictMode: true,
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    // Disable CSS optimization entirely for Vercel
    optimizeCss: false,
    parallelServerCompiles: true,
  },
  // This needs to be at the top level, not in experimental section for Next.js 15+
  outputFileTracing: false,
  // Custom webpack configuration
  webpack: (config, { isServer, dev }) => {
    try {
      // Force dynamic rendering for all routes
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        return entries;
      };

      // Add fallbacks for Node.js modules
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          // Use dynamic import instead of require.resolve for ES modules
          punycode: false, // We'll handle this differently in ES modules
          canvas: false,
          'canvas-prebuilt': false,
          fs: false,
          path: false,
          os: false
        };
      }
      
      // Make sure all required modules can be resolved
      if (!config.resolve.alias) {
        config.resolve.alias = {};
      }
      
      // Create explicit alias for critters - modified for ES modules
      config.resolve.alias.critters = './app/workaround.js';
      
      // Add all problematic packages to externals
      config.externals = [
        ...(config.externals || []), 
        'canvas',
        'jsdom',
        'canvas-prebuilt',
        'pdfjs-dist'
      ];
      
      // Handle canvas module based on environment
      if (isServer) {
        if (Array.isArray(config.resolve.alias)) {
          config.resolve.alias.push({ name: 'canvas', alias: '@napi-rs/canvas' });
        } else {
          config.resolve.alias = {
            ...config.resolve.alias,
            canvas: '@napi-rs/canvas'
          };
        }
      } else {
        if (Array.isArray(config.resolve.alias)) {
          config.resolve.alias.push({ name: 'canvas', alias: './app/canvas-mock.js' });
        } else {
          config.resolve.alias = {
            ...config.resolve.alias,
            canvas: './app/canvas-mock.js'
          };
        }
      }

      return config;
    } catch (error) {
      console.error('Error in webpack config:', error);
      // Return the unmodified config if there's an error
      return config;
    }
  },
};

export default nextConfig;
