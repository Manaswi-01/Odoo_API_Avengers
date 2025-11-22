const mongoose = require('mongoose');

const stockLedgerSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        required: true // e.g., 'Receipt', 'Delivery', 'Transfer', 'Adjustment'
    },
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true
    },
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
        type: String,
        required: true
    },
    qtyChange: {
        type: Number,
        required: true
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    note: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StockLedger', stockLedgerSchema);
