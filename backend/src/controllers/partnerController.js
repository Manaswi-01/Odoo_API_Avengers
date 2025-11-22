const Partner = require('../models/Partner');

// @desc    Get all partners
// @route   GET /api/partners
// @access  Private
const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find();
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new partner
// @route   POST /api/partners
// @access  Private
const createPartner = async (req, res) => {
    try {
        const { type, name, contact, code } = req.body;
        const partner = await Partner.create({
            type,
            name,
            contact,
            code
        });
        res.status(201).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPartners,
    createPartner
};
