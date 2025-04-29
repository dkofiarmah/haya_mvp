// Simple script to verify that required modules are installed
try {
  const uuid = require('uuid');
  console.log("UUID module is available:", uuid.v4());
  console.log("All required modules are installed and working correctly.");
  process.exit(0);
} catch (error) {
  console.error("Error importing required modules:", error.message);
  process.exit(1);
}
