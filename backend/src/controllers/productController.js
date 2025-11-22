const Product = require('../models/Product');

// @desc    Get all products with optional filtering
// @route   GET /api/products?category=xxx&lowStock=true
// @access  Private
const getProducts = async (req, res) => {
    try {
        const { category, lowStock, search } = req.query;
        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search by SKU or name
        if (search) {
            query.$or = [
                { sku: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }

        let products = await Product.find(query).populate('vendor', 'name');

        // Filter low stock items if requested
        if (lowStock === 'true') {
            const StockItem = require('../models/StockItem');
            const stockItems = await StockItem.find();

            const lowStockProductIds = new Set();
            for (const stock of stockItems) {
                const product = await Product.findById(stock.productId);
                if (product && stock.quantity <= product.reorderPoint) {
                    lowStockProductIds.add(product._id.toString());
                }
            }

            products = products.filter(p => lowStockProductIds.has(p._id.toString()));
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Manager only - enforced in routes)
const createProduct = async (req, res) => {
    try {
        const { name, sku, category, description, unit, vendor, imageUrl, reorderPoint, reorderQty, attributes } = req.body;

        // Check if SKU exists
        const skuExists = await Product.findOne({ sku });
        if (skuExists) {
            return res.status(400).json({ message: 'Product with this SKU already exists' });
        }

        const product = await Product.create({
            name,
            sku,
            category,
            description,
            unit,
            vendor,
            imageUrl,
            reorderPoint,
            reorderQty,
            attributes
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Manager only - enforced in routes)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Manager only - enforced in routes)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.remove();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set reorder rules for a product
// @route   PUT /api/products/:id/reorder
// @access  Private (Manager only - enforced in routes)
const setReorderRules = async (req, res) => {
    try {
        const { reorderPoint, reorderQty } = req.body;

        if (reorderPoint === undefined || reorderQty === undefined) {
            return res.status(400).json({ message: 'reorderPoint and reorderQty are required' });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.reorderPoint = reorderPoint;
        product.reorderQty = reorderQty;
        await product.save();

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    setReorderRules
};
