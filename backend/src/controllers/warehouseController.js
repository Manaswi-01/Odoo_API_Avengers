const Warehouse = require('../models/Warehouse');

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private
const getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new warehouse
// @route   POST /api/warehouses
// @access  Private
const createWarehouse = async (req, res) => {
    try {
        const { name, code, address, locations } = req.body;

        const warehouseExists = await Warehouse.findOne({ code });
        if (warehouseExists) {
            return res.status(400).json({ message: 'Warehouse code already exists' });
        }

        const warehouse = await Warehouse.create({
            name,
            code,
            address,
            locations
        });

        res.status(201).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update warehouse (add locations etc)
// @route   PUT /api/warehouses/:id
// @access  Private
const updateWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);
        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        const updatedWarehouse = await Warehouse.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedWarehouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete warehouse
// @route   DELETE /api/warehouses/:id
// @access  Private
const deleteWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);
        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }
        await warehouse.remove();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
};
