/**
 * This file contains workarounds for module resolution issues in the Vercel environment
 * It exports patched versions of problematic dependencies
 */

// Provide a fallback for the critters module
export const crittersWorkaround = () => {
  try {
    // Try to load the critters module
    const critters = require('critters');
    return critters;
  } catch (error) {
    // Return a mock implementation if the real module can't be loaded
    console.warn('WARNING: Could not load critters module, using mock implementation');
    return {
      process: async (html) => html,
      // Add other methods as needed
    };
  }
};

// Other workarounds can be added here as needed
