import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP & new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(response.message);
      setTimeout(() => {
        setStep(2);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword(email, otp, newPassword);
      setSuccess(response.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Password reset failed. Please try again.");
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
              <h1 className="heading-1 mb-3">Reset Password</h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {step === 1
                  ? "Enter your email to receive a verification code"
                  : "Enter the OTP and create a new password"}
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${step === 1
                  ? 'bg-gradient-primary text-white scale-110'
                  : 'text-white'
                }`} style={{ backgroundColor: step >= 1 ? 'var(--primary-600)' : 'var(--border-color)' }}>
                1
              </div>
              <div className="w-16 h-1 rounded-full transition-all duration-300"
                style={{ backgroundColor: step === 2 ? 'var(--primary-600)' : 'var(--border-color)' }}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${step === 2
                  ? 'bg-gradient-primary text-white scale-110'
                  : ''
                }`} style={{
                  backgroundColor: step === 2 ? 'var(--primary-600)' : 'var(--border-color)',
                  color: step === 2 ? 'white' : 'var(--text-tertiary)'
                }}>
                2
              </div>
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

            {/* Success Message */}
            {success && (
              <div className="mb-6 px-6 py-4 rounded-xl border-2 animate-fade-in"
                style={{
                  backgroundColor: 'var(--success-light)',
                  borderColor: 'var(--success)',
                  color: 'var(--success-dark)'
                }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✓</span>
                  <span className="font-medium">{success}</span>
                </div>
              </div>
            )}

            {/* Forms */}
            {step === 1 ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6 animate-fade-in">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>

                <div className="text-center pt-4">
                  <Link
                    to="/login"
                    className="text-sm font-semibold transition-colors"
                    style={{ color: 'var(--primary-600)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-700)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
                  >
                    ← Back to sign in
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold mb-3"
                    style={{ color: 'var(--text-secondary)' }}>
                    Verification Code
                  </label>
                  <input
                    name="otp"
                    type="text"
                    required
                    className="input"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3"
                    style={{ color: 'var(--text-secondary)' }}>
                    New Password
                  </label>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    className="input"
                    placeholder="Create new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3"
                    style={{ color: 'var(--text-secondary)' }}>
                    Confirm New Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                      <span>Resetting password...</span>
                    </div>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                      setSuccess("");
                    }}
                    className="text-sm font-semibold transition-colors"
                    style={{ color: 'var(--primary-600)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-700)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
                  >
                    ← Back to email entry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

