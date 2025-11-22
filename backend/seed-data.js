// Seed script to populate database with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Warehouse = require('./src/models/Warehouse');
const Transaction = require('./src/models/Transaction');
const StockItem = require('./src/models/StockItem');
const StockLedger = require('./src/models/StockLedger');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Product.deleteMany({});
        await Warehouse.deleteMany({});
        await Transaction.deleteMany({});
        await StockItem.deleteMany({});
        await StockLedger.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create sample user if doesn't exist
        let user = await User.findOne({ email: 'admin@stockmaster.com' });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            user = await User.create({
                name: 'Admin User',
                email: 'admin@stockmaster.com',
                passwordHash: hashedPassword,
                role: 'Admin'
            });
            console.log('✅ Admin user created (email: admin@stockmaster.com, password: admin123)\n');
        }

        // Create Products
        console.log('📦 Creating products...');
        const products = await Product.insertMany([
            {
                name: 'Steel Rods',
                sku: 'STL-001',
                category: 'Raw Materials',
                unit: 'kg',
                reorderPoint: 100,
                reorderQty: 500
            },
            {
                name: 'Wooden Planks',
                sku: 'WD-001',
                category: 'Raw Materials',
                unit: 'pieces',
                reorderPoint: 50,
                reorderQty: 200
            },
            {
                name: 'Office Chair',
                sku: 'FUR-001',
                category: 'Furniture',
                unit: 'pieces',
                reorderPoint: 10,
                reorderQty: 50
            },
            {
                name: 'Laptop Dell XPS',
                sku: 'ELEC-001',
                category: 'Electronics',
                unit: 'pieces',
                reorderPoint: 5,
                reorderQty: 20
            },
            {
                name: 'Paint - White',
                sku: 'PNT-001',
                category: 'Supplies',
                unit: 'liters',
                reorderPoint: 20,
                reorderQty: 100
            },
            {
                name: 'Screws Set',
                sku: 'HW-001',
                category: 'Hardware',
                unit: 'boxes',
                reorderPoint: 30,
                reorderQty: 150
            }
        ]);
        console.log(`✅ Created ${products.length} products\n`);

        // Create Warehouses with Locations
        console.log('🏭 Creating warehouses...');
        const warehouses = await Warehouse.insertMany([
            {
                name: 'Main Warehouse',
                code: 'WH-MAIN',
                address: '123 Industrial Ave, City Center',
                locations: [
                    { locationId: 'LOC-A1', name: 'Rack A1', code: 'A1' },
                    { locationId: 'LOC-A2', name: 'Rack A2', code: 'A2' },
                    { locationId: 'LOC-B1', name: 'Rack B1', code: 'B1' },
                    { locationId: 'LOC-RECV', name: 'Receiving Area', code: 'RECV' }
                ]
            },
            {
                name: 'Secondary Warehouse',
                code: 'WH-SEC',
                address: '456 Storage Blvd, Industrial Zone',
                locations: [
                    { locationId: 'LOC-C1', name: 'Rack C1', code: 'C1' },
                    { locationId: 'LOC-C2', name: 'Rack C2', code: 'C2' }
                ]
            },
            {
                name: 'Regional Distribution Center',
                code: 'WH-RDC',
                address: '789 Distribution Way, Logistics Park',
                locations: [
                    { locationId: 'LOC-D1', name: 'Zone D1', code: 'D1' },
                    { locationId: 'LOC-SHIP', name: 'Shipping Area', code: 'SHIP' }
                ]
            }
        ]);
        console.log(`✅ Created ${warehouses.length} warehouses\n`);

        // Create Receipt Transactions
        console.log('📥 Creating receipt transactions...');
        const receipts = await Transaction.insertMany([
            {
                refNo: 'RCP-2024-001',
                type: 'Receipt',
                status: 'Done',
                warehouseId: warehouses[0]._id,
                lines: [
                    {
                        productId: products[0]._id,
                        qty: 500,
                        locationTo: 'LOC-A1',
                        unitCost: 50
                    },
                    {
                        productId: products[1]._id,
                        qty: 200,
                        locationTo: 'LOC-A2',
                        unitCost: 25
                    }
                ],
                createdBy: user._id,
                meta: new Map([['supplier', 'ABC Suppliers']])
            },
            {
                refNo: 'RCP-2024-002',
                type: 'Receipt',
                status: 'Done',
                warehouseId: warehouses[0]._id,
                lines: [
                    {
                        productId: products[2]._id,
                        qty: 50,
                        locationTo: 'LOC-B1',
                        unitCost: 150
                    },
                    {
                        productId: products[3]._id,
                        qty: 25,
                        locationTo: 'LOC-B1',
                        unitCost: 1200
                    }
                ],
                createdBy: user._id,
                meta: new Map([['supplier', 'Tech Distributors']])
            },
            {
                refNo: 'RCP-2024-003',
                type: 'Receipt',
                status: 'Draft',
                warehouseId: warehouses[1]._id,
                lines: [
                    {
                        productId: products[4]._id,
                        qty: 100,
                        locationTo: 'LOC-C1',
                        unitCost: 30
                    }
                ],
                createdBy: user._id,
                meta: new Map([['supplier', 'Paint Co.']])
            }
        ]);
        console.log(`✅ Created ${receipts.length} receipt transactions\n`);

        // Create Stock Items for Done Receipts
        console.log('📊 Creating stock items...');
        const stockItems = await StockItem.insertMany([
            {
                productId: products[0]._id,
                warehouseId: warehouses[0]._id,
                locationId: 'LOC-A1',
                quantity: 500,
                reserved: 0
            },
            {
                productId: products[1]._id,
                warehouseId: warehouses[0]._id,
                locationId: 'LOC-A2',
                quantity: 200,
                reserved: 0
            },
            {
                productId: products[2]._id,
                warehouseId: warehouses[0]._id,
                locationId: 'LOC-B1',
                quantity: 50,
                reserved: 10
            },
            {
                productId: products[3]._id,
                warehouseId: warehouses[0]._id,
                locationId: 'LOC-B1',
                quantity: 25,
                reserved: 5
            }
        ]);
        console.log(`✅ Created ${stockItems.length} stock items\n`);

        // Create Stock Ledger Entries
        console.log('📝 Creating stock ledger entries...');
        const ledgerEntries = await StockLedger.insertMany([
            {
                type: 'Receipt',
                refId: receipts[0]._id,
                productId: products[0]._id,
                warehouseId: warehouses[0]._id,
                locationId: 'LOC-A1',
                qtyChange: 500,
                balanceAfter: 500,
                userId: user._id,
                note: 'Receipt RCP-2024-001'
            },
            {
                type: 'Receipt',
                refId: receipts[0]._id,
                productId: products[1]._id,
                warehouseId: warehouses[0]._id,
                locationId: 'LOC-A2',
                qtyChange: 200,
                balanceAfter: 200,
                userId: user._id,
                note: 'Receipt RCP-2024-001'
            },
            {
                type: 'Receipt',
                refId: receipts[1]._id,
                productId: products[2]._id,
                warehouseId: warehouses[0]._id,
                locationId: 'LOC-B1',
                qtyChange: 50,
                balanceAfter: 50,
                userId: user._id,
                note: 'Receipt RCP-2024-002'
            },
            {
                type: 'Receipt',
                refId: receipts[1]._id,
                productId: products[3]._id,
                warehouseId: warehouses[0]._id,
                locationId: 'LOC-B1',
                qtyChange: 25,
                balanceAfter: 25,
                userId: user._id,
                note: 'Receipt RCP-2024-002'
            }
        ]);
        console.log(`✅ Created ${ledgerEntries.length} ledger entries\n`);

        // Create Delivery Transactions
        console.log('📤 Creating delivery transactions...');
        const deliveries = await Transaction.insertMany([
            {
                refNo: 'DEL-2024-001',
                type: 'Delivery',
                status: 'Draft',
                warehouseId: warehouses[0]._id,
                lines: [
                    {
                        productId: products[2]._id,
                        qty: 10,
                        locationFrom: 'LOC-B1',
                        unitCost: 150
                    }
                ],
                createdBy: user._id,
                meta: new Map([['customer', 'XYZ Corp']])
            },
            {
                refNo: 'DEL-2024-002',
                type: 'Delivery',
                status: 'Validated',
                warehouseId: warehouses[0]._id,
                lines: [
                    {
                        productId: products[3]._id,
                        qty: 5,
                        locationFrom: 'LOC-B1',
                        unitCost: 1200
                    }
                ],
                createdBy: user._id,
                meta: new Map([['customer', 'Tech Solutions Inc']])
            }
        ]);
        console.log(`✅ Created ${deliveries.length} delivery transactions\n`);

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Products: ${products.length}`);
        console.log(`   - Warehouses: ${warehouses.length}`);
        console.log(`   - Receipts: ${receipts.length}`);
        console.log(`   - Deliveries: ${deliveries.length}`);
        console.log(`   - Stock Items: ${stockItems.length}`);
        console.log(`   - Ledger Entries: ${ledgerEntries.length}`);
        console.log('\n✅ You can now login with:');
        console.log('   Email: admin@stockmaster.com');
        console.log('   Password: admin123\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run the seed script
connectDB().then(() => seedData());
