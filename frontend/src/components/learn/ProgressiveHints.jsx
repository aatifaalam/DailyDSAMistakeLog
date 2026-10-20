import React, { useState } from 'react';
import { Eye, EyeOff, HelpCircle, Check, Sparkles } from 'lucide-react';

const ProgressiveHints = ({ hints = [] }) => {
  // hints array where items 0, 1, 2 are hints, and the last item is Solution
  const [revealedLevel, setRevealedLevel] = useState(0); // 0 = none, 1 = hint 1, 2 = hint 2, 3 = hint 3, 4 = solution

  if (!hints || hints.length === 0) return null;

  const hintLabels = [
    { title: "Hint 1: Key Observation", border: "var(--learn-info)", color: "var(--learn-info)", bg: "var(--learn-info-subtle)" },
    { title: "Hint 2: Data Structure & Pattern", border: "var(--learn-accent)", color: "var(--learn-accent)", bg: "var(--learn-accent-subtle)" },
    { title: "Hint 3: Algorithm Outline", border: "var(--learn-warning)", color: "var(--learn-warning)", bg: "var(--learn-warning-subtle)" },
    { title: "Solution & Code Walkthrough", border: "var(--learn-success)", color: "var(--learn-success)", bg: "var(--learn-success-subtle)" }
  ];

  const handleRevealNext = () => {
    if (revealedLevel < hints.length) {
      setRevealedLevel(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setRevealedLevel(0);
  };

  return (
    <div 
      className="my-3 p-3 rounded-4 transition-all" 
      style={{ 
        backgroundColor: 'var(--learn-surface)', 
        border: '1px solid var(--learn-border)',
        boxShadow: 'var(--learn-card-shadow)'
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom" style={{ borderColor: 'var(--learn-border-subtle)' }}>
        <div className="d-flex align-items-center gap-2">
          <HelpCircle size={16} style={{ color: 'var(--learn-accent)' }} />
          <span className="small fw-bold" style={{ color: 'var(--learn-text)' }}>
            Hint-First Learning Ladder
          </span>
          <span 
            className="badge rounded-pill font-mono" 
            style={{ 
              fontSize: '0.7rem', 
              backgroundColor: 'var(--learn-surface-secondary)', 
              color: 'var(--learn-text-muted)',
              border: '1px solid var(--learn-border-subtle)'
            }}
          >
            {revealedLevel} of {hints.length} revealed
          </span>
        </div>

        <div className="d-flex align-items-center gap-1">
          {revealedLevel < hints.length ? (
            <button
              type="button"
              className="btn btn-sm btn-learn-secondary py-1 px-3 d-inline-flex align-items-center gap-1"
              style={{ fontSize: '0.78rem' }}
              onClick={handleRevealNext}
            >
              <Eye size={13} style={{ color: 'var(--learn-accent)' }} />
              <span>
                {revealedLevel === 0 
                  ? "Reveal Hint 1" 
                  : revealedLevel === hints.length - 1 
                    ? "Reveal Solution" 
                    : `Reveal Hint ${revealedLevel + 1}`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-link p-0 text-decoration-none"
              style={{ fontSize: '0.75rem', color: 'var(--learn-text-muted)' }}
              onClick={handleReset}
            >
              Hide All Hints
            </button>
          )}
        </div>
      </div>

      {/* Hints List */}
      <div className="d-flex flex-column gap-2 mt-2">
        {hints.slice(0, revealedLevel).map((hintText, idx) => {
          const config = hintLabels[idx] || hintLabels[hintLabels.length - 1];
          const isSolution = idx === hints.length - 1;

          return (
            <div 
              key={idx}
              className="p-3 rounded-3 transition-all"
              style={{ 
                backgroundColor: 'var(--learn-surface-secondary)',
                border: '1px solid var(--learn-border)',
                borderLeft: `4px solid ${config.border}`
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fw-bold small" style={{ color: config.color, fontSize: '0.8rem' }}>
                  {config.title}
                </span>
                <span className="small font-mono" style={{ color: 'var(--learn-text-subtle)', fontSize: '0.7rem' }}>
                  {isSolution ? 'Final Step' : `Step ${idx + 1}`}
                </span>
              </div>
              <p className="mb-0 small" style={{ color: 'var(--learn-text)', lineHeight: '1.6', fontSize: '0.88rem' }}>
                {hintText}
              </p>
            </div>
          );
        })}

        {revealedLevel === 0 && (
          <div className="py-2 text-center small fst-italic" style={{ color: 'var(--learn-text-muted)' }}>
            Take a moment to reason through the problem first. Click "Reveal Hint 1" when you'd like a nudge!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressiveHints;
