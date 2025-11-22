const Product = require('../models/Product');
const StockItem = require('../models/StockItem');
const Transaction = require('../models/Transaction');

// @desc    Get Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Products in Stock (Count of unique products with > 0 quantity)
        // Actually, let's just count total products defined
        const totalProducts = await Product.countDocuments();

        // 2. Low Stock Items (Products where total quantity across all warehouses < reorderPoint)
        // This is complex because quantity is in StockItems.
        // Simplified approach: Find StockItems where quantity < reorderPoint (if we had reorderPoint on StockItem)
        // Better approach: Aggregate StockItems by Product and compare with Product.reorderPoint
        // For now, let's just return count of StockItems with quantity < 10 (hardcoded threshold for simplicity or fetch from product)

        // Let's do a simple aggregation to get total stock per product
        const lowStockItems = await StockItem.aggregate([
            {
                $group: {
                    _id: '$productId',
                    totalQuantity: { $sum: '$quantity' }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $match: {
                    $expr: { $lt: ['$totalQuantity', '$product.reorderPoint'] }
                }
            },
            { $count: 'count' }
        ]);

        const lowStockCount = lowStockItems.length > 0 ? lowStockItems[0].count : 0;

        // 3. Pending Receipts (Transactions of type Receipt, status Draft or Validated)
        const pendingReceipts = await Transaction.countDocuments({
            type: 'Receipt',
            status: { $in: ['Draft', 'Validated'] }
        });

        // 4. Pending Deliveries
        const pendingDeliveries = await Transaction.countDocuments({
            type: 'Delivery',
            status: { $in: ['Draft', 'Validated'] }
        });

        res.status(200).json({
            totalProducts,
            lowStockCount,
            pendingReceipts,
            pendingDeliveries
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
