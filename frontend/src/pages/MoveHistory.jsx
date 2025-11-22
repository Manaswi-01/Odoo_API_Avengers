

import Navbar from "../components/Navbar";

const MoveHistory = () => {
  const moveHistory = [
    {
      id: 1,
      product: "Product A",
      type: "In",
      quantity: 50,
      from: "Supplier",
      to: "Warehouse A",
      date: "2024-01-15",
    },
    {
      id: 2,
      product: "Product B",
      type: "Out",
      quantity: 25,
      from: "Warehouse B",
      to: "Customer",
      date: "2024-01-14",
    },
    {
      id: 3,
      product: "Product C",
      type: "Transfer",
      quantity: 30,
      from: "Warehouse A",
      to: "Warehouse B",
      date: "2024-01-13",
    },
    {
      id: 4,
      product: "Product A",
      type: "In",
      quantity: 100,
      from: "Supplier",
      to: "Warehouse A",
      date: "2024-01-12",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Move History</h2>
              <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                Export History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                <thead className="bg-[var(--bg-primary)]">
                  <tr>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">ID</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Product</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Type</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Quantity</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">From</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">To</th>
                    <th className="py-2 px-4 border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {moveHistory.map((move) => (
                    <tr key={move.id} className="hover:bg-[var(--hover-bg)] transition">
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{move.id}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{move.product}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${move.type === "In"
                            ? "bg-green-100 text-green-800"
                            : move.type === "Out"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {move.type}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{move.quantity}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{move.from}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{move.to}</td>
                      <td className="py-2 px-4 border-b border-[var(--border-color)]">{move.date}</td>
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

export default MoveHistory;
