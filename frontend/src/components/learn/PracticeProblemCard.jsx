import React from 'react';
import { ExternalLink, PlusCircle, CheckCircle, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressiveHints from './ProgressiveHints';

const PracticeProblemCard = ({ problem, topicTitle }) => {
  if (!problem) return null;

  const difficultyColor = 
    problem.difficulty === 'Easy' ? 'var(--learn-success)' :
    problem.difficulty === 'Medium' ? 'var(--learn-accent)' :
    'var(--learn-error)';

  const difficultyBg = 
    problem.difficulty === 'Easy' ? 'var(--learn-success-subtle)' :
    problem.difficulty === 'Medium' ? 'var(--learn-accent-subtle)' :
    'var(--learn-error-subtle)';

  return (
    <div 
      className="p-4 my-3 rounded-4 transition-all"
      style={{ 
        backgroundColor: 'var(--learn-surface)', 
        border: '1px solid var(--learn-border)',
        boxShadow: 'var(--learn-card-shadow)'
      }}
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <span 
            className="badge fw-bold font-mono px-2 py-1"
            style={{ 
              backgroundColor: difficultyBg, 
              color: difficultyColor, 
              border: `1px solid ${difficultyColor}`,
              fontSize: '0.74rem',
              borderRadius: '6px'
            }}
          >
            {problem.difficulty}
          </span>

          <h4 className="h6 fw-bold mb-0" style={{ color: 'var(--learn-text)' }}>
            {problem.title}
          </h4>
        </div>

        <div className="d-flex align-items-center gap-2">
          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-learn-secondary py-1 px-3 d-inline-flex align-items-center gap-1 text-decoration-none"
              style={{ fontSize: '0.78rem' }}
              title="Solve on original platform"
            >
              <span>Solve on LeetCode</span>
              <ExternalLink size={13} />
            </a>
          )}

          <Link
            to={`/mistakes/new?problemName=${encodeURIComponent(problem.title)}&topic=${encodeURIComponent(topicTitle || 'Arrays')}`}
            className="btn btn-sm btn-learn-secondary py-1 px-3 d-inline-flex align-items-center gap-1 text-decoration-none"
            style={{ fontSize: '0.78rem' }}
            title="Log a mistake if you got stuck"
          >
            <PlusCircle size={13} style={{ color: 'var(--learn-accent)' }} />
            <span>Log Mistake</span>
          </Link>
        </div>
      </div>

      <p className="small mb-3" style={{ color: 'var(--learn-text-muted)', lineHeight: '1.6', fontSize: '0.88rem' }}>
        <strong style={{ color: 'var(--learn-text)' }}>Why this problem: </strong> 
        {problem.relevance}
      </p>

      {/* Progressive Hint Revelation */}
      <ProgressiveHints hints={problem.hints} />
    </div>
  );
};

export default PracticeProblemCard;
