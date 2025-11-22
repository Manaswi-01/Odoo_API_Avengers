import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { transactionsAPI } from '../services/api';

const ReceiptList = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await transactionsAPI.getAll();
      // Filter only Receipt type transactions
      const receiptData = data.filter(t => t.type === 'Receipt');
      setReceipts(receiptData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'badge-success';
      case 'Draft': return 'badge-neutral';
      case 'Counting': return 'badge-warning';
      case 'Validated': return 'badge-info';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <div className="container-main section-spacing">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Receipts</h1>
            <p className="page-description">Manage incoming stock and inventory receipts</p>
          </div>
          <Link to="/operations/receipt/new">
            <button className="btn btn-primary">
              <span>+</span>
              New Receipt
            </button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card card-padding text-center py-16 animate-pulse-slow">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)] text-lg">Loading receipts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card card-padding-sm bg-red-50 border-l-4 border-red-500 animate-slide-in">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-800">Error Loading Receipts</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && receipts.length === 0 && (
          <div className="card card-padding animate-fade-in">
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <div className="empty-state-title">No Receipts Found</div>
              <p className="empty-state-description">
                Create your first receipt to start tracking incoming inventory
              </p>
              <Link to="/operations/receipt/new" className="mt-6 inline-block">
                <button className="btn btn-primary">
                  <span>+</span>
                  Create First Receipt
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Receipts Table */}
        {!loading && !error && receipts.length > 0 && (
          <div className="card card-padding animate-fade-in">
            <div className="overflow-x-auto -mx-8">
              <table className="table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Warehouse</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt) => (
                    <tr key={receipt._id}>
                      <td>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {receipt.refNo}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏢</span>
                          <span>{receipt.warehouseId?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusColor(receipt.status)}`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📋</span>
                          <span className="font-medium">{receipt.lines?.length || 0}</span>
                          <span className="text-[var(--text-tertiary)] text-sm">items</span>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {new Date(receipt.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/operations/receipt/${receipt._id}`)}
                          className="btn btn-sm btn-ghost text-[var(--primary-600)] hover:text-[var(--primary-700)]"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              <div className="flex items-center justify-between text-sm">
                <p className="text-[var(--text-secondary)]">
                  Showing <span className="font-semibold text-[var(--text-primary)]">{receipts.length}</span> receipt{receipts.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={fetchReceipts}
                  className="btn btn-sm btn-ghost"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptList;