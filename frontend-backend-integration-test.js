// Frontend Integration Test Script
// Run this in the browser console on http://localhost:3002

console.log('🚀 Starting MyLugha Frontend-Backend Integration Test');

// Test configuration
const API_BASE = 'http://localhost:8080/api';
const testUsername = `testuser_${Date.now()}`;
const testEmail = `test_${Date.now()}@example.com`;
const testPassword = 'testpass123';

// Utility function for logging
function logTest(message, type = 'info') {
    const styles = {
        success: 'color: #22c55e; font-weight: bold;',
        error: 'color: #ef4444; font-weight: bold;',
        info: 'color: #3b82f6;',
        warning: 'color: #f59e0b;'
    };
    console.log(`%c${message}`, styles[type] || styles.info);
}

// Test 1: API Connectivity
async function testAPIConnectivity() {
    logTest('🔌 Testing API Connectivity...', 'info');
    try {
        const response = await fetch(`${API_BASE}/`);
        const data = await response.json();
        
        if (response.ok) {
            logTest('✅ API Connectivity: SUCCESS', 'success');
            logTest(`📋 Available endpoints: ${Object.keys(data.endpoints).join(', ')}`);
            return true;
        } else {
            logTest(`❌ API Connectivity: FAILED (${response.status})`, 'error');
            return false;
        }
    } catch (error) {
        logTest(`❌ API Connectivity: ERROR - ${error.message}`, 'error');
        return false;
    }
}

// Test 2: CORS Configuration
async function testCORS() {
    logTest('🌐 Testing CORS Configuration...', 'info');
    try {
        const response = await fetch(`${API_BASE}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            logTest('✅ CORS: SUCCESS - Frontend can communicate with backend', 'success');
            
            // Check CORS headers
            const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
            if (corsOrigin) {
                logTest(`🔧 CORS Allow Origin: ${corsOrigin}`);
            }
            return true;
        } else {
            logTest(`❌ CORS: FAILED (${response.status})`, 'error');
            return false;
        }
    } catch (error) {
        logTest(`❌ CORS: ERROR - ${error.message}`, 'error');
        return false;
    }
}

// Test 3: User Registration
async function testRegistration() {
    logTest('👤 Testing User Registration...', 'info');
    try {
        const userData = {
            username: testUsername,
            email: testEmail,
            password: testPassword
        };
        
        const response = await fetch(`${API_BASE}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            logTest('✅ User Registration: SUCCESS', 'success');
            logTest(`📧 Created user: ${testUsername} (${testEmail})`);
            return { success: true, user: userData };
        } else {
            logTest(`❌ User Registration: FAILED (${response.status})`, 'error');
            logTest(`📋 Error details: ${JSON.stringify(data)}`);
            return { success: false, error: data };
        }
    } catch (error) {
        logTest(`❌ User Registration: ERROR - ${error.message}`, 'error');
        return { success: false, error: error.message };
    }
}

// Test 4: User Login
async function testLogin(userData) {
    logTest('🔐 Testing User Login...', 'info');
    try {
        const loginData = {
            username: userData.username,
            password: userData.password
        };
        
        const response = await fetch(`${API_BASE}/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.access) {
            logTest('✅ User Login: SUCCESS', 'success');
            logTest(`🔑 Access token received (length: ${data.access.length})`);
            logTest(`🔄 Refresh token received (length: ${data.refresh.length})`);
            return { success: true, tokens: data };
        } else {
            logTest(`❌ User Login: FAILED (${response.status})`, 'error');
            logTest(`📋 Error details: ${JSON.stringify(data)}`);
            return { success: false, error: data };
        }
    } catch (error) {
        logTest(`❌ User Login: ERROR - ${error.message}`, 'error');
        return { success: false, error: error.message };
    }
}

// Test 5: Authenticated Request
async function testAuthenticatedRequest(tokens) {
    logTest('🛡️ Testing Authenticated Request...', 'info');
    try {
        const response = await fetch(`${API_BASE}/auth/user/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokens.access}`,
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            logTest('✅ Authenticated Request: SUCCESS', 'success');
            logTest(`👤 User profile: ${data.username} (${data.email})`);
            return { success: true, profile: data };
        } else {
            logTest(`❌ Authenticated Request: FAILED (${response.status})`, 'error');
            logTest(`📋 Error details: ${JSON.stringify(data)}`);
            return { success: false, error: data };
        }
    } catch (error) {
        logTest(`❌ Authenticated Request: ERROR - ${error.message}`, 'error');
        return { success: false, error: error.message };
    }
}

// Test 6: Languages Endpoint
async function testLanguagesEndpoint() {
    logTest('🌍 Testing Languages Endpoint...', 'info');
    try {
        const response = await fetch(`${API_BASE}/languages/`);
        const data = await response.json();
        
        if (response.ok) {
            logTest('✅ Languages Endpoint: SUCCESS', 'success');
            logTest(`📚 Found ${data.length} languages available`);
            if (data.length > 0) {
                logTest(`📝 Sample language: ${data[0].name || 'Name not available'}`);
            }
            return { success: true, languages: data };
        } else {
            logTest(`❌ Languages Endpoint: FAILED (${response.status})`, 'error');
            return { success: false, error: data };
        }
    } catch (error) {
        logTest(`❌ Languages Endpoint: ERROR - ${error.message}`, 'error');
        return { success: false, error: error.message };
    }
}

// Test 7: Frontend API Service Pattern
async function testAPIServicePattern() {
    logTest('🔧 Testing Frontend API Service Pattern...', 'info');
    
    // Simulate the pattern used in the actual frontend API service
    const apiConfig = {
        baseURL: API_BASE,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    try {
        // Test the pattern that the React app uses
        const response = await fetch(`${apiConfig.baseURL}/`, {
            method: 'GET',
            headers: apiConfig.headers
        });
        
        if (response.ok) {
            logTest('✅ API Service Pattern: SUCCESS', 'success');
            logTest('🔗 Frontend can use the same pattern as the actual API service');
            return { success: true };
        } else {
            logTest(`❌ API Service Pattern: FAILED`, 'error');
            return { success: false };
        }
    } catch (error) {
        logTest(`❌ API Service Pattern: ERROR - ${error.message}`, 'error');
        return { success: false, error: error.message };
    }
}

// Main test runner
async function runIntegrationTests() {
    logTest('🚀 MyLugha Frontend-Backend Integration Test Suite', 'info');
    logTest(`📍 Frontend Origin: ${window.location.origin}`);
    logTest(`📍 Backend API: ${API_BASE}`);
    logTest('═'.repeat(60));
    
    const results = {};
    
    // Run all tests in sequence
    results.connectivity = await testAPIConnectivity();
    results.cors = await testCORS();
    results.languages = await testLanguagesEndpoint();
    results.apiPattern = await testAPIServicePattern();
    
    // Authentication flow tests
    if (results.connectivity && results.cors) {
        const regResult = await testRegistration();
        results.registration = regResult.success;
        
        if (regResult.success) {
            const loginResult = await testLogin(regResult.user);
            results.login = loginResult.success;
            
            if (loginResult.success) {
                const authResult = await testAuthenticatedRequest(loginResult.tokens);
                results.authenticated = authResult.success;
            }
        }
    }
    
    // Summary
    logTest('═'.repeat(60));
    logTest('📊 INTEGRATION TEST RESULTS:', 'info');
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const style = passed ? 'success' : 'error';
        logTest(`${status} ${test.toUpperCase()}`, style);
    });
    
    logTest('═'.repeat(60));
    logTest(`🎯 OVERALL RESULT: ${passedTests}/${totalTests} tests passed`, 
            passedTests === totalTests ? 'success' : 'warning');
    
    if (passedTests === totalTests) {
        logTest('🎉 EXCELLENT! Frontend-Backend integration is working perfectly!', 'success');
    } else {
        logTest('⚠️ Some integration issues detected. Check failed tests above.', 'warning');
    }
    
    return results;
}

// Export for manual testing
window.MyLughaIntegrationTest = {
    runAll: runIntegrationTests,
    testConnectivity: testAPIConnectivity,
    testCORS: testCORS,
    testRegistration: testRegistration,
    testLogin: testLogin,
    testAuthRequest: testAuthenticatedRequest,
    testLanguages: testLanguagesEndpoint,
    testAPIPattern: testAPIServicePattern
};

// Auto-run the tests
runIntegrationTests().then(results => {
    console.log('Integration test completed. Results available in window.MyLughaIntegrationTest');
});
