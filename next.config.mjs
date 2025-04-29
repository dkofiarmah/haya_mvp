import MiniCssExtractPlugin from 'mini-css-extract-plugin';

let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

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
    // The existing webpack configuration will be merged with this
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    
    // Handle canvas and related package issues in all environments
    // Add canvas and related packages to the list of external packages
    config.externals = [
      ...(config.externals || []), 
      'canvas',
      'jsdom',
      'canvas-prebuilt',
      'pdfjs-dist'
    ];
    
    // Add fallbacks for canvas-related dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      'canvas-prebuilt': false,
      pixman: false,
      'pixman-1': false,
      'pango-1.0': false,
      'cairo': false,
      'jsdom': false,
      'pdfjs-dist': false
    };
    
    // Add MiniCssExtractPlugin
    config.plugins.push(new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[id].[contenthash].css',
    }));

    // Important: return the modified config
    return config;
  },
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
