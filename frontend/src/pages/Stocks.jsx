import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { stockAPI } from "../services/api";

const Stocks = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStockItems();
  }, []);

  const fetchStockItems = async () => {
    try {
      setLoading(true);
      const data = await stockAPI.getStockItems();
      setStockItems(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch stock items");
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity, reserved) => {
    const available = quantity - reserved;
    if (available <= 0) return { text: 'Out of Stock', color: 'text-red-600' };
    if (available < 20) return { text: 'Low Stock', color: 'text-orange-600' };
    return { text: 'In Stock', color: 'text-green-600' };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Stock Management</h2>
              <button 
                onClick={fetchStockItems}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
              >
                Refresh Stock
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="text-xl text-[var(--text-secondary)]">Loading stock items...</div>
              </div>
            )}

            {!loading && !error && stockItems.length === 0 && (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No stock items found. Start by receiving products into your warehouse.
              </div>
            )}

            {!loading && !error && stockItems.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                  <thead className="bg-[var(--bg-primary)]">
                    <tr>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Product</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">SKU</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Category</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Warehouse</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Location</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Quantity</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Reserved</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Available</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockItems.map((item) => {
                      const available = item.quantity - item.reserved;
                      const status = getStockStatus(item.quantity, item.reserved);
                      return (
                        <tr key={item._id} className="hover:bg-[var(--hover-bg)] transition">
                          <td className="py-3 px-4 border-b border-[var(--border-color)] font-medium">
                            {item.productId?.name || 'N/A'}
                          </td>
                          <td className="py-3 px-4 border-b border-[var(--border-color)]">
                            {item.productId?.sku || 'N/A'}
                          </td>
                          <td className="py-3 px-4 border-b border-[var(--border-color)]">
                            {item.productId?.category || 'N/A'}
                          </td>
                          <td className="py-3 px-4 border-b border-[var(--border-color)]">
                            {item.warehouseId?.name || 'N/A'}
                          </td>
                          <td className="py-3 px-4 border-b border-[var(--border-color)]">
                            {item.locationId || 'N/A'}
                          </td>
                          <td className="py-3 px-4 border-b border-[var(--border-color)] font-semibold">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 border-b border-[var(--border-color)]">
                            {item.reserved}
                          </td>
                          <td className="py-3 px-4 border-b border-[var(--border-color)] font-semibold">
                            {available}
                          </td>
                          <td className={`py-3 px-4 border-b border-[var(--border-color)] font-medium ${status.color}`}>
                            {status.text}
                          </td>
                        </tr>
                      );
                    })}
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

export default Stocks;
