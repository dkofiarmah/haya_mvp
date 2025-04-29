// A simple test script to verify that critters is properly installed and can be required
try {
  const critters = require('critters');
  console.log("Critters module loaded successfully:", typeof critters);
  process.exit(0);
} catch (error) {
  console.error("Error loading critters module:", error.message);
  process.exit(1);
}
