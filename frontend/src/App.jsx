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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/move-history" element={<MoveHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/dashboard"
            element={
              <>
                <p>HOME PAGE NEEDS TO BE MADE</p>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
