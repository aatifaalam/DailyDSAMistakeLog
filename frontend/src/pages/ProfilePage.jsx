import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Calendar, 
  KeyRound, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  LogOut,
  FileSpreadsheet,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { DashboardService } from '../services/api';

const ProfilePage = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordServerError, setPasswordServerError] = useState('');

  // User Stats State
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
    const loadStats = async () => {
      try {
        const data = await DashboardService.getStats();
        setUserStats(data);
      } catch (e) {
        // stats optional
      }
    };
    loadStats();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileError('Full name cannot be blank.');
      return;
    }

    setProfileLoading(true);
    setProfileError('');

    try {
      await updateProfile({ name: name.trim() });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChangeInput = (e) => {
    const { name: fieldName, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [fieldName]: value }));
    if (passwordErrors[fieldName]) {
      setPasswordErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
    if (passwordServerError) {
      setPasswordServerError('');
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required.';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters.';
    }

    if (!passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Confirm your new password.';
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'New passwords do not match.';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setPasswordLoading(true);
    setPasswordServerError('');

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      addToast('Password changed successfully!', 'success');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      setPasswordServerError(err.message || 'Failed to change password. Please verify current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    addToast('You have been logged out.', 'info');
    navigate('/login', { replace: true });
  };

  const formattedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recently';

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: 'var(--lc-text-primary)', letterSpacing: '-0.01em' }}>
            Profile & Settings
          </h1>
          <p className="small mb-0" style={{ color: 'var(--lc-text-secondary)' }}>
            Manage your account credentials and view your practice activity metrics.
          </p>
        </div>

        <button
          className="btn btn-sm btn-lc-secondary d-inline-flex align-items-center gap-1 text-danger"
          onClick={handleLogout}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="row g-3">
        {/* Left Column: User Profile Card & Stats */}
        <div className="col-12 col-md-5">
          {/* User Identity Card */}
          <div className="lc-panel p-3 mb-3">
            <div className="d-flex align-items-center gap-3 pb-3 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle fw-bold"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: 'var(--lc-accent)',
                  color: '#1A1A1A',
                  fontSize: '1.2rem'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                  {user?.name || 'Developer'}
                </h2>
                <div className="d-flex align-items-center gap-1 text-muted small font-mono" style={{ fontSize: '0.75rem' }}>
                  <Mail size={12} />
                  <span>{user?.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
                <span className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                  <Shield size={13} style={{ color: 'var(--lc-accent)' }} />
                  Account Role
                </span>
                <span 
                  className="badge font-mono" 
                  style={{ 
                    backgroundColor: 'var(--lc-bg-card-hover)', 
                    color: 'var(--lc-text-primary)',
                    border: '1px solid var(--lc-border)',
                    fontSize: '0.72rem'
                  }}
                >
                  {user?.role || 'USER'}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
                <span className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                  <Calendar size={13} style={{ color: 'var(--lc-info)' }} />
                  Member Since
                </span>
                <span className="small font-mono text-muted" style={{ fontSize: '0.78rem' }}>
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* User Mistake Statistics */}
          <div className="lc-panel p-3 mb-3">
            <h2 className="h6 fw-semibold mb-2" style={{ color: 'var(--lc-text-primary)' }}>
              Mistake Statistics
            </h2>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'var(--lc-bg-main)' }}>
                <span className="small text-muted d-flex align-items-center gap-1">
                  <FileSpreadsheet size={13} /> Total Recorded
                </span>
                <span className="font-mono fw-bold" style={{ color: 'var(--lc-text-primary)' }}>
                  {userStats?.totalMistakes || 0}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'var(--lc-bg-main)' }}>
                <span className="small text-muted d-flex align-items-center gap-1">
                  <CheckCircle2 size={13} style={{ color: 'var(--lc-success)' }} /> Mastered / Reviewed
                </span>
                <span className="font-mono fw-bold" style={{ color: 'var(--lc-success)' }}>
                  {userStats?.reviewedCount || 0}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'var(--lc-bg-main)' }}>
                <span className="small text-muted d-flex align-items-center gap-1">
                  <BrainCircuit size={13} style={{ color: 'var(--lc-accent)' }} /> Awaiting Review
                </span>
                <span className="font-mono fw-bold" style={{ color: 'var(--lc-accent)' }}>
                  {userStats?.needsReviewCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Name & Change Password */}
        <div className="col-12 col-md-7">
          {/* Edit Profile Form */}
          <div className="lc-panel p-3 mb-3">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
              <UserIcon size={16} style={{ color: 'var(--lc-accent)' }} />
              <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                Personal Information
              </h2>
            </div>

            {profileError && (
              <div 
                className="p-2 mb-3 rounded d-flex align-items-center gap-2 small"
                style={{ backgroundColor: 'rgba(239, 71, 67, 0.15)', border: '1px solid var(--lc-error)', color: 'var(--lc-error)' }}
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="mb-2">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={profileLoading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                  Email Address <span className="text-muted fw-normal">(Account identifier, read-only)</span>
                </label>
                <input
                  type="email"
                  className="form-control form-control-sm text-muted"
                  style={{ backgroundColor: 'var(--lc-bg-main)', cursor: 'not-allowed' }}
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-sm btn-lc-primary d-inline-flex align-items-center gap-1"
                  disabled={profileLoading || name === user?.name}
                >
                  {profileLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="lc-panel p-3">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
              <KeyRound size={16} style={{ color: 'var(--lc-accent)' }} />
              <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                Security & Password
              </h2>
            </div>

            {passwordServerError && (
              <div 
                className="p-2 mb-3 rounded d-flex align-items-center gap-2 small"
                style={{ backgroundColor: 'rgba(239, 71, 67, 0.15)', border: '1px solid var(--lc-error)', color: 'var(--lc-error)' }}
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{passwordServerError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} noValidate>
              {/* Current Password */}
              <div className="mb-2">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                  Current Password
                </label>
                <div className="position-relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    className={`form-control form-control-sm pe-4 ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChangeInput}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-2 text-muted p-0 text-decoration-none"
                    onClick={() => setShowCurrentPassword(prev => !prev)}
                    tabIndex="-1"
                  >
                    {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <div className="invalid-feedback d-block small mt-1" style={{ fontSize: '0.72rem' }}>{passwordErrors.currentPassword}</div>
                )}
              </div>

              {/* New Password */}
              <div className="mb-2">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                  New Password
                </label>
                <div className="position-relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    className={`form-control form-control-sm pe-4 ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                    placeholder="At least 8 characters"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChangeInput}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-2 text-muted p-0 text-decoration-none"
                    onClick={() => setShowNewPassword(prev => !prev)}
                    tabIndex="-1"
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <div className="invalid-feedback d-block small mt-1" style={{ fontSize: '0.72rem' }}>{passwordErrors.newPassword}</div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="mb-3">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                  Confirm New Password
                </label>
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmNewPassword"
                    className={`form-control form-control-sm pe-4 ${passwordErrors.confirmNewPassword ? 'is-invalid' : ''}`}
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChangeInput}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-2 text-muted p-0 text-decoration-none"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {passwordErrors.confirmNewPassword && (
                  <div className="invalid-feedback d-block small mt-1" style={{ fontSize: '0.72rem' }}>{passwordErrors.confirmNewPassword}</div>
                )}
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-sm btn-lc-primary d-inline-flex align-items-center gap-1"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" />
                  ) : (
                    <KeyRound size={13} />
                  )}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
