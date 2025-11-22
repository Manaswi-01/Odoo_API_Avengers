import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import logo from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData.email, formData.password);

      // Store user data and token
      const userData = {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      };

      login(userData, response.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          {/* Card Container */}
          <div className="card card-padding-lg animate-scale-in">
            {/* Header */}
            <div className="text-center mb-10">
              <img src={logo} alt="Logo" className="h-32 mx-auto mb-4" />
              <h1 className="heading-1 mb-3">Welcome Back</h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 px-6 py-4 rounded-xl border-2 animate-fade-in"
                style={{
                  backgroundColor: 'var(--error-light)',
                  borderColor: 'var(--error)',
                  color: 'var(--error-dark)'
                }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3"
                  style={{ color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3"
                  style={{ color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold transition-colors"
                  style={{ color: 'var(--primary-600)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-700)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-bold transition-colors"
                    style={{ color: 'var(--primary-600)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-700)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

