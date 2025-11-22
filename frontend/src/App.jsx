import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import Dashboard from "./pages/Dashboard";
import Operations from "./pages/Operations";
import Stocks from "./pages/Stocks";
import MoveHistory from "./pages/MoveHistory";
import Settings from "./pages/Settings";
import Location from "./pages/Location";
import Warehouse from "./pages/Warehouse";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ReceiptList from './pages/ReceiptList';
import DeliveryList from './pages/DeliveryList';
import NewReceipt from './pages/NewReceipt';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgetPassword />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/operations" element={<ProtectedRoute><Operations /></ProtectedRoute>} />
                <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
                <Route path="/move-history" element={<ProtectedRoute><MoveHistory /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/location" element={<ProtectedRoute><Location /></ProtectedRoute>} />
                <Route path="/warehouse" element={<ProtectedRoute><Warehouse /></ProtectedRoute>} />
                <Route path="/operations/receipt" element={<ProtectedRoute><ReceiptList /></ProtectedRoute>} />
                <Route path="/operations/receipt/new" element={<ProtectedRoute><NewReceipt /></ProtectedRoute>} />
                <Route path="/operations/receipt/:id" element={<ProtectedRoute><ReceiptList /></ProtectedRoute>} />
                <Route path="/operations/delivery" element={<ProtectedRoute><DeliveryList /></ProtectedRoute>} />
                <Route path="/operations/delivery/:id" element={<ProtectedRoute><DeliveryList /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
