const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true
    },
    locationId: {
        type: String, // Storing locationId as String since it's embedded in Warehouse
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    reserved: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for fast lookups
stockItemSchema.index({ productId: 1, warehouseId: 1, locationId: 1 }, { unique: true });

module.exports = mongoose.model('StockItem', stockItemSchema);
