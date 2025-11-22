// Simple test script to verify backend integration
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testIntegration() {
    console.log('🧪 Testing Backend Integration...\n');

    try {
        // Test 1: Server Health Check
        console.log('1️⃣ Testing server health...');
        const healthCheck = await axios.get('http://localhost:5000');
        console.log('✅ Server is running:', healthCheck.data);
        console.log('');

        // Test 2: Signup
        console.log('2️⃣ Testing user signup...');
        const signupData = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'User'
        };
        
        const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, signupData);
        console.log('✅ Signup successful');
        console.log('User:', signupResponse.data.name);
        console.log('Token received:', signupResponse.data.token ? 'Yes' : 'No');
        console.log('');

        const token = signupResponse.data.token;
        const userEmail = signupResponse.data.email;

        // Test 3: Login
        console.log('3️⃣ Testing user login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: userEmail,
            password: 'password123'
        });
        console.log('✅ Login successful');
        console.log('User:', loginResponse.data.name);
        console.log('Role:', loginResponse.data.role);
        console.log('');

        // Test 4: Get User Info (Protected Route)
        console.log('4️⃣ Testing protected route (Get Me)...');
        const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('✅ Protected route accessible');
        console.log('User data:', meResponse.data.name, '-', meResponse.data.email);
        console.log('');

        // Test 5: Dashboard Stats (Protected Route)
        console.log('5️⃣ Testing dashboard stats...');
        const statsResponse = await axios.get(`${BASE_URL}/dashboard/stats`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('✅ Dashboard stats retrieved');
        console.log('Total Products:', statsResponse.data.totalProducts);
        console.log('Low Stock Count:', statsResponse.data.lowStockCount);
        console.log('Pending Receipts:', statsResponse.data.pendingReceipts);
        console.log('Pending Deliveries:', statsResponse.data.pendingDeliveries);
        console.log('');

        // Test 6: Forgot Password
        console.log('6️⃣ Testing forgot password...');
        const forgotResponse = await axios.post(`${BASE_URL}/auth/forgot-password`, {
            email: userEmail
        });
        console.log('✅ OTP sent successfully');
        console.log('Message:', forgotResponse.data.message);
        if (forgotResponse.data.otpDebug) {
            console.log('OTP (debug):', forgotResponse.data.otpDebug);
        }
        console.log('');

        console.log('🎉 All tests passed! Backend integration is working correctly.\n');
        console.log('You can now start the frontend and test the full application.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data?.message || error.message);
        console.error('');
        
        if (error.code === 'ECONNREFUSED') {
            console.error('⚠️  Backend server is not running!');
            console.error('Please start the backend server first:');
            console.error('   cd backend && npm start');
        }
    }
}

// Run tests
testIntegration();
