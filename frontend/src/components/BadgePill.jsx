import React from 'react';
import { 
  getMistakeTypeBadge, 
  getMistakeTypeColor, 
  getMistakeTypeBg,
  getReviewStatusBadge 
} from '../utils/constants';

export const MistakeTypeBadge = ({ type }) => {
  const label = getMistakeTypeBadge(type);
  const color = getMistakeTypeColor(type);
  const bg = getMistakeTypeBg(type);

  return (
    <span 
      className="tag-badge" 
      style={{ 
        backgroundColor: bg, 
        color: color,
        border: `1px solid ${color}33`
      }}
    >
      <span 
        style={{ 
          width: '5px', 
          height: '5px', 
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
    NOT_REVIEWED: { bg: 'rgba(138, 138, 138, 0.15)', color: '#A0A0A0', border: 'rgba(138, 138, 138, 0.25)' },
    NEEDS_ANOTHER_REVIEW: { bg: 'rgba(255, 161, 22, 0.15)', color: '#FFA116', border: 'rgba(255, 161, 22, 0.3)' },
    REVIEWED: { bg: 'rgba(44, 187, 93, 0.15)', color: '#2CBB5D', border: 'rgba(44, 187, 93, 0.3)' }
  };

  const style = statusColors[status] || statusColors.NOT_REVIEWED;

  return (
    <span 
      className="tag-badge"
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
    <span className="tag-topic">
      {topic}
    </span>
  );
};

export const PlatformBadge = ({ platform }) => {
  if (!platform) return null;
  return (
    <span 
      className="tag-badge"
      style={{ 
        backgroundColor: 'var(--lc-bg-secondary)', 
        color: 'var(--lc-text-secondary)', 
        border: '1px solid var(--lc-border)' 
      }}
    >
      {platform}
    </span>
  );
};
