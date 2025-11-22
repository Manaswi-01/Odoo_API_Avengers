const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireManager, requireStaffOrManager } = require('../middleware/roleMiddleware');
const {
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    // Receipt workflow
    createReceipt,
    updateReceiptCount,
    validateReceipt,
    // Delivery workflow
    createDelivery,
    checkAvailability,
    markAsPacked,
    validateDelivery,
    // Transfer workflow
    createTransfer,
    validateTransfer,
    // Adjustment workflow
    createAdjustment,
    approveAdjustment
} = require('../controllers/transactionController');

// All routes require authentication
router.use(protect);

// General transaction routes
router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', requireManager, deleteTransaction);

// Receipt workflow routes
router.post('/receipts', requireStaffOrManager, createReceipt);
router.put('/receipts/:id/count', requireStaffOrManager, updateReceiptCount);
router.post('/receipts/:id/validate', requireManager, validateReceipt);

// Delivery workflow routes
router.post('/deliveries', requireStaffOrManager, createDelivery);
router.post('/deliveries/:id/check', checkAvailability);
router.post('/deliveries/:id/pack', requireStaffOrManager, markAsPacked);
router.post('/deliveries/:id/validate', requireStaffOrManager, validateDelivery);

// Transfer workflow routes
router.post('/transfers', requireStaffOrManager, createTransfer);
router.post('/transfers/:id/validate', requireStaffOrManager, validateTransfer);

// Adjustment workflow routes
router.post('/adjustments', requireStaffOrManager, createAdjustment);
router.post('/adjustments/:id/approve', requireManager, approveAdjustment);

module.exports = router;
