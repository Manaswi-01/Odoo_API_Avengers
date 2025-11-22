const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const REAL_EMAIL_BASE = 'ronitsahoo221'; // User's email username
const REAL_EMAIL_DOMAIN = 'gmail.com';

const runTest = async () => {
    try {
        console.log('🚀 Starting Final System Verification...');
        console.log('----------------------------------------');

        // Generate a unique alias for this test run to avoid "User already exists"
        const timestamp = Date.now();
        const testEmail = `${REAL_EMAIL_BASE}+ims${timestamp}@${REAL_EMAIL_DOMAIN}`;

        console.log(`📧 Using Test Email: ${testEmail}`);
        console.log('   (Emails will be delivered to your main inbox)');

        // 1. Signup
        console.log('\n1️⃣  Testing Signup...');
        const userRes = await axios.post(`${API_URL}/auth/signup`, {
            name: 'System Verifier',
            email: testEmail,
            password: 'password123'
        });
        const token = userRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('✅ Signup Successful');

        // 2. Test Forgot Password (OTP Email)
        console.log('\n2️⃣  Testing Forgot Password & OTP Email...');
        console.log('   Requesting OTP...');
        const forgotRes = await axios.post(`${API_URL}/auth/forgot-password`, {
            email: testEmail
        });

        // In our controller, we return otpDebug for easier testing, but we also sent the email.
        const otp = forgotRes.data.otpDebug;
        console.log('✅ OTP Request Successful');
        console.log(`📨 EMAIL SENT! Please check ${REAL_EMAIL_BASE}@${REAL_EMAIL_DOMAIN} for the OTP.`);
        console.log(`   (Debug OTP received from API: ${otp})`);

        // 3. Reset Password
        console.log('\n3️⃣  Testing Password Reset...');
        await axios.post(`${API_URL}/auth/reset-password`, {
            email: testEmail,
            otp: otp,
            newPassword: 'newpassword456'
        });
        console.log('✅ Password Reset Successful');

        // 4. Login with New Password
        console.log('\n4️⃣  Verifying Login with New Password...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testEmail,
            password: 'newpassword456'
        });
        const newToken = loginRes.data.token;
        const newHeaders = { Authorization: `Bearer ${newToken}` };
        console.log('✅ Login Successful');

        // 5. Create Warehouse
        console.log('\n5️⃣  Testing Data Storage: Warehouse...');
        const warehouseRes = await axios.post(`${API_URL}/warehouses`, {
            name: 'Final Test Warehouse',
            code: `WH_FINAL_${timestamp}`,
            address: '123 Verification Lane',
            locations: [
                { locationId: 'LOC_1', name: 'Shelf 1', code: 'S1' },
                { locationId: 'LOC_2', name: 'Shelf 2', code: 'S2' }
            ]
        }, { headers: newHeaders });
        const warehouseId = warehouseRes.data._id;
        console.log('✅ Warehouse Created & Stored');

        // 6. Create Product
        console.log('\n6️⃣  Testing Data Storage: Product...');
        const productRes = await axios.post(`${API_URL}/products`, {
            name: 'Verification Gadget',
            sku: `VERIFY_${timestamp}`,
            category: 'Test',
            unit: 'units',
            reorderPoint: 5,
            reorderQty: 20
        }, { headers: newHeaders });
        const productId = productRes.data._id;
        console.log('✅ Product Created & Stored');

        // 7. Create Partner
        console.log('\n7️⃣  Testing Data Storage: Partner...');
        const partnerRes = await axios.post(`${API_URL}/partners`, {
            type: 'Supplier',
            name: 'Test Supplier Inc.',
            contact: 'supplier@test.com',
            code: `SUP_${timestamp}`
        }, { headers: newHeaders });
        console.log('✅ Partner Created & Stored');

        // 8. Transaction Flow (Receipt)
        console.log('\n8️⃣  Testing Transaction Flow (Receipt)...');
        const receiptRes = await axios.post(`${API_URL}/transactions`, {
            refNo: `REC_FINAL_${timestamp}`,
            type: 'Receipt',
            warehouseId: warehouseId,
            lines: [
                { productId: productId, qty: 100, locationTo: 'LOC_1', unitCost: 50 }
            ]
        }, { headers: newHeaders });
        const receiptId = receiptRes.data._id;

        await axios.post(`${API_URL}/transactions/${receiptId}/finalize`, {}, { headers: newHeaders });
        console.log('✅ Receipt Finalized (Stock should be +100)');

        // 9. Verify Dashboard (Data Persistence Check)
        console.log('\n9️⃣  Verifying Data Persistence via Dashboard...');
        const statsRes = await axios.get(`${API_URL}/dashboard/stats`, { headers: newHeaders });
        console.log('   Dashboard Stats:', statsRes.data);

        if (statsRes.data.totalProducts >= 1) {
            console.log('✅ Data Persistence Verified: Products found in dashboard.');
        } else {
            console.warn('⚠️  Warning: Product count seems low.');
        }

        console.log('\n🎉 FINAL VERIFICATION COMPLETE!');
        console.log('----------------------------------------');
        console.log('Please confirm you received the OTP email in your inbox.');

    } catch (error) {
        console.error('❌ Verification Failed:', error.response ? error.response.data : error.message);
    }
};

// Wait a moment for server to be ready if run immediately
setTimeout(runTest, 1000);
