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
      />
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content custom-modal-content p-2">
            <div className="modal-header border-0 pb-0">
              <div className="d-flex align-items-center gap-2">
                <div className="text-success p-2 rounded-circle" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                    Review Mistake
                  </h5>
                  <small className="text-muted">{mistake.problemName}</small>
                </div>
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-link text-reset p-1 text-decoration-none" 
                onClick={onClose}
                disabled={isLoading}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body py-3">
                <div className="mb-3">
                  <label className="form-label">Review Status</label>
                  <select 
                    className="form-select"
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

                <div className="mb-3">
                  <label className="form-label">Review Date</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={reviewDate}
                    onChange={(e) => setReviewDate(e.target.value)}
                  />
                  <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                    Date when you practiced or re-solved this problem.
                  </small>
                </div>

                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="modalSolvedIndependently"
                      checked={solvedIndependently}
                      onChange={(e) => setSolvedIndependently(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label className="form-check-label fw-medium" htmlFor="modalSolvedIndependently" style={{ cursor: 'pointer', color: 'var(--text-primary)' }}>
                      Solved independently after review
                    </label>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label">Review Notes / Retrospective</label>
                  <textarea 
                    className="form-control"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add observations, edge cases noticed during re-solve, or reflections..."
                  />
                </div>
              </div>
              
              <div className="modal-footer border-0 pt-0">
                <button 
                  type="button" 
                  className="btn btn-secondary-custom" 
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-save px-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  ) : null}
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
