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

const seedProducts = async () => {
    try {
        console.log('📦 Seeding Products...');

        // Clear existing products to avoid duplicates if re-run
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        const products = [
            {
                name: 'Industrial Steel Rod (10mm)',
                sku: 'STL-10MM',
                category: 'Raw Materials',
                unit: 'kg',
                reorderPoint: 500,
                reorderQty: 2000
            },
            {
                name: 'Oak Wood Plank (2x4)',
                sku: 'WD-OAK-2X4',
                category: 'Raw Materials',
                unit: 'pieces',
                reorderPoint: 100,
                reorderQty: 500
            },
            {
                name: 'Ergonomic Office Chair',
                sku: 'FUR-ERGO-01',
                category: 'Furniture',
                unit: 'pieces',
                reorderPoint: 10,
                reorderQty: 50
            },
            {
                name: 'Standing Desk (Electric)',
                sku: 'FUR-DESK-EL',
                category: 'Furniture',
                unit: 'pieces',
                reorderPoint: 5,
                reorderQty: 20
            },
            {
                name: 'Dell XPS 15 Laptop',
                sku: 'ELEC-XPS15',
                category: 'Electronics',
                unit: 'pieces',
                reorderPoint: 5,
                reorderQty: 15
            },
            {
                name: 'Wireless Mouse (Logitech)',
                sku: 'ELEC-MSE-LOG',
                category: 'Electronics',
                unit: 'pieces',
                reorderPoint: 20,
                reorderQty: 100
            },
            {
                name: 'Mechanical Keyboard',
                sku: 'ELEC-KB-MECH',
                category: 'Electronics',
                unit: 'pieces',
                reorderPoint: 15,
                reorderQty: 50
            },
            {
                name: 'White Interior Paint (5L)',
                sku: 'SUP-PNT-WHT',
                category: 'Supplies',
                unit: 'cans',
                reorderPoint: 20,
                reorderQty: 80
            },
            {
                name: 'Safety Helmet (Yellow)',
                sku: 'SAF-HLM-YEL',
                category: 'Safety Gear',
                unit: 'pieces',
                reorderPoint: 30,
                reorderQty: 100
            },
            {
                name: 'Heavy Duty Gloves',
                sku: 'SAF-GLV-HD',
                category: 'Safety Gear',
                unit: 'pairs',
                reorderPoint: 50,
                reorderQty: 200
            }
        ];

        await Product.insertMany(products);
        console.log(`✅ Successfully created ${products.length} products.`);

    } catch (error) {
        console.error('❌ Error seeding products:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

connectDB().then(() => seedProducts());
