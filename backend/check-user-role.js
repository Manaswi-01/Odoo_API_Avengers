require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const checkUserRole = async () => {
    try {
        const users = await User.find({});
        console.log('Found users:', users.length);
        users.forEach(u => {
            console.log(`User: ${u.name}, Email: ${u.email}, Role: '${u.role}'`);
        });
    } catch (error) {
        console.error('❌ Error checking users:', error);
    } finally {
        await mongoose.connection.close();
    }
};

connectDB().then(() => checkUserRole());
