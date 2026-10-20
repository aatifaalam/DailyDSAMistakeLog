import React from 'react';
import { Quote } from 'lucide-react';

const QuoteCard = ({ quote, context }) => {
  if (!quote) return null;

  return (
    <div 
      className="p-3 my-3 rounded-4 d-flex align-items-center gap-3 transition-all"
      style={{ 
        backgroundColor: 'var(--learn-surface-secondary)', 
        border: '1px solid var(--learn-border)',
        borderLeft: '4px solid var(--learn-accent)' 
      }}
    >
      <div 
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{ 
          width: '36px', 
          height: '36px', 
          backgroundColor: 'var(--learn-accent-subtle)',
          color: 'var(--learn-accent)' 
        }}
      >
        <Quote size={18} />
      </div>

      <div className="flex-grow-1">
        <div 
          className="fw-semibold fst-italic"
          style={{ 
            color: 'var(--learn-text)', 
            fontSize: '0.92rem',
            letterSpacing: '0.01em',
            lineHeight: 1.5
          }}
        >
          "{quote}"
        </div>
        {context && (
          <div className="small mt-1" style={{ color: 'var(--learn-text-muted)', fontSize: '0.74rem' }}>
            {context}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;
