import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { dashboardAPI, transactionsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, transactionsData] = await Promise.all([
        dashboardAPI.getStats(),
        transactionsAPI.getAll()
      ]);
      setStats(statsData);
      setRecentTransactions(transactionsData.slice(0, 5));
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Done': 'badge-success',
      'Draft': 'badge-neutral',
      'Validated': 'badge-info',
      'Cancelled': 'badge-danger'
    };
    return `badge ${badges[status] || 'badge-neutral'}`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <div className="container-main section-spacing">
        {/* Header */}
        <div className="page-header flex items-start justify-between">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-description">
              Welcome back, {user?.name}. Here's your inventory overview.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="btn btn-secondary"
            disabled={loading}
          >
            <span>↻</span>
            Refresh
          </button>
        </div>

        {error && (
          <div className="card card-padding mb-6 border-l-4 border-red-500 bg-red-50 text-red-700">
            <p className="font-medium">Error loading dashboard</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner mb-4"></div>
            <p className="text-secondary">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {user?.role === 'Manager' && (
                <>
                  <div className="stat-card">
                    <div className="stat-label">Total Products</div>
                    <div className="stat-value">{stats.totalProducts}</div>
                    <div className="stat-description">Products in catalog</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Low Stock Items</div>
                    <div className="stat-value text-orange-600">{stats.lowStockCount}</div>
                    <div className="stat-description">Need reordering</div>
                  </div>
                </>
              )}

              <div className="stat-card">
                <div className="stat-label">Pending Receipts</div>
                <div className="stat-value text-green-600">{stats.pendingReceipts}</div>
                <div className="stat-description">Awaiting processing</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Pending Deliveries</div>
                <div className="stat-value text-blue-600">{stats.pendingDeliveries}</div>
                <div className="stat-description">Ready to ship</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Link to="/operations/receipt/new" className="card card-padding text-center card-hover">
                <div className="text-3xl mb-3">📥</div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">New Receipt</h3>
                <p className="text-sm text-[var(--text-tertiary)]">Receive incoming stock</p>
              </Link>

              <Link to="/operations/delivery" className="card card-padding text-center card-hover">
                <div className="text-3xl mb-3">📤</div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">New Delivery</h3>
                <p className="text-sm text-[var(--text-tertiary)]">Ship outgoing stock</p>
              </Link>

              <Link to="/stocks" className="card card-padding text-center card-hover">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">View Stocks</h3>
                <p className="text-sm text-[var(--text-tertiary)]">Check inventory levels</p>
              </Link>

              <Link to="/move-history" className="card card-padding text-center card-hover">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">Move History</h3>
                <p className="text-sm text-[var(--text-tertiary)]">View stock movements</p>
              </Link>
            </div>

            {/* Recent Transactions */}
            <div className="card card-padding">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-2">Recent Transactions</h2>
                <Link to="/move-history" className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium text-sm">
                  View All →
                </Link>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-title">No recent transactions</div>
                  <div className="empty-state-description">
                    Transactions will appear here once you start processing inventory
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-8">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Type</th>
                        <th>Warehouse</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction._id}>
                          <td className="font-medium">{transaction.refNo}</td>
                          <td>
                            <span className="text-[var(--text-secondary)]">
                              {transaction.type}
                            </span>
                          </td>
                          <td>{transaction.warehouseId?.name || 'N/A'}</td>
                          <td>
                            <span className={getStatusBadge(transaction.status)}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="text-[var(--text-secondary)]">
                            {transaction.lines?.length || 0} items
                          </td>
                          <td className="text-[var(--text-tertiary)]">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
