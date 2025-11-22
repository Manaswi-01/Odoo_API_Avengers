const express = require('express');
const router = express.Router();
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    finalizeTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTransactions).post(protect, createTransaction);
router.route('/:id').put(protect, updateTransaction);
router.route('/:id/finalize').post(protect, finalizeTransaction);

module.exports = router;
