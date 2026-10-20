import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code2, 
  PlusCircle, 
  BarChart3, 
  CheckSquare,
  BookOpen,
  User,
  LogOut,
  X,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('You have been logged out safely.', 'info');
    navigate('/login', { replace: true });
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75 d-lg-none"
          style={{ zIndex: 1019 }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
        {/* Brand Header */}
        <div 
          className="px-3 py-3 border-bottom d-flex align-items-center justify-content-between" 
          style={{ borderColor: 'var(--lc-border)', height: 'var(--topbar-height)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <div 
              className="d-flex align-items-center justify-content-center rounded"
              style={{ 
                width: '26px', 
                height: '26px', 
                backgroundColor: 'rgba(255, 161, 22, 0.15)', 
                color: 'var(--lc-accent)',
                border: '1px solid rgba(255, 161, 22, 0.3)'
              }}
            >
              <Code2 size={15} />
            </div>
            <div className="fw-bold" style={{ color: 'var(--lc-text-primary)', fontSize: '13px' }}>
              DSA <span style={{ color: 'var(--lc-accent)' }}>Mistake</span> Log
            </div>
          </div>
          <button 
            className="btn btn-sm btn-lc-ghost d-lg-none p-1"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-2 flex-grow-1 overflow-y-auto">
          <div className="px-2 py-1 text-uppercase fw-semibold text-muted" style={{ fontSize: '11px', letterSpacing: '0.06em' }}>
            Workspace
          </div>
          
          <nav className="nav flex-column mt-1">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/mistakes" 
              end
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <BookOpen size={16} />
              <span>All Mistakes</span>
            </NavLink>

            <NavLink 
              to="/learn" 
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <GraduationCap size={16} />
              <span>Learn DSA</span>
            </NavLink>

            <NavLink 
              to="/mistakes/new" 
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <PlusCircle size={16} />
              <span>Record Mistake</span>
            </NavLink>

            <NavLink 
              to="/reviews" 
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <CheckSquare size={16} />
              <span>Review Queue</span>
            </NavLink>

            <NavLink 
              to="/analytics" 
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <BarChart3 size={16} />
              <span>Analytics</span>
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <User size={16} />
              <span>Profile & Settings</span>
            </NavLink>
          </nav>

          {/* LeetCode Invariant Quote */}
          <div className="mt-4 pt-3 border-top" style={{ borderColor: 'var(--lc-border-subtle)' }}>
            <div className="px-2 py-2 rounded" style={{ backgroundColor: 'var(--lc-bg-card)', border: '1px solid var(--lc-border-subtle)' }}>
              <div className="d-flex align-items-center gap-1 mb-1" style={{ color: 'var(--lc-accent)' }}>
                <Sparkles size={13} />
                <span className="fw-semibold" style={{ fontSize: '11px' }}>Core Invariant</span>
              </div>
              <p className="mb-0 text-muted" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                Analyze why the first intuition failed. Internalize the invariant rather than memorizing syntax.
              </p>
            </div>
          </div>
        </div>

        {/* User Account / Footer */}
        {user ? (
          <div 
            className="p-2 border-top" 
            style={{ borderColor: 'var(--lc-border)', backgroundColor: 'var(--lc-bg-sidebar)' }}
          >
            <div className="d-flex align-items-center justify-content-between p-1 rounded" style={{ backgroundColor: 'var(--lc-bg-card)', border: '1px solid var(--lc-border-subtle)' }}>
              <div className="d-flex align-items-center gap-2 overflow-hidden ps-1">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    fontSize: '11px',
                    backgroundColor: 'rgba(255, 161, 22, 0.15)',
                    color: 'var(--lc-accent)',
                    border: '1px solid rgba(255, 161, 22, 0.3)'
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <div className="text-truncate fw-semibold" style={{ color: 'var(--lc-text-primary)', fontSize: '12px' }}>
                    {user.name}
                  </div>
                  <div className="text-truncate text-muted" style={{ fontSize: '10px' }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-sm btn-lc-ghost p-1 text-muted"
                onClick={handleLogout}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 border-top text-center" style={{ borderColor: 'var(--lc-border)' }}>
            <small className="text-muted" style={{ fontSize: '11px' }}>
              LeetCode-Inspired Workspace
            </small>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
