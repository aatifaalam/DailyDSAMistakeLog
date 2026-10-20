import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Filter,
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';
import { MistakeService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatDate, TOPICS, MISTAKE_TYPES } from '../utils/constants';
import { MistakeTypeBadge, ReviewStatusBadge, TopicBadge, PlatformBadge } from '../components/BadgePill';
import Pagination from '../components/Pagination';
import ReviewModal from '../components/ReviewModal';

const ReviewQueuePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  
  // Filter state
  const [filterType, setFilterType] = useState('ALL_PENDING'); // 'ALL_PENDING' | 'NEEDS_ANOTHER_REVIEW' | 'NOT_REVIEWED'
  const [sort, setSort] = useState('createdAt,desc');
  const [selectedTopic, setSelectedTopic] = useState('');

  // Review modal
  const [reviewTarget, setReviewTarget] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size,
        sort
      };

      if (filterType === 'NEEDS_ANOTHER_REVIEW') {
        params.reviewStatus = 'NEEDS_ANOTHER_REVIEW';
      } else if (filterType === 'NOT_REVIEWED') {
        params.reviewStatus = 'NOT_REVIEWED';
      }
      // Note: If ALL_PENDING, we fetch both or if backend doesn't support multiple comma-separated reviewStatus,
      // we can request without reviewStatus and client-side filter or fetch NOT_REVIEWED if filterType specifies.
      // Let's check: backend MistakeSpecification filters if reviewStatus != null. If filterType === 'ALL_PENDING',
      // we can fetch without reviewStatus and filter out REVIEWED if needed, or better, fetch with specific params.

      if (selectedTopic) {
        params.topic = selectedTopic;
      }

      const data = await MistakeService.getMistakes(params);
      let items = data.content || [];
      let total = data.totalElements || 0;

      if (filterType === 'ALL_PENDING') {
        items = items.filter(m => m.reviewStatus !== 'REVIEWED');
        total = items.length;
      }

      setMistakes(items);
      setTotalElements(total);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, size, sort, filterType, selectedTopic, showToast]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleMarkReviewed = async (e, mistake) => {
    e.stopPropagation();
    try {
      await MistakeService.updateReview(mistake.id, {
        reviewStatus: 'REVIEWED',
        reviewDate: new Date().toISOString().split('T')[0]
      });
      showToast({ message: `"${mistake.problemName}" marked as reviewed!`, type: 'success' });
      fetchQueue();
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    }
  };

  const handleSaveReviewModal = async (reviewData) => {
    if (!reviewTarget) return;
    try {
      setIsReviewing(true);
      await MistakeService.updateReview(reviewTarget.id, reviewData);
      showToast({ message: 'Review updated successfully', type: 'success' });
      setReviewTarget(null);
      fetchQueue();
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div>
      {/* Review Workflow Modal */}
      <ReviewModal
        isOpen={Boolean(reviewTarget)}
        mistake={reviewTarget}
        isLoading={isReviewing}
        onClose={() => setReviewTarget(null)}
        onSave={handleSaveReviewModal}
      />

      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h1 className="h4 fw-bold mb-0" style={{ color: 'var(--lc-text-primary)', letterSpacing: '-0.01em' }}>
              Review Queue
            </h1>
            <span 
              className="badge rounded-pill fw-medium"
              style={{ 
                backgroundColor: 'rgba(255, 161, 22, 0.12)', 
                color: 'var(--lc-accent)',
                border: '1px solid rgba(255, 161, 22, 0.3)',
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem'
              }}
            >
              {totalElements} pending review
            </span>
          </div>
          <p className="small mb-0 mt-1" style={{ color: 'var(--lc-text-secondary)' }}>
            Spaced repetition queue for algorithmic mistakes awaiting analysis or secondary review.
          </p>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="lc-panel p-3 mb-3">
        <div className="row g-2 align-items-center justify-content-between">
          {/* Status Tabs */}
          <div className="col-12 col-md-6 d-flex gap-1">
            <button
              type="button"
              className={`btn btn-sm ${filterType === 'ALL_PENDING' ? 'btn-lc-primary' : 'btn-lc-secondary'}`}
              onClick={() => { setFilterType('ALL_PENDING'); setPage(0); }}
            >
              All Pending
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterType === 'NEEDS_ANOTHER_REVIEW' ? 'btn-lc-primary' : 'btn-lc-secondary'}`}
              onClick={() => { setFilterType('NEEDS_ANOTHER_REVIEW'); setPage(0); }}
            >
              Needs Another Review
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterType === 'NOT_REVIEWED' ? 'btn-lc-primary' : 'btn-lc-secondary'}`}
              onClick={() => { setFilterType('NOT_REVIEWED'); setPage(0); }}
            >
              Not Reviewed
            </button>
          </div>

          {/* Sort & Topic Filter */}
          <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setPage(0); }}
            >
              <option value="">All Topics</option>
              {TOPICS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(0); }}
            >
              <option value="createdAt,desc">Newest Recorded</option>
              <option value="createdAt,asc">Oldest Recorded</option>
              <option value="reviewDate,desc">Review Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Review Queue List */}
      <div className="lc-panel overflow-hidden">
        {loading ? (
          <div className="p-3">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="d-flex align-items-center justify-content-between py-3 border-bottom"
                style={{ borderColor: 'var(--lc-border)' }}
              >
                <div style={{ width: '40%', height: 16, backgroundColor: 'var(--lc-bg-card-hover)', borderRadius: 4 }} />
                <div style={{ width: '20%', height: 16, backgroundColor: 'var(--lc-bg-card-hover)', borderRadius: 4 }} />
                <div style={{ width: '15%', height: 16, backgroundColor: 'var(--lc-bg-card-hover)', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : mistakes.length === 0 ? (
          /* Empty state: User caught up */
          <div className="text-center py-5 px-3">
            <Sparkles size={40} className="mb-2" style={{ color: 'var(--lc-success)', strokeWidth: 1.5 }} />
            <h3 className="h6 fw-semibold mb-1" style={{ color: 'var(--lc-text-primary)' }}>
              All Caught Up!
            </h3>
            <p className="small mb-3" style={{ color: 'var(--lc-text-secondary)', maxWidth: 380, margin: '0 auto' }}>
              You have no pending mistakes requiring review under this filter. Great job mastering your past errors!
            </p>
            <button className="btn btn-sm btn-lc-secondary" onClick={() => navigate('/mistakes')}>
              Browse All Mistakes
            </button>
          </div>
        ) : (
          <div>
            <div className="table-responsive">
              <table className="lc-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px', textAlign: 'center' }}>Status</th>
                    <th>Problem Name</th>
                    <th style={{ width: '150px' }}>Topic</th>
                    <th style={{ width: '180px' }}>Mistake Archetype</th>
                    <th style={{ width: '140px' }}>Recorded / Reviewed</th>
                    <th style={{ width: '150px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mistakes.map((mistake) => (
                    <tr 
                      key={mistake.id}
                      onClick={() => navigate(`/mistakes/${mistake.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ textAlign: 'center' }}>
                        {mistake.reviewStatus === 'NEEDS_ANOTHER_REVIEW' ? (
                          <AlertCircle size={17} style={{ color: 'var(--lc-accent)' }} title="Needs Another Review" />
                        ) : (
                          <Clock size={16} style={{ color: 'var(--lc-text-muted)' }} title="Not Reviewed" />
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-medium" style={{ color: 'var(--lc-text-primary)' }}>
                            {mistake.problemName}
                          </span>
                          <PlatformBadge platform={mistake.platform} />
                          {mistake.problemUrl && (
                            <a 
                              href={mistake.problemUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-muted d-inline-flex align-items-center"
                              onClick={(e) => e.stopPropagation()}
                              title="External Link"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td>
                        <TopicBadge topic={mistake.topic} />
                      </td>
                      <td>
                        <MistakeTypeBadge type={mistake.mistakeType} />
                      </td>
                      <td>
                        <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--lc-text-secondary)' }}>
                          <div>Logged: {formatDate(mistake.createdAt)}</div>
                          {mistake.reviewDate && (
                            <div style={{ color: 'var(--lc-accent)' }}>
                              Rev: {formatDate(mistake.reviewDate)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="d-inline-flex align-items-center gap-1">
                          <button
                            className="btn btn-sm btn-lc-secondary py-1 px-2 d-inline-flex align-items-center gap-1"
                            onClick={(e) => handleMarkReviewed(e, mistake)}
                            title="Mark as Reviewed"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <Check size={13} style={{ color: 'var(--lc-success)' }} />
                            <span>Done</span>
                          </button>
                          <button
                            className="btn btn-sm btn-lc-secondary py-1 px-2"
                            onClick={() => setReviewTarget(mistake)}
                            title="Full Review Workflow"
                            style={{ fontSize: '0.75rem' }}
                          >
                            Notes
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3 border-top" style={{ borderColor: 'var(--lc-border)' }}>
              <Pagination
                pageNumber={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={size}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setSize(newSize);
                  setPage(0);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewQueuePage;
