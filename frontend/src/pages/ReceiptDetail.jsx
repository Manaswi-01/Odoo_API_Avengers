import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { transactionsAPI, receiptsAPI, warehousesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReceiptDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isManager } = useAuth();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchReceipt();
    }, [id]);

    const fetchReceipt = async () => {
        try {
            setLoading(true);
            const data = await transactionsAPI.getById(id);
            setReceipt(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartCounting = async () => {
        try {
            setProcessing(true);
            const lines = receipt.lines.map(line => ({
                _id: line._id,
                doneQuantity: line.qty // Initialize with expected quantity
            }));
            await receiptsAPI.updateCount(id, lines);
            fetchReceipt();
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdateCount = async (lineId, doneQty) => {
        const updatedLines = receipt.lines.map(line => ({
            _id: line._id,
            doneQuantity: line._id === lineId ? doneQty : line.doneQuantity || line.qty
        }));

        try {
            await receiptsAPI.updateCount(id, updatedLines);
            fetchReceipt();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleValidate = async () => {
        if (!window.confirm('Validate this receipt? Stock will be updated.')) return;

        try {
            setProcessing(true);
            await receiptsAPI.validate(id);
            fetchReceipt();
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Draft': 'badge-neutral',
            'Counting': 'badge-warning',
            'Done': 'badge-success',
            'Validated': 'badge-info',
            'Cancelled': 'badge-danger'
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

    if (!receipt) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)]">
                <Navbar />
                <div className="container-main section-spacing">
                    <div className="empty-state">
                        <div className="empty-state-icon">❌</div>
                        <div className="empty-state-title">Receipt not found</div>
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
                <div className="page-header">
                    <button
                        onClick={() => navigate('/operations/receipt')}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors duration-200"
                    >
                        ← Back to Receipts
                    </button>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="page-title">{receipt.refNo}</h1>
                            <p className="page-description">Receipt Details and Product Lines</p>
                        </div>
                        <span className={`badge ${getStatusBadge(receipt.status)}`}>
                            {receipt.status}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="card card-padding mb-6 border-l-4 border-red-500 bg-red-50 text-red-700">
                        <p className="font-medium">{error}</p>
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
                                {receipt.warehouseId?.name || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1">
                                Vendor
                            </label>
                            <p className="font-medium text-[var(--text-primary)]">
                                {receipt.partnerId?.name || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1">
                                Created By
                            </label>
                            <p className="font-medium text-[var(--text-primary)]">
                                {receipt.createdBy?.name || 'N/A'}
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
                                    <th>Expected Qty</th>
                                    {receipt.status !== 'Draft' && <th>Done Qty</th>}
                                    <th>Location</th>
                                    {receipt.status === 'Counting' && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {receipt.lines.map((line) => (
                                    <tr key={line._id}>
                                        <td>
                                            <div className="font-medium">{line.productId?.name}</div>
                                            <div className="text-sm text-[var(--text-tertiary)]">
                                                {line.productId?.sku}
                                            </div>
                                        </td>
                                        <td>{line.qty}</td>
                                        {receipt.status !== 'Draft' && (
                                            <td>
                                                <span className={line.doneQuantity === line.qty ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                                                    {line.doneQuantity || 0}
                                                </span>
                                            </td>
                                        )}
                                        <td>{line.locationTo || 'N/A'}</td>
                                        {receipt.status === 'Counting' && (
                                            <td>
                                                <input
                                                    type="number"
                                                    className="input w-24"
                                                    value={line.doneQuantity || line.qty}
                                                    onChange={(e) => handleUpdateCount(line._id, parseInt(e.target.value))}
                                                    min="0"
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    {receipt.status === 'Draft' && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleStartCounting}
                                disabled={processing}
                                className="btn btn-primary"
                            >
                                {processing ? (
                                    <>
                                        <span className="spinner w-5 h-5 border-2"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span>▶</span>
                                        Start Counting
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {receipt.status === 'Counting' && isManager && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleValidate}
                                disabled={processing}
                                className="btn btn-primary"
                                style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 8px 24px 0 rgba(16, 185, 129, 0.35)'
                                }}
                            >
                                {processing ? (
                                    <>
                                        <span className="spinner w-5 h-5 border-2"></span>
                                        Validating...
                                    </>
                                ) : (
                                    <>
                                        <span>✓</span>
                                        Validate Receipt
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {receipt.status === 'Done' && (
                        <div className="card card-padding-sm bg-green-50 border-l-4 border-green-500 animate-fade-in">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <p className="font-semibold text-green-800">Receipt Validated</p>
                                    <p className="text-sm text-green-700 mt-1">
                                        Validated by <span className="font-medium">{receipt.validatedBy?.name}</span> on{' '}
                                        {new Date(receipt.validatedAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceiptDetail;
