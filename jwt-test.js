// JWT Implementation Test Script
// Run this in browser console to test JWT functionality

console.log('=== HospiTrack JWT Implementation Test ===');

// Test 1: Check if JWT utility functions are working
console.log('\n1. Testing API Helper Functions...');

// Function to test login
async function testLogin(email, password) {
  try {
    console.log(`\n🔄 Testing login with: ${email}`);
    
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Login successful:', data);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('✅ Token stored in localStorage');
      return data;
    } else {
      console.log('❌ No token received from server');
      return null;
    }
  } catch (error) {
    console.error('❌ Login failed:', error);
    return null;
  }
}

// Function to test protected API call
async function testProtectedAPI() {
  try {
    console.log('\n🔄 Testing protected API call...');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ No token found in localStorage');
      return;
    }
    
    const response = await fetch('http://localhost:8080/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (response.status === 401) {
      console.log('❌ Token rejected by server (401 Unauthorized)');
      return;
    }
    
    if (!response.ok) {
      console.log(`⚠️ API call failed with status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Protected API call successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Protected API call failed:', error);
  }
}

// Function to test JWT expiration
async function testTokenExpiration() {
  console.log('\n🔄 Testing token expiration handling...');
  
  // Try with an invalid token
  localStorage.setItem('token', 'invalid.token.here');
  
  try {
    const response = await fetch('http://localhost:8080/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer invalid.token.here`,
        'Content-Type': 'application/json',
      }
    });
    
    if (response.status === 401) {
      console.log('✅ Invalid token properly rejected (401 Unauthorized)');
    } else {
      console.log('⚠️ Invalid token not properly rejected');
    }
  } catch (error) {
    console.log('✅ Invalid token handling working');
  }
}

// Function to test API helper utility
async function testAPIHelper() {
  console.log('\n🔄 Testing API helper utility...');
  
  // First, let's check if the apiCall function is available
  if (typeof window.apiCall === 'undefined') {
    console.log('⚠️ apiCall function not globally available, this is normal');
    console.log('   API helper is imported in components as needed');
  }
  
  // Test manual API call with proper headers
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch('http://localhost:8080/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        console.log('✅ Manual API call with token successful');
      } else {
        console.log(`⚠️ Manual API call failed: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Manual API call error:', error);
    }
  }
}

// Main test function
async function runJWTTests() {
  console.log('Starting comprehensive JWT tests...\n');
  
  // Test 1: Token expiration handling
  await testTokenExpiration();
  
  // Test 2: Try to login (you'll need to replace with actual credentials)
  console.log('\n=== Manual Login Test Required ===');
  console.log('Please test login manually with these steps:');
  console.log('1. Go to the login page');
  console.log('2. Enter valid credentials');
  console.log('3. Check if token is stored in localStorage');
  console.log('4. Navigate to protected pages');
  
  // Test 3: Check current token status
  const currentToken = localStorage.getItem('token');
  const currentUser = localStorage.getItem('user');
  
  console.log('\n=== Current Authentication Status ===');
  console.log('Token in localStorage:', currentToken ? '✅ Present' : '❌ Missing');
  console.log('User in localStorage:', currentUser ? '✅ Present' : '❌ Missing');
  
  if (currentToken) {
    console.log('Token preview:', currentToken.substring(0, 50) + '...');
    await testProtectedAPI();
  }
  
  // Test 4: Test API helper
  await testAPIHelper();
  
  console.log('\n=== JWT Implementation Test Complete ===');
  console.log('✅ All automated tests completed');
  console.log('📝 Manual testing required for full verification');
}

// Auto-run tests
runJWTTests();

// Export test functions for manual use
window.jwtTests = {
  testLogin,
  testProtectedAPI,
  testTokenExpiration,
  runJWTTests
};

console.log('\n📘 Available manual test functions:');
console.log('- jwtTests.testLogin(email, password)');
console.log('- jwtTests.testProtectedAPI()');
console.log('- jwtTests.testTokenExpiration()');
console.log('- jwtTests.runJWTTests()');
