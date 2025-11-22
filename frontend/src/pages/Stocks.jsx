

import Navbar from "../components/Navbar";

const Stocks = () => {
  const stockItems = [
    {
      id: 1,
      name: "Product A",
      sku: "SKU001",
      quantity: 150,
      location: "Warehouse A",
    },
    {
      id: 2,
      name: "Product B",
      sku: "SKU002",
      quantity: 45,
      location: "Warehouse B",
    },
    {
      id: 3,
      name: "Product C",
      sku: "SKU003",
      quantity: 200,
      location: "Warehouse A",
    },
    {
      id: 4,
      name: "Product D",
      sku: "SKU004",
      quantity: 12,
      location: "Warehouse C",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Stock Management</h2>
              <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                Add New Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                <thead className="bg-[var(--bg-primary)]">
                  <tr>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">ID</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Product Name</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">SKU</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Quantity</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Location</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--hover-bg)] transition">
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{item.id}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{item.name}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{item.sku}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{item.quantity}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{item.location}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">
                        <button className="text-indigo-600 hover:text-indigo-400 mr-2 transition">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-400 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stocks;
