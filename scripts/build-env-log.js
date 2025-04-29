// This file is used to log the build environment during Vercel deployment
// It helps troubleshoot deployment issues

module.exports = async function() {
  console.log('🛠️ Build environment information:');
  
  // Log Node.js version
  console.log(`Node.js version: ${process.version}`);
  
  // Log environment variables (except secrets)
  console.log('Environment variables:');
  Object.keys(process.env)
    .filter(key => 
      !key.includes('SECRET') && 
      !key.includes('KEY') && 
      !key.includes('TOKEN') && 
      !key.includes('PASSWORD')
    )
    .forEach(key => {
      console.log(`  ${key}: ${process.env[key]}`);
    });
  
  // Check for critical modules
  console.log('Checking critical modules:');
  try {
    const critters = require('critters');
    console.log('  ✅ critters module found');
  } catch (error) {
    console.log(`  ❌ critters module not found: ${error.message}`);
  }
  
  try {
    const punycode = require('punycode.js');
    console.log('  ✅ punycode.js module found');
  } catch (error) {
    console.log(`  ❌ punycode.js module not found: ${error.message}`);
  }
  
  // Log Next.js config
  try {
    const fs = require('fs');
    if (fs.existsSync('./next.config.js')) {
      console.log('Next.js config exists');
    } else {
      console.log('❌ Next.js config file not found');
    }
  } catch (error) {
    console.log(`Error checking for Next.js config: ${error.message}`);
  }
  
  console.log('Build environment check complete');
};
