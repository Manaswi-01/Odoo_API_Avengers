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
    doneQuantity: {
        type: Number,
        default: 0
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
        enum: ['Draft', 'Counting', 'Waiting', 'Ready', 'Picking', 'Packed', 'Validated', 'Pending Approval', 'Done', 'Cancelled'],
        default: 'Draft'
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true
    },
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'
    },
    lines: [transactionLineSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    validatedAt: {
        type: Date
    },
    notes: {
        type: String,
        default: ''
    },
    meta: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
