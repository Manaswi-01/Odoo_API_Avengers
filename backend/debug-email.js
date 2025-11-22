require('dotenv').config();
const nodemailer = require('nodemailer');

const debugEmail = async () => {
    console.log('🔍 Starting Email Debug...');
    console.log(`   User: ${process.env.EMAIL_USER}`);
    console.log(`   Pass Length: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0}`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        debug: true, // Enable debug output
        logger: true // Log information to console
    });

    const message = {
        from: process.env.EMAIL_USER, // Try sending from self to self to avoid spoofing checks
        to: process.env.EMAIL_USER,   // Send to self
        subject: 'IMS Debug Email',
        text: 'This is a debug email to verify credentials and delivery.'
    };

    try {
        console.log('📨 Attempting to send...');
        const info = await transporter.sendMail(message);
        console.log('✅ Message sent: %s', info.messageId);
        console.log('   Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error(error);
    }
};

debugEmail();
