import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  PlusCircle, 
  BarChart3, 
  Code2, 
  BookOpenCheck,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-lg-none"
          style={{ zIndex: 1019 }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
        {/* Brand Header */}
        <div className="p-4 border-bottom d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
          <div className="d-flex align-items-center gap-2">
            <div 
              className="rounded-3 p-2 d-flex align-items-center justify-content-center"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff' }}
            >
              <Code2 size={24} />
            </div>
            <div>
              <div className="fw-bold fs-6 lh-1" style={{ color: 'var(--text-primary)' }}>Daily DSA</div>
              <small className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>MISTAKE LOG</small>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-link text-reset d-lg-none p-1 text-decoration-none"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-3 flex-grow-1">
          <small className="text-uppercase fw-bold px-3 mb-2 d-block text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            Main Menu
          </small>
          
          <nav className="nav flex-column">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/mistakes/new" 
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <PlusCircle size={19} />
              <span>Record Mistake</span>
            </NavLink>

            <NavLink 
              to="/mistakes" 
              end
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <History size={19} />
              <span>Mistake History</span>
            </NavLink>

            <NavLink 
              to="/analytics" 
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <BarChart3 size={19} />
              <span>Analytics & Insights</span>
            </NavLink>
          </nav>

          <div className="mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
            <small className="text-uppercase fw-bold px-3 mb-2 d-block text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
              Study Strategy
            </small>
            <div className="px-3 py-2 rounded-3" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <div className="d-flex align-items-center gap-2 mb-1" style={{ color: '#818cf8' }}>
                <BookOpenCheck size={16} />
                <span className="fw-semibold small">Core Rule</span>
              </div>
              <p className="mb-0 text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                Never memorize code. Understand why the first intuition failed, and internalize the invariant.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-top text-center" style={{ borderColor: 'var(--border-color)' }}>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            Spring Boot 3 + MySQL + React
          </small>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
