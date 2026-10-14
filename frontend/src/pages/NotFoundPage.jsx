import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="custom-card empty-state p-5 my-5 text-center">
      <AlertCircle size={54} className="text-warning mb-3" />
      <h2 className="h4 fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Page Not Found
      </h2>
      <p className="text-muted mb-4 small" style={{ maxWidth: '400px', margin: '0 auto' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-indigo d-inline-flex align-items-center gap-2">
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
