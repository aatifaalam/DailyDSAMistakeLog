import React from 'react';

const LoadingSpinner = ({ text = 'Loading data from MySQL...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-pulse mb-3" />
      <span className="text-muted fw-medium small">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
