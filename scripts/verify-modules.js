/**
 * This script verifies that critical modules are installed correctly.
 * It's used during the build process to ensure all required dependencies are available.
 */
try {
  // Test for critters module
  const critters = require('critters');
  console.log('✅ Critters module found:', typeof critters);
  
  // Test for punycode module
  const punycode = require('punycode.js');
  console.log('✅ Punycode.js module found:', typeof punycode);
  
  // Additional critical modules can be tested here
  const path = require('path');
  console.log('✅ Path module found');
  
  // Exit successfully
  process.exit(0);
} catch (error) {
  console.error('❌ Module verification failed:', error.message);
  console.error('Stack trace:', error.stack);
  
  // Check for specific modules
  try {
    require('critters');
  } catch (e) {
    console.error('❌ Critters module is missing or corrupted. Try running: npm install critters@0.0.20');
  }
  
  try {
    require('punycode.js');
  } catch (e) {
    console.error('❌ Punycode.js module is missing or corrupted. Try running: npm install punycode.js');
  }
  
  // Exit with error code
  process.exit(1);
}
