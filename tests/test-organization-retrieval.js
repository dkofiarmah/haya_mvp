// This is a simple test script for the browser console
// to verify our organization retrieval logic works correctly

async function testOrganizationRetrieval() {
  console.log('=== TESTING ORGANIZATION RETRIEVAL LOGIC ===');

  // Clear any existing test data
  localStorage.removeItem('test_newUserInfo');
  localStorage.removeItem('test_newOrgInfo');

  // Set up test data
  const testOrgId = '123e4567-e89b-12d3-a456-426614174000';
  
  // Create both formats to test priority and fallbacks
  localStorage.setItem('test_newUserInfo', JSON.stringify({
    fullName: 'Test User',
    companyName: 'Test Company',
    email: 'test@example.com',
    registeredAt: new Date().toISOString(),
    organizationId: testOrgId
  }));
  
  localStorage.setItem('test_newOrgInfo', JSON.stringify({
    id: '987654321-alternative-id',
    name: 'Alternative Name'
  }));
  
  console.log('Test data has been set up in localStorage');
  console.log('- test_newUserInfo with organizationId:', testOrgId);
  console.log('- test_newOrgInfo with id: 987654321-alternative-id');
  
  // Mock function that reproduces our retrieval logic
  function getExistingOrganizationFromStorage() {
    // First priority: newUserInfo (from signup)
    try {
      const newUserInfo = localStorage.getItem('test_newUserInfo');
      if (newUserInfo) {
        const userData = JSON.parse(newUserInfo);
        if (userData && userData.organizationId) {
          console.log("✅ SUCCESS: Found organization ID from newUserInfo:", userData.organizationId);
          return userData.organizationId;
        }
      }
    } catch (error) {
      console.warn("Error reading organization from newUserInfo:", error);
    }
    
    // Second priority: newOrgInfo (old format)
    try {
      const newOrgInfo = localStorage.getItem('test_newOrgInfo');
      if (newOrgInfo) {
        const orgData = JSON.parse(newOrgInfo);
        if (orgData && orgData.id) {
          console.log("Found organization ID from newOrgInfo:", orgData.id);
          return orgData.id;
        }
      }
    } catch (error) {
      console.warn("Error reading organization from newOrgInfo:", error);
    }
    
    console.log("❌ FAILED: No organization ID found in either storage location");
    return null;
  }
  
  // Run the test
  const result = getExistingOrganizationFromStorage();
  console.log('Test result:', result);
  
  // Make sure we got the right organization ID (from newUserInfo which has higher priority)
  if (result === testOrgId) {
    console.log('✅ TEST PASSED: Retrieved the correct organization ID from newUserInfo');
  } else {
    console.log('❌ TEST FAILED: Did not retrieve the correct organization ID');
  }
  
  // Clean up test data
  localStorage.removeItem('test_newUserInfo');
  localStorage.removeItem('test_newOrgInfo');
}

// Execute the test
testOrganizationRetrieval();
