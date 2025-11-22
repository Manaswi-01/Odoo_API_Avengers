import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { transactionsAPI, deliveriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DeliveryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isManager } = useAuth();
    const [delivery, setDelivery] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchDelivery();
    }, [id]);

    const fetchDelivery = async () => {
        try {
            setLoading(true);
            const data = await transactionsAPI.getById(id);
            setDelivery(data);

            // Auto-check availability for Waiting status
            if (data.status === 'Waiting') {
                checkAvailability();
            }

            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        try {
            const result = await deliveriesAPI.checkAvailability(id);
            setAvailability(result.availabilityCheck);
            // Refresh to get updated status
            if (result.status === 'Ready') {
                fetchDelivery();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleMarkAsPacked = async () => {
        try {
            setProcessing(true);
            await deliveriesAPI.markAsPacked(id);
            fetchDelivery();
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleValidate = async () => {
        if (!window.confirm('Validate this delivery? Stock will be deducted.')) return;

        try {
            setProcessing(true);
            await deliveriesAPI.validate(id);
            fetchDelivery();
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Waiting': 'badge-warning',
            'Ready': 'badge-info',
            'Packed': 'badge-primary',
            'Done': 'badge-success'
        };
        return badges[status] || 'badge-neutral';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)]">
                <Navbar />
                <div className="container-main section-spacing flex justify-center items-center">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!delivery) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)]">
                <Navbar />
                <div className="container-main section-spacing">
                    <div className="empty-state">
                        <div className="empty-state-icon">❌</div>
                        <div className="empty-state-title">Delivery not found</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navbar />

            <div className="container-main section-spacing">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <button
                            onClick={() => navigate('/operations/delivery')}
                            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-2"
                        >
                            ← Back to Deliveries
                        </button>
                        <h1 className="page-title">{delivery.refNo}</h1>
                        <p className="page-description">Delivery Details</p>
                    </div>
                    <span className={`badge ${getStatusBadge(delivery.status)}`}>
                        {delivery.status}
                    </span>
                </div>

                {error && (
                    <div className="card card-padding mb-6 border-l-4 border-red-500 bg-red-50 text-red-700">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {/* Availability Alert */}
                {availability && !availability.allAvailable && (
                    <div className="card card-padding mb-6 border-l-4 border-orange-500 bg-orange-50 text-orange-700">
                        <p className="font-medium">⚠️ Insufficient stock for some items</p>
                    </div>
                )}

                {/* Info Card */}
                <div className="card card-padding mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1">
                                Warehouse
                            </label>
                            <p className="font-medium text-[var(--text-primary)]">
                                {delivery.warehouseId?.name || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1">
                                Customer
                            </label>
                            <p className="font-medium text-[var(--text-primary)]">
                                {delivery.partnerId?.name || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1">
                                Created By
                            </label>
                            <p className="font-medium text-[var(--text-primary)]">
                                {delivery.createdBy?.name || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lines */}
                <div className="card card-padding mb-6">
                    <h2 className="heading-2 mb-4">Products</h2>
                    <div className="overflow-x-auto -mx-8">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Location</th>
                                    {availability && <th>Available</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {delivery.lines.map((line, idx) => (
                                    <tr key={line._id}>
                                        <td>
                                            <div className="font-medium">{line.productId?.name}</div>
                                            <div className="text-sm text-[var(--text-tertiary)]">
                                                {line.productId?.sku}
                                            </div>
                                        </td>
                                        <td>{line.qty}</td>
                                        <td>{line.locationFrom || 'N/A'}</td>
                                        {availability && (
                                            <td>
                                                {availability.items[idx]?.sufficient ? (
                                                    <span className="text-green-600 font-medium">
                                                        ✓ {availability.items[idx].available}
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 font-medium">
                                                        ✗ {availability.items[idx]?.available || 0}
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {delivery.status === 'Waiting' && availability && (
                        <div className="card card-padding bg-blue-50 border-blue-200 flex-1">
                            <p className="text-blue-800">
                                {availability.allAvailable
                                    ? '✓ All items available - Status updated to Ready'
                                    : '⚠️ Waiting for stock availability'}
                            </p>
                        </div>
                    )}

                    {delivery.status === 'Ready' && (
                        <button
                            onClick={handleMarkAsPacked}
                            disabled={processing}
                            className="btn btn-primary"
                        >
                            {processing ? 'Processing...' : 'Mark as Packed'}
                        </button>
                    )}

                    {delivery.status === 'Packed' && (
                        <button
                            onClick={handleValidate}
                            disabled={processing}
                            className="btn btn-success"
                        >
                            {processing ? 'Validating...' : 'Validate Delivery'}
                        </button>
                    )}

                    {delivery.status === 'Done' && (
                        <div className="card card-padding bg-green-50 border-green-200">
                            <p className="text-green-800 font-medium">
                                ✓ Delivery validated by {delivery.validatedBy?.name} on{' '}
                                {new Date(delivery.validatedAt).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryDetail;
