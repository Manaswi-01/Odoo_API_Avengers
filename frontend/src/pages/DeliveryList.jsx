import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { transactionsAPI } from '../services/api';

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const data = await transactionsAPI.getAll();
      // Filter only Delivery type transactions
      const deliveryData = data.filter(t => t.type === 'Delivery');
      setDeliveries(deliveryData);
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
              <h2 className="text-2xl font-bold">Deliveries (Outgoing Stock)</h2>
              <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                New Delivery
              </button>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="text-xl text-[var(--text-secondary)]">Loading deliveries...</div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Error loading deliveries: {error}
              </div>
            )}

            {!loading && !error && deliveries.length === 0 && (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No deliveries found. Create your first delivery to get started.
              </div>
            )}

            {!loading && !error && deliveries.length > 0 && (
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
                    {deliveries.map((delivery) => (
                      <tr key={delivery._id} className="hover:bg-[var(--hover-bg)] transition">
                        <td className="py-3 px-4 border-b border-[var(--border-color)] font-medium">
                          {delivery.refNo}
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {delivery.warehouseId?.name || 'N/A'}
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                            {delivery.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {delivery.lines?.length || 0} items
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {new Date(delivery.createdAt).toLocaleDateString()}
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

export default DeliveryList;