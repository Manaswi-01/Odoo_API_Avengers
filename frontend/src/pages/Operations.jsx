

import Navbar from "../components/Navbar";

const Operations = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg h-96 p-8">
            <h2 className="text-2xl font-bold mb-6">Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-4 text-[var(--text-secondary)]">Stock Movements</h3>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded mb-2 hover:bg-indigo-700 transition">
                  Add Stock
                </button>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded mb-2 hover:bg-indigo-700 transition">
                  Remove Stock
                </button>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                  Transfer Stock
                </button>
              </div>
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-4 text-[var(--text-secondary)]">Quick Actions</h3>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded mb-2 hover:bg-green-700 transition">
                  New Product
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded mb-2 hover:bg-green-700 transition">
                  Inventory Count
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operations;
