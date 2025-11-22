const Transaction = require('../models/Transaction');
const StockItem = require('../models/StockItem');
const StockLedger = require('../models/StockLedger');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get all transactions with optional filtering
// @route   GET /api/transactions?type=Receipt&status=Draft
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const { type, status } = req.query;
        let query = {};

        if (type) query.type = type;
        if (status) query.status = status;

        const transactions = await Transaction.find(query)
            .populate('warehouseId', 'name code')
            .populate('partnerId', 'name')
            .populate('lines.productId', 'name sku')
            .populate('createdBy', 'name role')
            .populate('validatedBy', 'name role')
            .sort({ createdAt: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('warehouseId', 'name code locations')
            .populate('partnerId', 'name email')
            .populate('lines.productId', 'name sku unit')
            .populate('createdBy', 'name role')
            .populate('validatedBy', 'name role');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ RECEIPT WORKFLOW ============

// @desc    Create new receipt (Draft status)
// @route   POST /api/transactions/receipts
// @access  Private (Manager/Staff)
const createReceipt = async (req, res) => {
    try {
        const { refNo, warehouseId, partnerId, lines, notes } = req.body;

        // Check if RefNo exists
        const exists = await Transaction.findOne({ refNo });
        if (exists) {
            return res.status(400).json({ message: 'Transaction RefNo already exists' });
        }

        const receipt = await Transaction.create({
            refNo,
            type: 'Receipt',
            status: 'Draft',
            warehouseId,
            partnerId,
            lines,
            notes,
            createdBy: req.user._id
        });

        const populatedReceipt = await Transaction.findById(receipt._id)
            .populate('warehouseId', 'name')
            .populate('partnerId', 'name')
            .populate('lines.productId', 'name sku');

        res.status(201).json(populatedReceipt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update receipt counting (Draft -> Counting)
// @route   PUT /api/transactions/receipts/:id/count
// @access  Private (Staff)
const updateReceiptCount = async (req, res) => {
    try {
        const { lines } = req.body; // lines should contain doneQuantity for each line

        const receipt = await Transaction.findById(req.params.id);

        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        if (receipt.type !== 'Receipt') {
            return res.status(400).json({ message: 'This is not a receipt transaction' });
        }

        if (receipt.status !== 'Draft' && receipt.status !== 'Counting') {
            return res.status(400).json({ message: 'Receipt must be in Draft or Counting status' });
        }

        // Update done quantities
        lines.forEach(updatedLine => {
            const line = receipt.lines.id(updatedLine._id);
            if (line) {
                line.doneQuantity = updatedLine.doneQuantity;
            }
        });

        receipt.status = 'Counting';
        await receipt.save();

        const populatedReceipt = await Transaction.findById(receipt._id)
            .populate('warehouseId', 'name')
            .populate('partnerId', 'name')
            .populate('lines.productId', 'name sku');

        res.status(200).json(populatedReceipt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate receipt (Counting -> Done)
// @route   POST /api/transactions/receipts/:id/validate
// @access  Private (Manager)
const validateReceipt = async (req, res) => {
    try {
        const receipt = await Transaction.findById(req.params.id);

        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        if (receipt.type !== 'Receipt') {
            return res.status(400).json({ message: 'This is not a receipt transaction' });
        }

        if (receipt.status !== 'Counting') {
            return res.status(400).json({ message: 'Receipt must be in Counting status to validate' });
        }

        // Process each line and update stock
        for (const line of receipt.lines) {
            const { productId, doneQuantity, locationTo } = line;
            const warehouseId = receipt.warehouseId;

            if (!locationTo) {
                throw new Error('Location To is required for Receipt');
            }

            if (doneQuantity <= 0) {
                throw new Error('Done quantity must be greater than 0');
            }

            // Find or create stock item
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

            stockItem.quantity += doneQuantity;
            stockItem.lastUpdated = Date.now();
            await stockItem.save();

            // Create Ledger Entry
            await StockLedger.create({
                type: 'Receipt',
                refId: receipt._id,
                productId,
                warehouseId,
                locationId: locationTo,
                qtyChange: doneQuantity,
                balanceAfter: stockItem.quantity,
                userId: req.user._id,
                note: `Receipt ${receipt.refNo} validated`
            });
        }

        receipt.status = 'Done';
        receipt.validatedBy = req.user._id;
        receipt.validatedAt = Date.now();
        await receipt.save();

        const populatedReceipt = await Transaction.findById(receipt._id)
            .populate('warehouseId', 'name')
            .populate('partnerId', 'name')
            .populate('lines.productId', 'name sku')
            .populate('validatedBy', 'name');

        res.status(200).json(populatedReceipt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ DELIVERY WORKFLOW ============

// @desc    Create new delivery (Waiting status)
// @route   POST /api/transactions/deliveries
// @access  Private (Manager/Staff)
const createDelivery = async (req, res) => {
    try {
        const { refNo, warehouseId, partnerId, lines, notes } = req.body;

        // Check if RefNo exists
        const exists = await Transaction.findOne({ refNo });
        if (exists) {
            return res.status(400).json({ message: 'Transaction RefNo already exists' });
        }

        const delivery = await Transaction.create({
            refNo,
            type: 'Delivery',
            status: 'Waiting',
            warehouseId,
            partnerId,
            lines,
            notes,
            createdBy: req.user._id
        });

        // Automatically check availability
        const availabilityCheck = await checkDeliveryAvailability(delivery);

        const populatedDelivery = await Transaction.findById(delivery._id)
            .populate('warehouseId', 'name')
            .populate('partnerId', 'name')
            .populate('lines.productId', 'name sku');

        res.status(201).json({
            ...populatedDelivery.toObject(),
            availabilityCheck
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to check delivery availability
const checkDeliveryAvailability = async (delivery) => {
    let allAvailable = true;
    const availability = [];

    for (const line of delivery.lines) {
        const stockItem = await StockItem.findOne({
            productId: line.productId,
            warehouseId: delivery.warehouseId,
            locationId: line.locationFrom
        });

        const available = stockItem && stockItem.quantity >= line.qty;
        availability.push({
            productId: line.productId,
            requested: line.qty,
            available: stockItem ? stockItem.quantity : 0,
            sufficient: available
        });

        if (!available) allAvailable = false;
    }

    // Update status to Ready if all items are available
    if (allAvailable && delivery.status === 'Waiting') {
        delivery.status = 'Ready';
        await delivery.save();
    }

    return { allAvailable, items: availability };
};

// @desc    Check delivery availability
// @route   POST /api/transactions/deliveries/:id/check
// @access  Private
const checkAvailability = async (req, res) => {
    try {
        const delivery = await Transaction.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        if (delivery.type !== 'Delivery') {
            return res.status(400).json({ message: 'This is not a delivery transaction' });
        }

        const availabilityCheck = await checkDeliveryAvailability(delivery);

        const populatedDelivery = await Transaction.findById(delivery._id)
            .populate('warehouseId', 'name')
            .populate('partnerId', 'name')
            .populate('lines.productId', 'name sku');

        res.status(200).json({
            ...populatedDelivery.toObject(),
            availabilityCheck
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark delivery as packed (Ready -> Packed)
// @route   POST /api/transactions/deliveries/:id/pack
// @access  Private (Staff)
const markAsPacked = async (req, res) => {
    try {
        const delivery = await Transaction.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        if (delivery.type !== 'Delivery') {
            return res.status(400).json({ message: 'This is not a delivery transaction' });
        }

        if (delivery.status !== 'Ready') {
            return res.status(400).json({ message: 'Delivery must be in Ready status to pack' });
        }

        delivery.status = 'Packed';
        await delivery.save();

        const populatedDelivery = await Transaction.findById(delivery._id)
            .populate('warehouseId', 'name')
            .populate('partnerId', 'name')
            .populate('lines.productId', 'name sku');

        res.status(200).json(populatedDelivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate delivery (Packed -> Done)
// @route   POST /api/transactions/deliveries/:id/validate
// @access  Private (Staff/Manager)
const validateDelivery = async (req, res) => {
    try {
        const delivery = await Transaction.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        if (delivery.type !== 'Delivery') {
            return res.status(400).json({ message: 'This is not a delivery transaction' });
        }

        if (delivery.status !== 'Packed') {
            return res.status(400).json({ message: 'Delivery must be in Packed status to validate' });
        }

        // Process each line and update stock
        for (const line of delivery.lines) {
            const { productId, qty, locationFrom } = line;
            const warehouseId = delivery.warehouseId;

            if (!locationFrom) {
                throw new Error('Location From is required for Delivery');
            }

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
                refId: delivery._id,
                productId,
                warehouseId,
                locationId: locationFrom,
                qtyChange: -qty,
                balanceAfter: stockItem.quantity,
                userId: req.user._id,
                note: `Delivery ${delivery.refNo} validated`
            });
        }

        delivery.status = 'Done';
        delivery.validatedBy = req.user._id;
        delivery.validatedAt = Date.now();
        await delivery.save();

        const populatedDelivery = await Transaction.findById(delivery._id)
            .populate('warehouseId', 'name')
            .populate('partnerId', 'name')
            .populate('lines.productId', 'name sku')
            .populate('validatedBy', 'name');

        res.status(200).json(populatedDelivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ TRANSFER WORKFLOW ============

// @desc    Create and validate internal transfer
// @route   POST /api/transactions/transfers
// @access  Private (Manager/Staff)
const createTransfer = async (req, res) => {
    try {
        const { refNo, warehouseId, lines, notes } = req.body;

        // Check if RefNo exists
        const exists = await Transaction.findOne({ refNo });
        if (exists) {
            return res.status(400).json({ message: 'Transaction RefNo already exists' });
        }

        // Validate that all lines have locationFrom and locationTo
        for (const line of lines) {
            if (!line.locationFrom || !line.locationTo) {
                return res.status(400).json({
                    message: 'All lines must have locationFrom and locationTo for transfers'
                });
            }
        }

        const transfer = await Transaction.create({
            refNo,
            type: 'Transfer',
            status: 'Draft',
            warehouseId,
            lines,
            notes,
            createdBy: req.user._id
        });

        res.status(201).json(transfer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate transfer (Draft -> Done)
// @route   POST /api/transactions/transfers/:id/validate
// @access  Private (Manager/Staff)
const validateTransfer = async (req, res) => {
    try {
        const transfer = await Transaction.findById(req.params.id);

        if (!transfer) {
            return res.status(404).json({ message: 'Transfer not found' });
        }

        if (transfer.type !== 'Transfer') {
            return res.status(400).json({ message: 'This is not a transfer transaction' });
        }

        if (transfer.status !== 'Draft') {
            return res.status(400).json({ message: 'Transfer must be in Draft status to validate' });
        }

        // Process each line
        for (const line of transfer.lines) {
            const { productId, qty, locationFrom, locationTo } = line;
            const warehouseId = transfer.warehouseId;

            // Decrease stock at source location
            let stockItemFrom = await StockItem.findOne({
                productId,
                warehouseId,
                locationId: locationFrom
            });

            if (!stockItemFrom || stockItemFrom.quantity < qty) {
                throw new Error(`Insufficient stock for product ${productId} at ${locationFrom}`);
            }

            stockItemFrom.quantity -= qty;
            stockItemFrom.lastUpdated = Date.now();
            await stockItemFrom.save();

            // Increase stock at destination location
            let stockItemTo = await StockItem.findOne({
                productId,
                warehouseId,
                locationId: locationTo
            });

            if (!stockItemTo) {
                stockItemTo = new StockItem({
                    productId,
                    warehouseId,
                    locationId: locationTo,
                    quantity: 0
                });
            }

            stockItemTo.quantity += qty;
            stockItemTo.lastUpdated = Date.now();
            await stockItemTo.save();

            // Create Ledger Entries
            await StockLedger.create({
                type: 'Transfer',
                refId: transfer._id,
                productId,
                warehouseId,
                locationId: locationFrom,
                qtyChange: -qty,
                balanceAfter: stockItemFrom.quantity,
                userId: req.user._id,
                note: `Transfer ${transfer.refNo} from ${locationFrom} to ${locationTo}`
            });

            await StockLedger.create({
                type: 'Transfer',
                refId: transfer._id,
                productId,
                warehouseId,
                locationId: locationTo,
                qtyChange: qty,
                balanceAfter: stockItemTo.quantity,
                userId: req.user._id,
                note: `Transfer ${transfer.refNo} from ${locationFrom} to ${locationTo}`
            });
        }

        transfer.status = 'Done';
        transfer.validatedBy = req.user._id;
        transfer.validatedAt = Date.now();
        await transfer.save();

        const populatedTransfer = await Transaction.findById(transfer._id)
            .populate('warehouseId', 'name')
            .populate('lines.productId', 'name sku')
            .populate('validatedBy', 'name');

        res.status(200).json(populatedTransfer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ ADJUSTMENT WORKFLOW ============

// @desc    Create stock adjustment (Draft status)
// @route   POST /api/transactions/adjustments
// @access  Private (Staff)
const createAdjustment = async (req, res) => {
    try {
        const { refNo, warehouseId, lines, notes } = req.body;

        // Check if RefNo exists
        const exists = await Transaction.findOne({ refNo });
        if (exists) {
            return res.status(400).json({ message: 'Transaction RefNo already exists' });
        }

        // For adjustments, doneQuantity represents the counted quantity
        const adjustment = await Transaction.create({
            refNo,
            type: 'Adjustment',
            status: 'Pending Approval',
            warehouseId,
            lines,
            notes,
            createdBy: req.user._id
        });

        const populatedAdjustment = await Transaction.findById(adjustment._id)
            .populate('warehouseId', 'name')
            .populate('lines.productId', 'name sku')
            .populate('createdBy', 'name');

        res.status(201).json(populatedAdjustment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve adjustment (Pending Approval -> Done)
// @route   POST /api/transactions/adjustments/:id/approve
// @access  Private (Manager only)
const approveAdjustment = async (req, res) => {
    try {
        const { notes } = req.body;

        const adjustment = await Transaction.findById(req.params.id);

        if (!adjustment) {
            return res.status(404).json({ message: 'Adjustment not found' });
        }

        if (adjustment.type !== 'Adjustment') {
            return res.status(400).json({ message: 'This is not an adjustment transaction' });
        }

        if (adjustment.status !== 'Pending Approval') {
            return res.status(400).json({ message: 'Adjustment must be in Pending Approval status' });
        }

        // Process each line
        for (const line of adjustment.lines) {
            const { productId, doneQuantity, locationTo } = line;
            const warehouseId = adjustment.warehouseId;

            if (!locationTo) {
                throw new Error('Location is required for Adjustment');
            }

            // Get current stock
            let stockItem = await StockItem.findOne({
                productId,
                warehouseId,
                locationId: locationTo
            });

            const currentQty = stockItem ? stockItem.quantity : 0;
            const difference = doneQuantity - currentQty;

            if (!stockItem) {
                stockItem = new StockItem({
                    productId,
                    warehouseId,
                    locationId: locationTo,
                    quantity: 0
                });
            }

            stockItem.quantity = doneQuantity;
            stockItem.lastUpdated = Date.now();
            await stockItem.save();

            // Create Ledger Entry
            const adjustmentType = difference > 0 ? 'Inventory Gain' : 'Inventory Loss';
            await StockLedger.create({
                type: 'Adjustment',
                refId: adjustment._id,
                productId,
                warehouseId,
                locationId: locationTo,
                qtyChange: difference,
                balanceAfter: stockItem.quantity,
                userId: req.user._id,
                note: `${adjustmentType}: ${adjustment.refNo} - ${notes || adjustment.notes || 'Stock adjustment'}`
            });
        }

        adjustment.status = 'Done';
        adjustment.validatedBy = req.user._id;
        adjustment.validatedAt = Date.now();
        if (notes) adjustment.notes = notes;
        await adjustment.save();

        const populatedAdjustment = await Transaction.findById(adjustment._id)
            .populate('warehouseId', 'name')
            .populate('lines.productId', 'name sku')
            .populate('createdBy', 'name')
            .populate('validatedBy', 'name');

        res.status(200).json(populatedAdjustment);
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
        ).populate('warehouseId', 'name')
            .populate('partnerId', 'name')
            .populate('lines.productId', 'name sku');

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete transaction (only if Draft)
// @route   DELETE /api/transactions/:id
// @access  Private (Manager only)
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status !== 'Draft') {
            return res.status(400).json({ message: 'Cannot delete transaction that is not in Draft status' });
        }

        await Transaction.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Transaction deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
