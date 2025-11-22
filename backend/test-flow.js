const axios = require('axios');
const mongoose = require('mongoose');

const API_URL = 'http://localhost:5000/api';

const runTest = async () => {
    try {
        console.log('Starting Verification Test...');

        // 1. Signup
        console.log('\n1. Testing Signup...');
        const userRes = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Test Manager',
            email: `manager_${Date.now()}@test.com`,
            password: 'password123'
        });
        const token = userRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        const userEmail = userRes.data.email;
        console.log('✅ Signup Successful');

        // 1.5 Test Forgot Password Flow
        console.log('\n1.5. Testing Forgot Password...');

        // A. Request OTP
        const forgotRes = await axios.post(`${API_URL}/auth/forgot-password`, {
            email: userEmail
        });
        const otp = forgotRes.data.otpDebug;
        console.log('✅ OTP Received:', otp);

        // B. Reset Password
        await axios.post(`${API_URL}/auth/reset-password`, {
            email: userEmail,
            otp: otp,
            newPassword: 'newpassword123'
        });
        console.log('✅ Password Reset Successful');

        // C. Verify Old Password Fails
        try {
            await axios.post(`${API_URL}/auth/login`, {
                email: userEmail,
                password: 'password123'
            });
            throw new Error('Old password should not work');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log('✅ Old Password Rejected');
            } else {
                throw err;
            }
        }

        // D. Verify New Password Works
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: userEmail,
            password: 'newpassword123'
        });
        // Update token for subsequent requests
        const newToken = loginRes.data.token;
        // headers.Authorization = `Bearer ${newToken}`; // Optional if we want to use new token
        console.log('✅ Login with New Password Successful');

        // 2. Create Warehouse
        console.log('\n2. Testing Create Warehouse...');
        const warehouseRes = await axios.post(`${API_URL}/warehouses`, {
            name: 'Main Warehouse',
            code: `WH_${Date.now()}`,
            address: '123 Test St',
            locations: [
                { locationId: 'LOC_A', name: 'Rack A', code: 'A-01' },
                { locationId: 'LOC_B', name: 'Rack B', code: 'B-01' }
            ]
        }, { headers });
        const warehouseId = warehouseRes.data._id;
        console.log('✅ Warehouse Created:', warehouseId);

        // 3. Create Product
        console.log('\n3. Testing Create Product...');
        const productRes = await axios.post(`${API_URL}/products`, {
            name: 'Test Widget',
            sku: `WIDGET_${Date.now()}`,
            category: 'Electronics',
            unit: 'pcs',
            reorderPoint: 10,
            reorderQty: 50
        }, { headers });
        const productId = productRes.data._id;
        console.log('✅ Product Created:', productId);

        // 3.5 Create Partners
        console.log('\n3.5. Testing Create Partners...');
        const supplierRes = await axios.post(`${API_URL}/partners`, {
            type: 'Supplier',
            name: 'Acme Steel Co.',
            contact: 'contact@acmesteel.com',
            code: `SUP_${Date.now()}`
        }, { headers });
        console.log('✅ Supplier Created:', supplierRes.data._id);

        const customerRes = await axios.post(`${API_URL}/partners`, {
            type: 'Customer',
            name: 'BuildIt Construction',
            contact: 'orders@buildit.com',
            code: `CUS_${Date.now()}`
        }, { headers });
        console.log('✅ Customer Created:', customerRes.data._id);

        // 4. Create Receipt Transaction (Draft)
        console.log('\n4. Testing Create Receipt (Draft)...');
        const receiptRes = await axios.post(`${API_URL}/transactions`, {
            refNo: `REC_${Date.now()}`,
            type: 'Receipt',
            warehouseId: warehouseId,
            lines: [
                { productId: productId, qty: 100, locationTo: 'LOC_A', unitCost: 10 }
            ]
        }, { headers });
        const receiptId = receiptRes.data._id;
        console.log('✅ Receipt Created:', receiptId);

        // 5. Finalize Receipt
        console.log('\n5. Testing Finalize Receipt...');
        await axios.post(`${API_URL}/transactions/${receiptId}/finalize`, {}, { headers });
        console.log('✅ Receipt Finalized');

        // 6. Verify Stock Increase
        console.log('\n6. Verifying Stock Level...');
        // We don't have a direct stock API yet, but we can check dashboard or infer from delivery
        // Let's try to create a delivery for 50 items

        // 7. Create Delivery Transaction
        console.log('\n7. Testing Create Delivery...');
        const deliveryRes = await axios.post(`${API_URL}/transactions`, {
            refNo: `DEL_${Date.now()}`,
            type: 'Delivery',
            warehouseId: warehouseId,
            lines: [
                { productId: productId, qty: 50, locationFrom: 'LOC_A' }
            ]
        }, { headers });
        const deliveryId = deliveryRes.data._id;
        console.log('✅ Delivery Created:', deliveryId);

        // 8. Finalize Delivery
        console.log('\n8. Testing Finalize Delivery...');
        await axios.post(`${API_URL}/transactions/${deliveryId}/finalize`, {}, { headers });
        console.log('✅ Delivery Finalized');

        // 9. Check Dashboard Stats
        console.log('\n9. Checking Dashboard Stats...');
        const statsRes = await axios.get(`${API_URL}/dashboard/stats`, { headers });
        console.log('✅ Dashboard Stats:', statsRes.data);

        console.log('\n🎉 All Tests Passed!');

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    }
};

// Wait for server to start (manual delay or just run after server is up)
setTimeout(runTest, 2000);
