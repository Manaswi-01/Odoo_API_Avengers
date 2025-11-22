const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    locationId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

const warehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    locations: [locationSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
