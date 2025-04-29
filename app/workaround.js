/**
 * This file contains workarounds for module resolution issues in the Vercel environment
 * It exports patched versions of problematic dependencies
 */

// Provide a fallback for the critters module
// ES Module version (no require statements)
const crittersWorkaround = {
  process: async (html) => html,
  // Add other methods as needed
};

// Default export for ES modules
export default crittersWorkaround;

// Named exports
export { crittersWorkaround };

// Other workarounds can be added here as needed
