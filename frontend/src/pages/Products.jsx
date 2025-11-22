import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { productsAPI, partnersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { isManager } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        description: '',
        unit: 'pcs',
        vendor: '',
        imageUrl: '',
        reorderPoint: 10,
        reorderQty: 50
    });

    useEffect(() => {
        fetchProducts();
        fetchPartners();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, categoryFilter, stockFilter]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productsAPI.getAll();
            setProducts(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPartners = async () => {
        try {
            const data = await partnersAPI.getAll();
            setPartners(data);
        } catch (err) {
            console.error('Failed to fetch partners:', err);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        // Stock filter
        if (stockFilter === 'low') {
            // This is a simplified check - in real app, you'd fetch stock data
            filtered = filtered.filter(p => p.reorderPoint > 0);
        }

        setFilteredProducts(filtered);
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            await productsAPI.create(formData);
            setShowCreateModal(false);
            setFormData({
                name: '',
                sku: '',
                category: '',
                description: '',
                unit: 'pcs',
                vendor: '',
                imageUrl: '',
                reorderPoint: 10,
                reorderQty: 50
            });
            fetchProducts();
        } catch (err) {
            setError(err.message);
        }
    };

    const categories = [...new Set(products.map(p => p.category))];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navbar />

            <div className="container-main section-spacing">
                {/* Header */}
                <div className="page-header flex items-start justify-between">
                    <div>
                        <h1 className="page-title">Products</h1>
                        <p className="page-description">
                            Manage your product catalog and inventory items
                        </p>
                    </div>
                    {isManager && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn btn-primary"
                        >
                            <span>+</span>
                            New Product
                        </button>
                    )}
                </div>

                {error && (
                    <div className="card card-padding mb-6 border-l-4 border-red-500 bg-red-50 text-red-700">
                        <p className="font-medium">Error</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Filters */}
                <div className="card card-padding mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                Search
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Search by name or SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                Category
                            </label>
                            <select
                                className="input"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                Stock Status
                            </label>
                            <select
                                className="input"
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                            >
                                <option value="">All Products</option>
                                <option value="low">Low Stock Items</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="spinner mb-4"></div>
                        <p className="text-secondary">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <div className="empty-state-title">No products found</div>
                        <div className="empty-state-description">
                            {searchTerm || categoryFilter || stockFilter
                                ? 'Try adjusting your filters'
                                : isManager
                                    ? 'Create your first product to get started'
                                    : 'No products available yet'}
                        </div>
                    </div>
                ) : (
                    <div className="card card-padding">
                        <div className="overflow-x-auto -mx-8">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>SKU</th>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Unit</th>
                                        <th>Vendor</th>
                                        <th>Reorder Point</th>
                                        <th>Reorder Qty</th>
                                        {isManager && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id}>
                                            <td className="font-medium">{product.sku}</td>
                                            <td>
                                                <div>
                                                    <div className="font-medium text-[var(--text-primary)]">
                                                        {product.name}
                                                    </div>
                                                    {product.description && (
                                                        <div className="text-sm text-[var(--text-tertiary)] mt-1">
                                                            {product.description.substring(0, 50)}
                                                            {product.description.length > 50 ? '...' : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-neutral">{product.category}</span>
                                            </td>
                                            <td className="text-[var(--text-secondary)]">{product.unit}</td>
                                            <td className="text-[var(--text-secondary)]">
                                                {product.vendor?.name || 'N/A'}
                                            </td>
                                            <td className="text-[var(--text-secondary)]">{product.reorderPoint}</td>
                                            <td className="text-[var(--text-secondary)]">{product.reorderQty}</td>
                                            {isManager && (
                                                <td>
                                                    <button className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium text-sm">
                                                        Edit
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Create Product Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="card card-padding max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="heading-2">Create New Product</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleCreateProduct} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                            SKU *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="input"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                            Category *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="input"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                            Unit *
                                        </label>
                                        <select
                                            className="input"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        >
                                            <option value="pcs">Pieces</option>
                                            <option value="kg">Kilograms</option>
                                            <option value="ltr">Liters</option>
                                            <option value="box">Boxes</option>
                                            <option value="m">Meters</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                        Description
                                    </label>
                                    <textarea
                                        className="input"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                        Vendor
                                    </label>
                                    <select
                                        className="input"
                                        value={formData.vendor}
                                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                    >
                                        <option value="">Select Vendor</option>
                                        {partners.map(partner => (
                                            <option key={partner._id} value={partner._id}>
                                                {partner.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                            Reorder Point
                                        </label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={formData.reorderPoint}
                                            onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                            Reorder Quantity
                                        </label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={formData.reorderQty}
                                            onChange={(e) => setFormData({ ...formData, reorderQty: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="btn btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1"
                                    >
                                        Create Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
