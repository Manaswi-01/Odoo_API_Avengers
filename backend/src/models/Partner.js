const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Supplier', 'Customer'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    code: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Partner', partnerSchema);
