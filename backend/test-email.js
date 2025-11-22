require('dotenv').config();
const sendEmail = require('./src/utils/sendEmail');

const testEmail = async () => {
    console.log('Attempting to send test email to ronitsahoo221@gmail.com...');
    try {
        await sendEmail({
            email: 'ronitsahoo221@gmail.com',
            subject: 'IMS Backend Test Email',
            message: 'Hello! If you are reading this, your IMS backend is successfully connected to Gmail.'
        });
        console.log('✅ Test email sent successfully! Please check your inbox.');
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
    }
};

testEmail();
