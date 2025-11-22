import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { transactionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { isManager } = useAuth();

  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const filters = { type: 'Delivery' };
      if (statusFilter) filters.status = statusFilter;

      const data = await transactionsAPI.getAll(filters);
      setDeliveries(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Waiting': 'badge-warning',
      'Ready': 'badge-info',
      'Packed': 'badge-primary',
      'Done': 'badge-success',
      'Cancelled': 'badge-error'
    };
    return badges[status] || 'badge-neutral';
  };

  const groupByStatus = () => {
    const grouped = {
      'Waiting': [],
      'Ready': [],
      'Packed': [],
      'Done': []
    };

    deliveries.forEach(delivery => {
      if (grouped[delivery.status]) {
        grouped[delivery.status].push(delivery);
      }
    });

    return grouped;
  };

  const grouped = statusFilter ? { [statusFilter]: deliveries } : groupByStatus();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <div className="container-main section-spacing">
        {/* Header */}
        <div className="page-header flex items-start justify-between">
          <div>
            <h1 className="page-title">Deliveries</h1>
            <p className="page-description">
              Manage outbound shipments and customer orders
            </p>
          </div>
          <Link to="/operations/delivery/new" className="btn btn-primary">
            <span>+</span>
            New Delivery
          </Link>
        </div>

        {error && (
          <div className="card card-padding mb-6 border-l-4 border-red-500 bg-red-50 text-red-700">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="card card-padding mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${!statusFilter ? 'bg-[var(--primary-600)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                }`}
            >
              All
            </button>
            {['Waiting', 'Ready', 'Packed', 'Done'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === status ? 'bg-[var(--primary-600)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Deliveries by Status */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : Object.keys(grouped).length === 0 || deliveries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-title">No deliveries found</div>
            <div className="empty-state-description">
              Create your first delivery to get started
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([status, items]) => {
              if (items.length === 0 && !statusFilter) return null;

              return (
                <div key={status} className="card card-padding">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="heading-2">{status}</h2>
                    <span className={`badge ${getStatusBadge(status)}`}>
                      {items.length} {items.length === 1 ? 'delivery' : 'deliveries'}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-[var(--text-tertiary)] text-center py-8">
                      No deliveries in {status} status
                    </p>
                  ) : (
                    <div className="overflow-x-auto -mx-8">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Warehouse</th>
                            <th>Items</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((delivery) => (
                            <tr key={delivery._id}>
                              <td className="font-medium">{delivery.refNo}</td>
                              <td>{delivery.partnerId?.name || 'N/A'}</td>
                              <td>{delivery.warehouseId?.name || 'N/A'}</td>
                              <td>{delivery.lines?.length || 0}</td>
                              <td className="text-[var(--text-secondary)]">
                                {new Date(delivery.createdAt).toLocaleDateString()}
                              </td>
                              <td>
                                <Link
                                  to={`/operations/delivery/${delivery._id}`}
                                  className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryList;