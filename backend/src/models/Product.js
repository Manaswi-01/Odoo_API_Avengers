const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'
    },
    imageUrl: {
        type: String,
        default: ''
    },
    reorderPoint: {
        type: Number,
        default: 10
    },
    reorderQty: {
        type: Number,
        default: 50
    },
    attributes: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
