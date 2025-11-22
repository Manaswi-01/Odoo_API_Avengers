import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { stockAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const MoveHistory = () => {
  const [moveHistory, setMoveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const { isManager } = useAuth();

  useEffect(() => {
    fetchMoveHistory();
  }, [filter]);

  const fetchMoveHistory = async () => {
    try {
      setLoading(true);
      const filters = filter !== "all" ? { type: filter } : {};
      const data = await stockAPI.getStockLedger(filters);
      setMoveHistory(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch move history");
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Receipt": return "bg-green-100 text-green-800";
      case "Delivery": return "bg-red-100 text-red-800";
      case "Transfer": return "bg-blue-100 text-blue-800";
      case "Adjustment": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Move History (Stock Ledger)</h2>
              <div className="flex gap-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                >
                  <option value="all">All Types</option>
                  <option value="Receipt">Receipts</option>
                  <option value="Delivery">Deliveries</option>
                  <option value="Transfer">Transfers</option>
                  <option value="Adjustment">Adjustments</option>
                </select>
                <button
                  onClick={fetchMoveHistory}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                >
                  Refresh
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="text-xl text-[var(--text-secondary)]">Loading move history...</div>
              </div>
            )}

            {!loading && !error && moveHistory.length === 0 && (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No move history found. Stock movements will appear here once you process transactions.
              </div>
            )}

            {!loading && !error && moveHistory.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                  <thead className="bg-[var(--bg-primary)]">
                    <tr>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Date</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Type</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Product</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Warehouse</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Location</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Change</th>
                      {isManager && <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Balance</th>}
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">User</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moveHistory.map((move) => (
                      <tr key={move._id} className="hover:bg-[var(--hover-bg)] transition">
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {new Date(move.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(move.type)}`}>
                            {move.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {move.productId?.name || 'N/A'}
                          <div className="text-xs text-[var(--text-secondary)]">
                            {move.productId?.sku || ''}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {move.warehouseId?.name || 'N/A'}
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {move.locationId || 'N/A'}
                        </td>
                        <td className={`py-3 px-4 border-b border-[var(--border-color)] font-semibold ${move.qtyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {move.qtyChange > 0 ? '+' : ''}{move.qtyChange}
                        </td>
                        {isManager && (
                          <td className="py-3 px-4 border-b border-[var(--border-color)] font-semibold">
                            {move.balanceAfter}
                          </td>
                        )}
                        <td className="py-3 px-4 border-b border-[var(--border-color)]">
                          {move.userId?.name || 'System'}
                        </td>
                        <td className="py-3 px-4 border-b border-[var(--border-color)] text-sm">
                          {move.note || '-'}
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

export default MoveHistory;
