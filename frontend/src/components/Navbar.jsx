import React from 'react';
import { Menu, Sun, Moon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onToggleSidebar, title = 'DSA Mistake Log' }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header 
      className="py-3 px-4 border-bottom d-flex align-items-center justify-content-between sticky-top"
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-color)',
        zIndex: 1010
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-secondary-custom d-lg-none p-2 d-flex align-items-center"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>
        <h1 className="h5 mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-save d-none d-sm-inline-flex align-items-center gap-2 py-2 px-3"
          onClick={() => navigate('/mistakes/new')}
        >
          <Plus size={18} />
          <span>Add New Mistake</span>
        </button>

        <button
          className="btn btn-secondary-custom p-2 d-flex align-items-center justify-content-center"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={19} className="text-warning" />
          ) : (
            <Moon size={19} className="text-primary" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
