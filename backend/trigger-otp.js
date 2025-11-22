const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
// Get email from command line argument or default to the hardcoded one
const TARGET_EMAIL = process.argv[2] || 'ronitsahoo221@gmail.com';

const triggerOTP = async () => {
    try {
        console.log(`🚀 Triggering OTP for ${TARGET_EMAIL}...`);

        // 1. Try to Signup first (in case user doesn't exist)
        try {
            await axios.post(`${API_URL}/auth/signup`, {
                name: 'Ronit Sahoo',
                email: TARGET_EMAIL,
                password: 'password123'
            });
            console.log('✅ User created successfully.');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('ℹ️  User already exists (skipping signup).');
            } else {
                console.error('❌ Signup Error:', error.message);
            }
        }

        // 2. Request OTP
        console.log('📨 Requesting OTP...');
        const res = await axios.post(`${API_URL}/auth/forgot-password`, {
            email: TARGET_EMAIL
        });

        console.log('✅ OTP Email Sent!');
        console.log(`   OTP Code (Debug): ${res.data.otpDebug}`);
        console.log('👉 Please check your inbox now.');

    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
};

// Wait for server to be ready
setTimeout(triggerOTP, 2000);
