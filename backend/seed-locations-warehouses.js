require('dotenv').config();
const mongoose = require('mongoose');
const Warehouse = require('./src/models/Warehouse');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedWarehouses = async () => {
    try {
        console.log('🏭 Seeding Warehouses and Locations...');

        // Check for existing warehouses to avoid duplicates or clear them
        // For this task, let's clear existing warehouses to ensure a clean "5-7 inputs" state as requested
        // or we can just append. The user said "input 5-7 inputs", implying a set.
        // Let's clear to be "neat".
        console.log('🗑️  Clearing existing warehouses...');
        await Warehouse.deleteMany({});
        console.log('✅ Existing warehouses cleared');

        const warehousesData = [
            {
                name: 'Central Fulfillment Center',
                code: 'WH-CEN',
                address: '100 Main St, Metropolis',
                locations: [
                    { locationId: 'LOC-C01', name: 'Aisle 1 - Electronics', code: 'C-01' },
                    { locationId: 'LOC-C02', name: 'Aisle 2 - Home Goods', code: 'C-02' },
                    { locationId: 'LOC-C03', name: 'Aisle 3 - Clothing', code: 'C-03' },
                    { locationId: 'LOC-C04', name: 'Aisle 4 - Toys', code: 'C-04' },
                    { locationId: 'LOC-C05', name: 'Bulk Storage A', code: 'C-BULK-A' }
                ]
            },
            {
                name: 'North Regional Hub',
                code: 'WH-NOR',
                address: '55 Northway Blvd, Uptown',
                locations: [
                    { locationId: 'LOC-N01', name: 'Zone A - Receiving', code: 'N-RECV' },
                    { locationId: 'LOC-N02', name: 'Zone B - Sorting', code: 'N-SORT' },
                    { locationId: 'LOC-N03', name: 'Rack 101', code: 'N-101' },
                    { locationId: 'LOC-N04', name: 'Rack 102', code: 'N-102' },
                    { locationId: 'LOC-N05', name: 'Zone C - Shipping', code: 'N-SHIP' }
                ]
            },
            {
                name: 'South Cold Storage',
                code: 'WH-SOU',
                address: '88 Frost Lane, Southside',
                locations: [
                    { locationId: 'LOC-S01', name: 'Freezer A', code: 'S-FRZ-A' },
                    { locationId: 'LOC-S02', name: 'Freezer B', code: 'S-FRZ-B' },
                    { locationId: 'LOC-S03', name: 'Chiller 1', code: 'S-CHL-1' },
                    { locationId: 'LOC-S04', name: 'Chiller 2', code: 'S-CHL-2' },
                    { locationId: 'LOC-S05', name: 'Loading Dock', code: 'S-DOCK' }
                ]
            },
            {
                name: 'East Coast Distribution',
                code: 'WH-EAS',
                address: '200 Harbor Dr, Port City',
                locations: [
                    { locationId: 'LOC-E01', name: 'Import Dock', code: 'E-IMP' },
                    { locationId: 'LOC-E02', name: 'Export Dock', code: 'E-EXP' },
                    { locationId: 'LOC-E03', name: 'High Bay 1', code: 'E-HB1' },
                    { locationId: 'LOC-E04', name: 'High Bay 2', code: 'E-HB2' },
                    { locationId: 'LOC-E05', name: 'Inspection Area', code: 'E-INSP' }
                ]
            },
            {
                name: 'West Tech Depot',
                code: 'WH-WES',
                address: '99 Silicon Ave, Tech Valley',
                locations: [
                    { locationId: 'LOC-W01', name: 'Secure Cage', code: 'W-SEC' },
                    { locationId: 'LOC-W02', name: 'Assembly Line', code: 'W-ASM' },
                    { locationId: 'LOC-W03', name: 'Testing Station', code: 'W-TST' },
                    { locationId: 'LOC-W04', name: 'Packaging', code: 'W-PKG' },
                    { locationId: 'LOC-W05', name: 'Finished Goods', code: 'W-FIN' }
                ]
            },
            {
                name: 'Urban Quick-Ship',
                code: 'WH-URB',
                address: '45 Downtown St, City Center',
                locations: [
                    { locationId: 'LOC-U01', name: 'Shelf A', code: 'U-SH-A' },
                    { locationId: 'LOC-U02', name: 'Shelf B', code: 'U-SH-B' },
                    { locationId: 'LOC-U03', name: 'Shelf C', code: 'U-SH-C' },
                    { locationId: 'LOC-U04', name: 'Counter Pickup', code: 'U-PCK' },
                    { locationId: 'LOC-U05', name: 'Bike Courier Zone', code: 'U-BIKE' }
                ]
            },
            {
                name: 'Airport Logistics Facility',
                code: 'WH-AIR',
                address: 'Terminal 5 Cargo Rd, Airport',
                locations: [
                    { locationId: 'LOC-A01', name: 'Air Freight In', code: 'A-IN' },
                    { locationId: 'LOC-A02', name: 'Air Freight Out', code: 'A-OUT' },
                    { locationId: 'LOC-A03', name: 'Customs Hold', code: 'A-CUST' },
                    { locationId: 'LOC-A04', name: 'X-Ray Scan', code: 'A-SCAN' },
                    { locationId: 'LOC-A05', name: 'Pallet Storage', code: 'A-PAL' }
                ]
            }
        ];

        await Warehouse.insertMany(warehousesData);
        console.log(`✅ Successfully created ${warehousesData.length} warehouses with 5 locations each.`);

    } catch (error) {
        console.error('❌ Error seeding warehouses:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

connectDB().then(() => seedWarehouses());
