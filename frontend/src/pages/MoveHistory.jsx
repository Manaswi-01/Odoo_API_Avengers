import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Inventory Management</h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link
                  to="/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/operations"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Operations
                </Link>
                <Link
                  to="/stocks"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Stocks
                </Link>
                <Link
                  to="/move-history"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Move History
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <Link
                to="/settings"
                className="text-gray-500 hover:text-gray-700"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Move History</h2>
              <button className="bg-indigo-600 text-white py-2 px-4 rounded">
                Export History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Product</th>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Quantity</th>
                    <th className="py-2 px-4 border-b">From</th>
                    <th className="py-2 px-4 border-b">To</th>
                    <th className="py-2 px-4 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {moveHistory.map((move) => (
                    <tr key={move.id}>
                      <td className="py-2 px-4 border-b">{move.id}</td>
                      <td className="py-2 px-4 border-b">{move.product}</td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            move.type === "In"
                              ? "bg-green-100 text-green-800"
                              : move.type === "Out"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {move.type}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{move.quantity}</td>
                      <td className="py-2 px-4 border-b">{move.from}</td>
                      <td className="py-2 px-4 border-b">{move.to}</td>
                      <td className="py-2 px-4 border-b">{move.date}</td>
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
