import Navbar from "../components/Navbar";
import { useState } from "react";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    shortCode: "",
    warehouse: "",
  });

  // Mock warehouses data - in real app, this would come from your backend
  const warehouses = [
    { id: "1", name: "Main Warehouse", shortCode: "MW" },
    { id: "2", name: "Secondary Warehouse", shortCode: "SW" },
    { id: "3", name: "Regional Storage", shortCode: "RS" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedWarehouse = warehouses.find(
      (wh) => wh.id === formData.warehouse
    );
    const newLocation = {
      id: Date.now(),
      ...formData,
      warehouseName: selectedWarehouse ? selectedWarehouse.name : "",
    };
    setLocations([...locations, newLocation]);
    setFormData({ name: "", shortCode: "", warehouse: "" });
    console.log("Location added:", newLocation);
  };

  const handleDelete = (id) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Location Management</h2>

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
                      Short Code *
                    </label>
                    <input
                      type="text"
                      name="shortCode"
                      value={formData.shortCode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      placeholder="Enter short code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Warehouse *
                    </label>
                    <select
                      name="warehouse"
                      value={formData.warehouse}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="">Select a warehouse</option>
                      {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} ({warehouse.shortCode})
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
                {locations.length === 0 ? (
                  <p className="text-[var(--text-secondary)] text-center py-4">
                    No locations added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--bg-primary)]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-[var(--text-primary)]">
                              {location.name}
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Code: {location.shortCode}
                            </p>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                              Warehouse: {location.warehouseName}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(location.id)}
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
