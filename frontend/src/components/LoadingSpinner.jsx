import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div 
        className="spinner-border spinner-border-sm mb-2" 
        role="status" 
        style={{ color: 'var(--lc-accent)', width: '1.5rem', height: '1.5rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="text-muted small font-mono" style={{ fontSize: '0.78rem' }}>{text}</span>
    </div>
  );
};

export default LoadingSpinner;
