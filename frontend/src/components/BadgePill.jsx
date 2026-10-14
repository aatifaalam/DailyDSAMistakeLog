import React from 'react';
import { 
  getMistakeTypeBadge, 
  getMistakeTypeColor, 
  getReviewStatusBadge 
} from '../utils/constants';

export const MistakeTypeBadge = ({ type }) => {
  const label = getMistakeTypeBadge(type);
  const color = getMistakeTypeColor(type);

  return (
    <span 
      className="badge-custom" 
      style={{ 
        backgroundColor: `${color}20`, 
        color: color,
        border: `1px solid ${color}40`
      }}
    >
      <span 
        style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          backgroundColor: color,
          display: 'inline-block' 
        }} 
      />
      {label}
    </span>
  );
};

export const ReviewStatusBadge = ({ status }) => {
  const badgeInfo = getReviewStatusBadge(status);
  
  const statusColors = {
    NOT_REVIEWED: { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' },
    NEEDS_ANOTHER_REVIEW: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    REVIEWED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' }
  };

  const style = statusColors[status] || statusColors.NOT_REVIEWED;

  return (
    <span 
      className="badge-custom"
      style={{ 
        backgroundColor: style.bg, 
        color: style.color, 
        border: `1px solid ${style.border}` 
      }}
    >
      {badgeInfo.label}
    </span>
  );
};

export const TopicBadge = ({ topic }) => {
  if (!topic) return null;
  return (
    <span 
      className="badge-custom"
      style={{ 
        backgroundColor: 'rgba(99, 102, 241, 0.12)', 
        color: '#818cf8', 
        border: '1px solid rgba(99, 102, 241, 0.25)' 
      }}
    >
      {topic}
    </span>
  );
};

export const PlatformBadge = ({ platform }) => {
  if (!platform) return null;
  return (
    <span 
      className="badge-custom"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.07)', 
        color: 'var(--text-secondary)', 
        border: '1px solid var(--border-color)' 
      }}
    >
      {platform}
    </span>
  );
};
