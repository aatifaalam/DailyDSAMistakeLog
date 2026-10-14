import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = '#6366f1', bgColor = 'rgba(99, 102, 241, 0.12)' }) => {
  return (
    <div className="custom-card stat-card h-100">
      <div>
        <span className="text-muted fw-semibold small text-uppercase" style={{ letterSpacing: '0.04em' }}>
          {title}
        </span>
        <h2 className="fs-3 fw-bold my-1" style={{ color: 'var(--text-primary)' }}>
          {value !== undefined && value !== null ? value : '—'}
        </h2>
        {subtitle && (
          <small className="text-muted d-block">
            {subtitle}
          </small>
        )}
      </div>
      {Icon && (
        <div 
          className="stat-icon-wrapper flex-shrink-0 ms-3"
          style={{ backgroundColor: bgColor, color: color }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
