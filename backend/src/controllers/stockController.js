const StockItem = require('../models/StockItem');
const StockLedger = require('../models/StockLedger');

// @desc    Get all stock items with product and warehouse details
// @route   GET /api/stock/items
// @access  Private
const getStockItems = async (req, res) => {
    try {
        const stockItems = await StockItem.find()
            .populate('productId', 'name sku category unit')
            .populate('warehouseId', 'name code');
        
        res.status(200).json(stockItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stock for a specific product across all warehouses
// @route   GET /api/stock/items/product/:productId
// @access  Private
const getStockByProduct = async (req, res) => {
    try {
        const stockItems = await StockItem.find({ productId: req.params.productId })
            .populate('warehouseId', 'name code');
        
        res.status(200).json(stockItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stock ledger (move history)
// @route   GET /api/stock/ledger
// @access  Private
const getStockLedger = async (req, res) => {
    try {
        const { limit = 100, type, productId, warehouseId } = req.query;
        
        let query = {};
        if (type) query.type = type;
        if (productId) query.productId = productId;
        if (warehouseId) query.warehouseId = warehouseId;
        
        const ledgerEntries = await StockLedger.find(query)
            .populate('productId', 'name sku')
            .populate('warehouseId', 'name code')
            .populate('userId', 'name email')
            .populate('refId')
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));
        
        res.status(200).json(ledgerEntries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStockItems,
    getStockByProduct,
    getStockLedger
};
