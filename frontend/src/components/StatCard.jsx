import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'var(--lc-accent)', bgColor = 'var(--lc-accent-subtle)' }) => {
  return (
    <div className="lc-stat-box h-100">
      <div>
        <span className="lc-stat-label">
          {title}
        </span>
        <div className="lc-stat-value my-1">
          {value !== undefined && value !== null ? value : '—'}
        </div>
        {subtitle && (
          <div className="text-muted" style={{ fontSize: '11px' }}>
            {subtitle}
          </div>
        )}
      </div>
      {Icon && (
        <div 
          className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0 ms-2"
          style={{ 
            width: '36px', 
            height: '36px', 
            backgroundColor: bgColor, 
            color: color 
          }}
        >
          <Icon size={18} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
