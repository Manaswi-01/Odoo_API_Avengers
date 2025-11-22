import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { warehousesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
  });

  const { isManager } = useAuth();

  useEffect(() => {
    if (!isManager) {
      setError("Access denied. Manager role required.");
      setLoading(false);
      return;
    }
    fetchWarehouses();
  }, [isManager]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await warehousesAPI.getAll();
      setWarehouses(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await warehousesAPI.create(formData);
      setFormData({ name: "", code: "", address: "" });
      fetchWarehouses();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to create warehouse");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) return;

    try {
      await warehousesAPI.delete(id);
      fetchWarehouses();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to delete warehouse");
    }
  };

  if (!isManager) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="container-main section-spacing">
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <div className="empty-state-title">Access Denied</div>
            <div className="empty-state-description">
              Manager role required to access warehouse settings
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Warehouse Management</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Warehouse Form */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-4 text-[var(--text-secondary)]">Add New Warehouse</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      placeholder="Enter warehouse name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      placeholder="Enter warehouse code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      placeholder="Enter warehouse address"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  >
                    Add Warehouse
                  </button>
                </form>
              </div>

              {/* Warehouse List */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-4 text-[var(--text-secondary)]">Warehouse List</h3>

                {loading ? (
                  <p className="text-[var(--text-secondary)] text-center py-4">Loading warehouses...</p>
                ) : warehouses.length === 0 ? (
                  <p className="text-[var(--text-secondary)] text-center py-4">
                    No warehouses added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {warehouses.map((warehouse) => (
                      <div
                        key={warehouse._id}
                        className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--bg-primary)]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-[var(--text-primary)]">
                              {warehouse.name}
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Code: {warehouse.code}
                            </p>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                              {warehouse.address || 'No address provided'}
                            </p>
                            {warehouse.locations && warehouse.locations.length > 0 && (
                              <p className="text-sm text-[var(--text-secondary)] mt-1">
                                Locations: {warehouse.locations.length}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(warehouse._id)}
                            className="text-red-600 hover:text-red-400 text-sm transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
