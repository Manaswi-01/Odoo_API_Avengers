require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./src/models/Transaction');
const StockItem = require('./src/models/StockItem');
const StockLedger = require('./src/models/StockLedger');
const Product = require('./src/models/Product');
const Warehouse = require('./src/models/Warehouse');
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

const seedTransactions = async () => {
    try {
        console.log('🔄 Seeding Transactions, Stock, and History...');

        // 1. Fetch existing data
        const products = await Product.find();
        const warehouses = await Warehouse.find();
        const user = await User.findOne(); // Just grab the first user (likely admin)

        if (products.length === 0 || warehouses.length === 0 || !user) {
            console.error('❌ Missing prerequisites. Please run seed-products.js and seed-locations-warehouses.js first.');
            process.exit(1);
        }

        console.log(`   Found ${products.length} products, ${warehouses.length} warehouses, and user ${user.name}.`);

        // 2. Clear existing transactional data to ensure clean state
        console.log('🗑️  Clearing existing transactions, stock, and ledger...');
        await Transaction.deleteMany({});
        await StockItem.deleteMany({});
        await StockLedger.deleteMany({});
        console.log('✅ Cleared.');

        // 3. Create Receipts (Inbound)
        console.log('📥 Creating Receipts...');
        const receipts = [];

        // Receipt 1: Main Warehouse - Large stock
        const wh1 = warehouses[0];
        const r1 = {
            refNo: 'REC-2024-001',
            type: 'Receipt',
            status: 'Done',
            warehouseId: wh1._id,
            lines: [
                { productId: products[0]._id, qty: 100, doneQuantity: 100, locationTo: wh1.locations[0].locationId, unitCost: 10 },
                { productId: products[1]._id, qty: 50, doneQuantity: 50, locationTo: wh1.locations[1].locationId, unitCost: 20 }
            ],
            createdBy: user._id,
            validatedBy: user._id,
            validatedAt: new Date(),
            notes: 'Initial stock setup'
        };
        receipts.push(r1);

        // Receipt 2: Secondary Warehouse - Electronics
        const wh2 = warehouses[1];
        const r2 = {
            refNo: 'REC-2024-002',
            type: 'Receipt',
            status: 'Done',
            warehouseId: wh2._id,
            lines: [
                { productId: products[4]._id, qty: 20, doneQuantity: 20, locationTo: wh2.locations[0].locationId, unitCost: 1200 }, // Laptop
                { productId: products[5]._id, qty: 50, doneQuantity: 50, locationTo: wh2.locations[0].locationId, unitCost: 25 }   // Mouse
            ],
            createdBy: user._id,
            validatedBy: user._id,
            validatedAt: new Date(),
            notes: 'Electronics shipment'
        };
        receipts.push(r2);

        // Receipt 3: Draft Receipt
        const r3 = {
            refNo: 'REC-2024-003',
            type: 'Receipt',
            status: 'Draft',
            warehouseId: wh1._id,
            lines: [
                { productId: products[2]._id, qty: 10, locationTo: wh1.locations[2].locationId }
            ],
            createdBy: user._id,
            notes: 'Pending arrival'
        };
        receipts.push(r3);

        const createdReceipts = await Transaction.insertMany(receipts);
        console.log(`   Created ${createdReceipts.length} receipts.`);

        // 4. Process Stock and Ledger for DONE Receipts
        console.log('📊 Updating Stock and Ledger for Receipts...');
        for (const receipt of createdReceipts) {
            if (receipt.status === 'Done') {
                for (const line of receipt.lines) {
                    // Create/Update StockItem
                    await StockItem.findOneAndUpdate(
                        { productId: line.productId, warehouseId: receipt.warehouseId, locationId: line.locationTo },
                        { $inc: { quantity: line.doneQuantity }, $set: { lastUpdated: new Date() } },
                        { upsert: true, new: true }
                    );

                    // Create Ledger Entry
                    await StockLedger.create({
                        type: 'Receipt',
                        refId: receipt._id,
                        productId: line.productId,
                        warehouseId: receipt.warehouseId,
                        locationId: line.locationTo,
                        qtyChange: line.doneQuantity,
                        balanceAfter: line.doneQuantity, // Simplified (assuming 0 start for seed)
                        userId: user._id,
                        note: `Seeded Receipt ${receipt.refNo}`
                    });
                }
            }
        }

        // 5. Create Deliveries (Outbound)
        console.log('📤 Creating Deliveries...');
        const deliveries = [];

        // Delivery 1: Shipping out some steel from WH1
        const d1 = {
            refNo: 'DEL-2024-001',
            type: 'Delivery',
            status: 'Done',
            warehouseId: wh1._id,
            lines: [
                { productId: products[0]._id, qty: 10, locationFrom: wh1.locations[0].locationId }
            ],
            createdBy: user._id,
            validatedBy: user._id,
            validatedAt: new Date(),
            notes: 'Customer Order #123'
        };
        deliveries.push(d1);

        // Delivery 2: Draft Delivery
        const d2 = {
            refNo: 'DEL-2024-002',
            type: 'Delivery',
            status: 'Waiting',
            warehouseId: wh2._id,
            lines: [
                { productId: products[4]._id, qty: 1, locationFrom: wh2.locations[0].locationId }
            ],
            createdBy: user._id,
            notes: 'Waiting for payment'
        };
        deliveries.push(d2);

        const createdDeliveries = await Transaction.insertMany(deliveries);
        console.log(`   Created ${createdDeliveries.length} deliveries.`);

        // 6. Process Stock and Ledger for DONE Deliveries
        console.log('📊 Updating Stock and Ledger for Deliveries...');
        for (const delivery of createdDeliveries) {
            if (delivery.status === 'Done') {
                for (const line of delivery.lines) {
                    // Update StockItem (Decrease)
                    const stockItem = await StockItem.findOneAndUpdate(
                        { productId: line.productId, warehouseId: delivery.warehouseId, locationId: line.locationFrom },
                        { $inc: { quantity: -line.qty }, $set: { lastUpdated: new Date() } },
                        { new: true }
                    );

                    // Create Ledger Entry
                    await StockLedger.create({
                        type: 'Delivery',
                        refId: delivery._id,
                        productId: line.productId,
                        warehouseId: delivery.warehouseId,
                        locationId: line.locationFrom,
                        qtyChange: -line.qty,
                        balanceAfter: stockItem ? stockItem.quantity : 0,
                        userId: user._id,
                        note: `Seeded Delivery ${delivery.refNo}`
                    });
                }
            }
        }

        console.log('✅ Seeding Complete!');

    } catch (error) {
        console.error('❌ Error seeding transactions:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

connectDB().then(() => seedTransactions());
