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
    unit: {
        type: String,
        required: true
    },
    reorderPoint: {
        type: Number,
        default: 0
    },
    reorderQty: {
        type: Number,
        default: 0
    },
    attributes: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
