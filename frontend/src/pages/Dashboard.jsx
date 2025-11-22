

import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg h-96 p-8">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-2 text-[var(--text-secondary)]">Total Products</h3>
                <p className="text-3xl font-bold">1,234</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-2 text-[var(--text-secondary)]">Low Stock</h3>
                <p className="text-3xl font-bold">23</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-2 text-[var(--text-secondary)]">Recent Moves</h3>
                <p className="text-3xl font-bold">56</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
