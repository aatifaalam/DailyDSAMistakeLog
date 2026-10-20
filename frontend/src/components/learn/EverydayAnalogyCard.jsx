import React from 'react';
import { Compass, Lightbulb, HelpCircle, Sparkles } from 'lucide-react';

const EverydayAnalogyCard = ({ analogy, theProblem, theIntuition }) => {
  if (!analogy) return null;

  return (
    <div 
      className="p-4 mb-4 rounded-4 transition-all"
      style={{ 
        backgroundColor: 'var(--learn-surface)', 
        border: '1px solid var(--learn-border)',
        boxShadow: 'var(--learn-card-shadow)'
      }}
    >
      {/* Header Pill */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="learn-stage-pill stage-explore">
          <Compass size={13} />
          Everyday Life Intuition
        </span>
      </div>

      <h3 className="h5 fw-bold mb-2" style={{ color: 'var(--learn-text)' }}>
        {analogy.title}
      </h3>

      <p className="mb-4" style={{ color: 'var(--learn-text)', opacity: 0.9, lineHeight: '1.65', fontSize: '0.95rem' }}>
        {analogy.scenario}
      </p>

      {/* The Problem & Intuition breakdown */}
      <div className="row g-3 pt-3 border-top" style={{ borderColor: 'var(--learn-border-subtle)' }}>
        {theProblem && (
          <div className="col-12 col-md-6">
            <div 
              className="p-3 rounded-3 h-100" 
              style={{ 
                backgroundColor: 'var(--learn-surface-secondary)', 
                border: '1px solid var(--learn-border-subtle)',
                borderLeft: '4px solid var(--learn-error)' 
              }}
            >
              <div className="d-flex align-items-center gap-1 mb-1 fw-bold" style={{ color: 'var(--learn-error)', fontSize: '0.8rem' }}>
                <HelpCircle size={14} />
                <span>The Problem to Solve:</span>
              </div>
              <p className="mb-0 small" style={{ color: 'var(--learn-text-muted)', lineHeight: '1.55', fontSize: '0.86rem' }}>
                {theProblem}
              </p>
            </div>
          </div>
        )}

        {theIntuition && (
          <div className="col-12 col-md-6">
            <div 
              className="p-3 rounded-3 h-100" 
              style={{ 
                backgroundColor: 'var(--learn-surface-secondary)', 
                border: '1px solid var(--learn-border-subtle)',
                borderLeft: '4px solid var(--learn-success)' 
              }}
            >
              <div className="d-flex align-items-center gap-1 mb-1 fw-bold" style={{ color: 'var(--learn-success)', fontSize: '0.8rem' }}>
                <Lightbulb size={14} />
                <span>The Intuitive Idea:</span>
              </div>
              <p className="mb-0 small" style={{ color: 'var(--learn-text-muted)', lineHeight: '1.55', fontSize: '0.86rem' }}>
                {theIntuition}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EverydayAnalogyCard;
