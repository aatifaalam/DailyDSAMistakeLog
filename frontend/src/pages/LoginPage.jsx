import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const successNotice = location.state?.message || '';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password
      });

      addToast('Welcome back! Successfully authenticated.', 'success');
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{ backgroundColor: 'var(--lc-bg-main)' }}
    >
      <div className="w-100" style={{ maxWidth: '380px' }}>
        {/* LeetCode Developer Brand Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center mb-2">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.125 3H7.875C5.18261 3 3 5.18261 3 7.875V16.125C3 18.8174 5.18261 21 7.875 21H16.125C18.8174 21 21 18.8174 21 16.125V7.875C21 5.18261 18.8174 3 16.125 3Z" stroke="#FFA116" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 8L6.5 10.5C5.67157 11.3284 5.67157 12.6716 6.5 13.5L9 16" stroke="#EEEEEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 8L17.5 10.5C18.3284 11.3284 18.3284 12.6716 17.5 13.5L15 16" stroke="#FFA116" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="h5 fw-bold mb-1" style={{ color: 'var(--lc-text-primary)', letterSpacing: '-0.02em' }}>
            Daily DSA Mistake Log
          </h1>
          <p className="small mb-0" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.8rem' }}>
            Sign in to your algorithmic mistake workspace
          </p>
        </div>

        {/* Success banner if redirected from registration */}
        {successNotice && (
          <div 
            className="p-2 mb-3 rounded d-flex align-items-center gap-2 small"
            style={{ backgroundColor: 'rgba(44, 187, 93, 0.15)', border: '1px solid var(--lc-success)', color: 'var(--lc-success)' }}
          >
            <CheckCircle2 size={16} className="flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Server error alert */}
        {serverError && (
          <div 
            className="p-2 mb-3 rounded d-flex align-items-center gap-2 small"
            style={{ backgroundColor: 'rgba(239, 71, 67, 0.15)', border: '1px solid var(--lc-error)', color: 'var(--lc-error)' }}
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Login Panel */}
        <div className="lc-panel p-4 shadow-sm">
          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="mb-3">
              <label 
                htmlFor="login-email" 
                className="form-label small mb-1" 
                style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}
              >
                Email Address
              </label>
              <div className="position-relative">
                <span 
                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"
                  style={{ pointerEvents: 'none' }}
                >
                  <Mail size={15} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className={`form-control form-control-sm ps-5 ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                  autoFocus
                />
              </div>
              {errors.email && (
                <div className="invalid-feedback d-block small mt-1" style={{ fontSize: '0.72rem' }}>{errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label 
                  htmlFor="login-password" 
                  className="form-label small mb-0" 
                  style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}
                >
                  Password
                </label>
              </div>
              <div className="position-relative">
                <span 
                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"
                  style={{ pointerEvents: 'none' }}
                >
                  <Lock size={15} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-control form-control-sm ps-5 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-muted p-0 text-decoration-none"
                  onClick={() => setShowPassword(prev => !prev)}
                  tabIndex="-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback d-block small mt-1" style={{ fontSize: '0.72rem' }}>{errors.password}</div>
              )}
            </div>

            {/* Submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-sm btn-lc-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-3 pt-3 border-top text-center" style={{ borderColor: 'var(--lc-border)' }}>
            <span className="small text-muted" style={{ fontSize: '0.8rem' }}>Don't have an account? </span>
            <Link 
              to="/register" 
              className="small fw-semibold text-decoration-none"
              style={{ color: 'var(--lc-accent)', fontSize: '0.8rem' }}
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="text-center mt-3">
          <div className="small text-muted font-mono" style={{ fontSize: '0.72rem' }}>
            Stateless JWT authentication & BCrypt hash
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
