import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ReceiptList from './pages/ReceiptList';
import DeliveryList from './pages/DeliveryList';
import NewReceipt from './pages/NewReceipt';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/stocks" element={<Stocks />} />
              <Route path="/move-history" element={<MoveHistory />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/location" element={<Location />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/operations/receipt" element={<ReceiptList />} />
  <Route path="/operations/receipt/new" element={<NewReceipt />} />
  <Route path="/operations/receipt/:id" element={<ReceiptList />} /> {/* optional detail route or make separate component */}
  <Route path="/operations/delivery" element={<DeliveryList />} />
  <Route path="/operations/delivery/:id" element={<DeliveryList />} />

            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
