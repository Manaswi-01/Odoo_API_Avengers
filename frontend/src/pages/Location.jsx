import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { warehousesAPI } from "../services/api";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    locationId: "",
    warehouseId: "",
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await warehousesAPI.getAll();
      setWarehouses(data);
      
      // Extract all locations from all warehouses
      const allLocations = [];
      data.forEach(warehouse => {
        if (warehouse.locations && warehouse.locations.length > 0) {
          warehouse.locations.forEach(loc => {
            allLocations.push({
              ...loc,
              warehouseName: warehouse.name,
              warehouseCode: warehouse.code,
              warehouseId: warehouse._id
            });
          });
        }
      });
      setLocations(allLocations);
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
      const selectedWarehouse = warehouses.find(wh => wh._id === formData.warehouseId);
      if (!selectedWarehouse) {
        setError("Please select a warehouse");
        return;
      }

      // Add location to warehouse
      const newLocation = {
        locationId: formData.locationId,
        name: formData.name,
        code: formData.code
      };

      const updatedLocations = [...(selectedWarehouse.locations || []), newLocation];
      
      await warehousesAPI.update(formData.warehouseId, {
        ...selectedWarehouse,
        locations: updatedLocations
      });

      setFormData({ name: "", code: "", locationId: "", warehouseId: "" });
      fetchWarehouses();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add location");
    }
  };

  const handleDelete = async (warehouseId, locationId) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    
    try {
      const warehouse = warehouses.find(wh => wh._id === warehouseId);
      if (!warehouse) return;

      const updatedLocations = warehouse.locations.filter(loc => loc.locationId !== locationId);
      
      await warehousesAPI.update(warehouseId, {
        ...warehouse,
        locations: updatedLocations
      });

      fetchWarehouses();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to delete location");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Location Management</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Location Form */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-4 text-[var(--text-secondary)]">Add New Location</h3>
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
                      placeholder="Enter location name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Location ID *
                    </label>
                    <input
                      type="text"
                      name="locationId"
                      value={formData.locationId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      placeholder="Enter location ID (e.g., LOC-001)"
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
                      placeholder="Enter location code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Warehouse *
                    </label>
                    <select
                      name="warehouseId"
                      value={formData.warehouseId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="">Select a warehouse</option>
                      {warehouses.map((warehouse) => (
                        <option key={warehouse._id} value={warehouse._id}>
                          {warehouse.name} ({warehouse.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  >
                    Add Location
                  </button>
                </form>
              </div>

              {/* Location List */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-4 text-[var(--text-secondary)]">Location List</h3>
                
                {loading ? (
                  <p className="text-[var(--text-secondary)] text-center py-4">Loading locations...</p>
                ) : locations.length === 0 ? (
                  <p className="text-[var(--text-secondary)] text-center py-4">
                    No locations added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {locations.map((location) => (
                      <div
                        key={`${location.warehouseId}-${location.locationId}`}
                        className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--bg-primary)]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-[var(--text-primary)]">
                              {location.name}
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              ID: {location.locationId} | Code: {location.code}
                            </p>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                              Warehouse: {location.warehouseName} ({location.warehouseCode})
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(location.warehouseId, location.locationId)}
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

export default Location;
