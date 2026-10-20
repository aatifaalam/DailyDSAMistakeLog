import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      try {
        await login({
          email: formData.email.trim(),
          password: formData.password
        });
        addToast('Account created successfully! Welcome to Daily DSA Mistake Log.', 'success');
        navigate('/', { replace: true });
      } catch (loginErr) {
        navigate('/login', {
          state: { message: 'Account created successfully! Please sign in with your credentials.' },
          replace: true
        });
      }
    } catch (err) {
      if (err.validationErrors) {
        setErrors(err.validationErrors);
      }
      setServerError(err.message || 'Registration failed. Please check the entered fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{ backgroundColor: 'var(--lc-bg-main)' }}
    >
      <div className="w-100" style={{ maxWidth: '400px' }}>
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
            Create an account to track your algorithmic blind spots
          </p>
        </div>

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

        {/* Registration Panel */}
        <div className="lc-panel p-4 shadow-sm">
          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="mb-2">
              <label 
                htmlFor="register-name" 
                className="form-label small mb-1" 
                style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}
              >
                Full Name
              </label>
              <div className="position-relative">
                <span 
                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"
                  style={{ pointerEvents: 'none' }}
                >
                  <User size={15} />
                </span>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  className={`form-control form-control-sm ps-5 ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  disabled={loading}
                  autoFocus
                />
              </div>
              {errors.name && (
                <div className="invalid-feedback d-block small mt-1" style={{ fontSize: '0.72rem' }}>{errors.name}</div>
              )}
            </div>

            {/* Email Address */}
            <div className="mb-2">
              <label 
                htmlFor="register-email" 
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
                  id="register-email"
                  type="email"
                  name="email"
                  className={`form-control form-control-sm ps-5 ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <div className="invalid-feedback d-block small mt-1" style={{ fontSize: '0.72rem' }}>{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <label 
                htmlFor="register-password" 
                className="form-label small mb-1" 
                style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}
              >
                Password
              </label>
              <div className="position-relative">
                <span 
                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"
                  style={{ pointerEvents: 'none' }}
                >
                  <Lock size={15} />
                </span>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-control form-control-sm ps-5 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="mb-3">
              <label 
                htmlFor="register-confirm-password" 
                className="form-label small mb-1" 
                style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}
              >
                Confirm Password
              </label>
              <div className="position-relative">
                <span 
                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"
                  style={{ pointerEvents: 'none' }}
                >
                  <ShieldCheck size={15} />
                </span>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-control form-control-sm ps-5 pe-5 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-muted p-0 text-decoration-none"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  tabIndex="-1"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="invalid-feedback d-block small mt-1" style={{ fontSize: '0.72rem' }}>{errors.confirmPassword}</div>
              )}
            </div>

            {/* Password Requirement Hint */}
            <div 
              className="mb-3 p-2 rounded" 
              style={{ backgroundColor: 'var(--lc-bg-main)', border: '1px solid var(--lc-border)' }}
            >
              <div className="d-flex align-items-center gap-1 mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                <CheckCircle size={13} style={{ color: 'var(--lc-accent)' }} />
                <span className="fw-medium">Password Requirements</span>
              </div>
              <ul className="mb-0 text-muted ps-3 font-mono" style={{ fontSize: '0.72rem' }}>
                <li style={{ color: formData.password.length >= 8 ? 'var(--lc-success)' : undefined }}>
                  Min 8 characters
                </li>
                <li style={{ color: (formData.password && formData.password === formData.confirmPassword) ? 'var(--lc-success)' : undefined }}>
                  Passwords match
                </li>
              </ul>
            </div>

            {/* Submit button */}
            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-sm btn-lc-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-3 pt-3 border-top text-center" style={{ borderColor: 'var(--lc-border)' }}>
            <span className="small text-muted" style={{ fontSize: '0.8rem' }}>Already have an account? </span>
            <Link 
              to="/login" 
              className="small fw-semibold text-decoration-none"
              style={{ color: 'var(--lc-accent)', fontSize: '0.8rem' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
