import React, { useState } from 'react';
import { Menu, Sun, Moon, Plus, User, LogOut, Code2, Search, CheckSquare } from 'lucide-react';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');

  const handleLogout = () => {
    logout();
    addToast('You have been logged out safely.', 'info');
    navigate('/login', { replace: true });
  };

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/mistakes?search=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
    }
  };

  return (
    <header className="lc-topbar">
      {/* Left side: Brand and primary navigation */}
      <div className="d-flex align-items-center gap-2 gap-md-3">
        <button
          className="btn btn-sm btn-lc-ghost d-lg-none p-1"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        {/* Brand Logo */}
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none me-2">
          <div 
            className="d-flex align-items-center justify-content-center rounded"
            style={{ 
              width: '28px', 
              height: '28px', 
              backgroundColor: 'rgba(255, 161, 22, 0.15)', 
              color: 'var(--lc-accent)',
              border: '1px solid rgba(255, 161, 22, 0.3)'
            }}
          >
            <Code2 size={16} />
          </div>
          <span className="fw-bold d-none d-sm-inline" style={{ color: 'var(--lc-text-primary)', fontSize: '14px', letterSpacing: '-0.01em' }}>
            Daily <span style={{ color: 'var(--lc-accent)' }}>DSA</span> Mistake Log
          </span>
        </Link>

        {/* LeetCode-style top navigation links */}
        <nav className="lc-topbar-nav d-none d-md-flex">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `lc-nav-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>

          <NavLink 
            to="/mistakes" 
            end
            className={({ isActive }) => `lc-nav-link ${isActive ? 'active' : ''}`}
          >
            Problems
          </NavLink>

          <NavLink 
            to="/learn" 
            className={({ isActive }) => `lc-nav-link ${isActive ? 'active' : ''}`}
          >
            Learn
          </NavLink>

          <NavLink 
            to="/reviews" 
            className={({ isActive }) => `lc-nav-link ${isActive ? 'active' : ''}`}
          >
            Review Queue
          </NavLink>

          <NavLink 
            to="/analytics" 
            className={({ isActive }) => `lc-nav-link ${isActive ? 'active' : ''}`}
          >
            Analytics
          </NavLink>
        </nav>
      </div>

      {/* Right side: Quick search, Add mistake, Theme toggle, Profile, Logout */}
      <div className="d-flex align-items-center gap-2">
        {/* Quick search input */}
        <form onSubmit={handleQuickSearchSubmit} className="d-none d-lg-block position-relative">
          <Search 
            size={14} 
            className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" 
            style={{ pointerEvents: 'none' }}
          />
          <input
            type="text"
            className="form-control form-control-sm ps-4 pe-2 py-1"
            placeholder="Search problems..."
            style={{ 
              width: '180px', 
              fontSize: '12px',
              backgroundColor: 'var(--lc-bg-main)',
              borderColor: 'var(--lc-border)'
            }}
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
          />
        </form>

        <button
          className="btn btn-lc-primary btn-sm py-1 px-2 d-none d-sm-inline-flex"
          onClick={() => navigate('/mistakes/new')}
          title="Record a new DSA mistake"
        >
          <Plus size={15} />
          <span>Record Mistake</span>
        </button>

        <button
          className="btn btn-lc-ghost btn-sm p-1 d-flex align-items-center justify-content-center"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={17} className="text-warning" />
          ) : (
            <Moon size={17} style={{ color: 'var(--lc-accent)' }} />
          )}
        </button>

        {user && (
          <div className="d-flex align-items-center gap-1 ps-2 border-start" style={{ borderColor: 'var(--lc-border)' }}>
            <Link
              to="/profile"
              className="btn btn-lc-ghost btn-sm py-1 px-2 d-flex align-items-center gap-2 text-decoration-none"
              title="Account & Security"
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  fontSize: '11px',
                  backgroundColor: 'var(--lc-bg-secondary)',
                  border: '1px solid var(--lc-border)',
                  color: 'var(--lc-accent)'
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="d-none d-xl-inline small" style={{ color: 'var(--lc-text-primary)', fontSize: '13px' }}>
                {user.name.split(' ')[0]}
              </span>
            </Link>

            <button
              className="btn btn-lc-ghost btn-sm p-1 text-muted"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
