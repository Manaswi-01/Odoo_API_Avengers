const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    setReorderRules
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { requireManager } = require('../middleware/roleMiddleware');

// All routes require authentication
router.route('/').get(protect, getProducts).post(protect, requireManager, createProduct);
router.route('/:id').get(protect, getProduct).put(protect, requireManager, updateProduct).delete(protect, requireManager, deleteProduct);
router.put('/:id/reorder', protect, requireManager, setReorderRules);

module.exports = router;
