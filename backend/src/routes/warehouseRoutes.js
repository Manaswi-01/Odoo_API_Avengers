const express = require('express');
const router = express.Router();
const {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
} = require('../controllers/warehouseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getWarehouses).post(protect, createWarehouse);
router.route('/:id').put(protect, updateWarehouse).delete(protect, deleteWarehouse);

module.exports = router;
