import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { transactionsAPI } from '../services/api';

const ReceiptList = () => {
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
      case 'Done': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Validated': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Receipts (Incoming Stock)</h2>
              <Link to="/operations/receipt/new">
                <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                  New Receipt
                </button>
              </Link>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="text-xl text-[var(--text-secondary)]">Loading receipts...</div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Error loading receipts: {error}
              </div>
            )}

            {!loading && !error && receipts.length === 0 && (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No receipts found. Create your first receipt to get started.
              </div>
            )}

            {!loading && !error && receipts.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                  <thead className="bg-[var(--bg-primary)]">
                    <tr>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Ref No</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Warehouse</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Status</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Items</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Created</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.map((receipt) => (
                      <tr key={receipt._id} className="hover:bg-[var(--hover-bg)] transition">
                        <td className="py-3 px-4 border-b border-[var(--border-color)] font-medium">
                          {receipt.refNo}
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {receipt.warehouseId?.name || 'N/A'}
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
                            {receipt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {receipt.lines?.length || 0} items
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {new Date(receipt.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          <button className="text-indigo-600 hover:text-indigo-400 transition">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptList;