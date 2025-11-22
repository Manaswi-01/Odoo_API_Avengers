import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Staff"
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.signup(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

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
      setError(err.message || "Signup failed. Please try again.");
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
              <h1 className="heading-1 mb-3">Create Account</h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Join us and start managing your inventory
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
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3"
                  style={{ color: 'var(--text-secondary)' }}>
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3"
                  style={{ color: 'var(--text-secondary)' }}>
                  Role
                </label>
                <select
                  name="role"
                  required
                  className="input"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Staff">Staff</option>
                  <option value="Manager">Manager</option>
                </select>
                <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  {formData.role === 'Manager'
                    ? '✓ Full access: Create/edit products, validate receipts, approve adjustments'
                    : '✓ Standard access: View products, count receipts, pick deliveries'}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-8"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold transition-colors"
                    style={{ color: 'var(--primary-600)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-700)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
                  >
                    Sign in
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

export default Signup;

