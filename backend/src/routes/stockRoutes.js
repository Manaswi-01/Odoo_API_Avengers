const express = require('express');
const router = express.Router();
const {
    getStockItems,
    getStockByProduct,
    getStockLedger
} = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

router.get('/items', protect, getStockItems);
router.get('/items/product/:productId', protect, getStockByProduct);
router.get('/ledger', protect, getStockLedger);

module.exports = router;
