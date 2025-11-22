require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const checkProducts = async () => {
    try {
        const count = await Product.countDocuments();
        console.log(`Total Products: ${count}`);
        if (count > 0) {
            const products = await Product.find().limit(5);
            console.log('Sample Products:', products.map(p => ({ name: p.name, sku: p.sku })));
        } else {
            console.log('⚠️ No products found in database.');
        }
    } catch (error) {
        console.error('❌ Error checking products:', error);
    } finally {
        await mongoose.connection.close();
    }
};

connectDB().then(() => checkProducts());
