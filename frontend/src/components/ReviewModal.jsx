import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { REVIEW_STATUSES } from '../utils/constants';

const ReviewModal = ({ 
  isOpen, 
  mistake, 
  onClose, 
  onSave, 
  isLoading = false 
}) => {
  const [reviewStatus, setReviewStatus] = useState('REVIEWED');
  const [reviewDate, setReviewDate] = useState('');
  const [notes, setNotes] = useState('');
  const [solvedIndependently, setSolvedIndependently] = useState(false);

  useEffect(() => {
    if (mistake) {
      setReviewStatus(mistake.reviewStatus || 'REVIEWED');
      setReviewDate(mistake.reviewDate || new Date().toISOString().split('T')[0]);
      setNotes(mistake.notes || '');
      setSolvedIndependently(Boolean(mistake.solvedIndependently));
    }
  }, [mistake]);

  if (!isOpen || !mistake) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      reviewStatus,
      reviewDate: reviewDate || null,
      notes,
      solvedIndependently
    });
  };

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        onClick={!isLoading ? onClose : undefined}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      />
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div 
            className="modal-content lc-panel p-3 shadow-lg"
            style={{ 
              backgroundColor: 'var(--lc-bg-card)', 
              borderColor: 'var(--lc-border)' 
            }}
          >
            <div className="modal-header border-0 pb-0 pt-1 px-1">
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="p-1 rounded" 
                  style={{ backgroundColor: 'rgba(44, 187, 93, 0.15)', color: 'var(--lc-success)' }}
                >
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                    Review Mistake
                  </h2>
                  <small className="text-muted font-mono" style={{ fontSize: '0.75rem' }}>
                    {mistake.problemName}
                  </small>
                </div>
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-link text-muted p-1 text-decoration-none" 
                onClick={onClose}
                disabled={isLoading}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body py-3 px-1">
                <div className="mb-2">
                  <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                    Review Status
                  </label>
                  <select 
                    className="form-select form-select-sm"
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    required
                  >
                    {REVIEW_STATUSES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                    Review Date
                  </label>
                  <input 
                    type="date" 
                    className="form-control form-control-sm"
                    value={reviewDate}
                    onChange={(e) => setReviewDate(e.target.value)}
                  />
                  <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Date when you practiced or resolved this problem.
                  </small>
                </div>

                <div className="mb-3">
                  <div className="form-check form-switch p-1 rounded" style={{ backgroundColor: 'var(--lc-bg-main)' }}>
                    <input 
                      className="form-check-input ms-0 me-2" 
                      type="checkbox" 
                      id="modalSolvedIndependently"
                      checked={solvedIndependently}
                      onChange={(e) => setSolvedIndependently(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label className="form-check-label small" htmlFor="modalSolvedIndependently" style={{ cursor: 'pointer', color: 'var(--lc-text-primary)' }}>
                      Solved independently after review
                    </label>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                    Review Notes / Retrospective
                  </label>
                  <textarea 
                    className="form-control form-control-sm"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add observations, edge cases noticed during re-solve, or reflections..."
                  />
                </div>
              </div>
              
              <div className="modal-footer border-0 pt-0 px-1 d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-sm btn-lc-secondary" 
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-sm btn-lc-primary px-3"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                  )}
                  Update Review
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewModal;
