const Transaction = require('../models/Transaction');
const StockItem = require('../models/StockItem');
const StockLedger = require('../models/StockLedger');
const mongoose = require('mongoose');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('warehouseId', 'name code')
            .populate('lines.productId', 'name sku')
            .populate('createdBy', 'name');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new transaction (Draft)
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
    try {
        const { refNo, type, warehouseId, lines, meta } = req.body;

        // Check if RefNo exists
        const exists = await Transaction.findOne({ refNo });
        if (exists) {
            return res.status(400).json({ message: 'Transaction RefNo already exists' });
        }

        const transaction = await Transaction.create({
            refNo,
            type,
            status: 'Draft',
            warehouseId,
            lines,
            createdBy: req.user._id,
            meta
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update transaction (only if Draft)
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status !== 'Draft') {
            return res.status(400).json({ message: 'Cannot update transaction that is not in Draft status' });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Finalize transaction (Draft -> Done)
// @route   POST /api/transactions/:id/finalize
// @access  Private
const finalizeTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status !== 'Draft') {
            return res.status(400).json({ message: 'Transaction must be in Draft status to finalize' });
        }

        // Process each line
        for (const line of transaction.lines) {
            const { productId, qty, locationFrom, locationTo } = line;
            const warehouseId = transaction.warehouseId;

            // Logic depends on Transaction Type
            if (transaction.type === 'Receipt') {
                // Increase Stock at locationTo
                if (!locationTo) throw new Error('Location To is required for Receipt');

                let stockItem = await StockItem.findOne({
                    productId,
                    warehouseId,
                    locationId: locationTo
                });

                if (!stockItem) {
                    stockItem = new StockItem({
                        productId,
                        warehouseId,
                        locationId: locationTo,
                        quantity: 0
                    });
                }

                stockItem.quantity += qty;
                stockItem.lastUpdated = Date.now();
                await stockItem.save();

                // Create Ledger Entry
                await StockLedger.create({
                    type: 'Receipt',
                    refId: transaction._id,
                    productId,
                    warehouseId,
                    locationId: locationTo,
                    qtyChange: qty,
                    balanceAfter: stockItem.quantity,
                    userId: req.user._id,
                    note: `Receipt ${transaction.refNo}`
                });

            } else if (transaction.type === 'Delivery') {
                // Decrease Stock at locationFrom
                if (!locationFrom) throw new Error('Location From is required for Delivery');

                let stockItem = await StockItem.findOne({
                    productId,
                    warehouseId,
                    locationId: locationFrom
                });

                if (!stockItem || stockItem.quantity < qty) {
                    throw new Error(`Insufficient stock for product ${productId} at ${locationFrom}`);
                }

                stockItem.quantity -= qty;
                stockItem.lastUpdated = Date.now();
                await stockItem.save();

                // Create Ledger Entry
                await StockLedger.create({
                    type: 'Delivery',
                    refId: transaction._id,
                    productId,
                    warehouseId,
                    locationId: locationFrom,
                    qtyChange: -qty,
                    balanceAfter: stockItem.quantity,
                    userId: req.user._id,
                    note: `Delivery ${transaction.refNo}`
                });
            }
            // TODO: Implement Transfer and Adjustment logic similarly
        }

        transaction.status = 'Done';
        await transaction.save();

        res.status(200).json(transaction);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    finalizeTransaction
};
