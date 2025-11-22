const mongoose = require('mongoose');

const transactionLineSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    locationFrom: {
        type: String // Optional, depending on transaction type
    },
    locationTo: {
        type: String // Optional, depending on transaction type
    },
    unitCost: {
        type: Number
    }
});

const transactionSchema = new mongoose.Schema({
    refNo: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Receipt', 'Delivery', 'Transfer', 'Adjustment'],
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Validated', 'Done', 'Cancelled'],
        default: 'Draft'
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true
    },
    lines: [transactionLineSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    meta: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
