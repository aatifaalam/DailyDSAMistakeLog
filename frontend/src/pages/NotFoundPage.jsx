import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{ backgroundColor: 'var(--lc-bg-main)' }}
    >
      <div className="lc-panel p-5 text-center shadow-sm" style={{ maxWidth: 440 }}>
        <AlertCircle size={44} className="mb-3" style={{ color: 'var(--lc-accent)' }} />
        <h1 className="h5 fw-bold mb-2" style={{ color: 'var(--lc-text-primary)' }}>
          404 - Page Not Found
        </h1>
        <p className="small mb-4" style={{ color: 'var(--lc-text-secondary)' }}>
          The problem or page you requested could not be found or has been moved.
        </p>
        <Link to="/" className="btn btn-sm btn-lc-primary d-inline-flex align-items-center gap-1">
          <ArrowLeft size={14} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
