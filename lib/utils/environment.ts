/**
 * Environment Utility Functions
 */

/**
 * Checks if the current environment is development
 */
export const isDevelopmentMode = (): boolean => {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    // Server-side check
    return process.env.NODE_ENV === 'development';
  }
  
  // Client-side check using hostname
  // Additional check that can be used in production builds running locally
  const hostname = window.location.hostname;
  return (
    process.env.NEXT_PUBLIC_ENV === 'development' || 
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('.local')
  );
};

/**
 * Checks if the current environment is production
 */
export const isProductionMode = (): boolean => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production';
  }
  
  return process.env.NEXT_PUBLIC_ENV === 'production';
};

/**
 * Get the current environment
 */
export const getEnvironment = (): 'development' | 'production' | 'test' => {
  if (isDevelopmentMode()) {
    return 'development';
  }
  
  if (process.env.NODE_ENV === 'test') {
    return 'test';
  }
  
  return 'production';
};
