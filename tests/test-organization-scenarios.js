// This is an enhanced test script that tests multiple scenarios
// to verify our organization retrieval logic works correctly in all cases

async function testAllScenarios() {
  console.log('=== TESTING ORGANIZATION RETRIEVAL SCENARIOS ===');
  
  // Clean up any existing test data
  localStorage.removeItem('test_newUserInfo');
  localStorage.removeItem('test_newOrgInfo');
  
  // Define test scenarios
  const scenarios = [
    {
      name: "Scenario 1: Only newUserInfo available",
      setup: () => {
        localStorage.setItem('test_newUserInfo', JSON.stringify({
          fullName: 'Test User',
          companyName: 'Test Company',
          email: 'test@example.com',
          organizationId: "user-info-org-id"
        }));
        localStorage.removeItem('test_newOrgInfo');
      },
      expectedId: "user-info-org-id"
    },
    {
      name: "Scenario 2: Only newOrgInfo available",
      setup: () => {
        localStorage.removeItem('test_newUserInfo');
        localStorage.setItem('test_newOrgInfo', JSON.stringify({
          id: "org-info-id",
          name: "Test Organization"
        }));
      },
      expectedId: "org-info-id"
    },
    {
      name: "Scenario 3: Both formats available (newUserInfo should take priority)",
      setup: () => {
        localStorage.setItem('test_newUserInfo', JSON.stringify({
          fullName: 'Test User',
          companyName: 'Test Company',
          email: 'test@example.com',
          organizationId: "user-info-priority-id"
        }));
        localStorage.setItem('test_newOrgInfo', JSON.stringify({
          id: "org-info-id-ignored",
          name: "Test Organization"
        }));
      },
      expectedId: "user-info-priority-id"
    },
    {
      name: "Scenario 4: No storage data available",
      setup: () => {
        localStorage.removeItem('test_newUserInfo');
        localStorage.removeItem('test_newOrgInfo');
      },
      expectedId: null
    },
    {
      name: "Scenario 5: Invalid data in localStorage",
      setup: () => {
        localStorage.setItem('test_newUserInfo', 'not-json-data');
        localStorage.setItem('test_newOrgInfo', '{invalid json}');
      },
      expectedId: null
    }
  ];
  
  // Function to test
  function getExistingOrganizationFromStorage() {
    // First priority: newUserInfo (from signup)
    try {
      const newUserInfo = localStorage.getItem('test_newUserInfo');
      if (newUserInfo) {
        const userData = JSON.parse(newUserInfo);
        if (userData && userData.organizationId) {
          console.log("Found organization ID from newUserInfo:", userData.organizationId);
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
    
    console.log("No organization ID found in storage");
    return null;
  }
  
  // Run all scenarios
  let passedTests = 0;
  let totalTests = scenarios.length;
  
  for (const scenario of scenarios) {
    console.log(`\nRunning: ${scenario.name}`);
    
    // Setup the scenario
    scenario.setup();
    console.log("Scenario setup complete");
    
    // Run the test
    const result = getExistingOrganizationFromStorage();
    
    // Check result
    if (
      (result === scenario.expectedId) || 
      (result === null && scenario.expectedId === null)
    ) {
      console.log(`✅ PASSED: Got expected result: ${result}`);
      passedTests++;
    } else {
      console.log(`❌ FAILED: Expected ${scenario.expectedId}, got ${result}`);
    }
    
    // Clean up
    localStorage.removeItem('test_newUserInfo');
    localStorage.removeItem('test_newOrgInfo');
  }
  
  // Final summary
  console.log(`\n=== TEST SUMMARY ===`);
  console.log(`${passedTests} of ${totalTests} scenarios passed`);
  if (passedTests === totalTests) {
    console.log(`✅ ALL TESTS PASSED!`);
    return true;
  } else {
    console.log(`❌ SOME TESTS FAILED`);
    return false;
  }
}

// Return the test function
async function runAllTests() {
  return testAllScenarios();
}
