const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['InventoryManager', 'WarehouseStaff'],
        required: true
    },
    otp: {
        code: String,
        expires: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
