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
  // Explicitly disable file tracing at the top level (important for Vercel)
  outputFileTracing: false,
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    // Disable CSS optimization entirely for Vercel
    optimizeCss: false,
    parallelServerCompiles: true,
    serverMinification: false, // Disable server-side code minification for better tracing
    forceSwcTransforms: true, // Force using SWC for all transformations
    instrumentationHook: true, // Enable instrumentation hook for better debugging
  },
  // Custom webpack configuration
  webpack: (config, { isServer, dev }) => {
    try {
      // Force dynamic rendering for all routes
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        return entries;
      };

      // Add a special resolver fallback for client reference manifest files
      if (!config.resolve) {
        config.resolve = {};
      }

      if (!config.resolve.fallback) {
        config.resolve.fallback = {};
      }

      // Add fallback for dashboard client reference manifest
      config.resolve.fallback['./app/(dashboard)/page_client-reference-manifest.js'] =
        require.resolve('./app/(dashboard)/page_client-reference-manifest.js');

      // Make dashboard routes work better with static optimization
      if (isServer) {
        if (!config.optimization) {
          config.optimization = {};
        }

        // Ensure all dashboard route files are kept together and not split
        if (!config.optimization.concatenateModules) {
          config.optimization.concatenateModules = true;
        }
      }

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
  // Ensure we don't generate source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
