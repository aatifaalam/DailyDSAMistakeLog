import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Minus,
  ExternalLink,
  Calendar,
  X,
  FileSpreadsheet,
  MoreVertical,
  Check
} from 'lucide-react';
import { MistakeService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  MISTAKE_TYPES, 
  PLATFORMS, 
  TOPICS, 
  REVIEW_STATUSES, 
  formatDate 
} from '../utils/constants';
import { MistakeTypeBadge, ReviewStatusBadge, TopicBadge, PlatformBadge } from '../components/BadgePill';
import Pagination from '../components/Pagination';
import ConfirmationModal from '../components/ConfirmationModal';
import ReviewModal from '../components/ReviewModal';

const MistakeHistoryPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState('createdAt,desc');

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedMistakeType, setSelectedMistakeType] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedReviewStatus, setSelectedReviewStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modals state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const fetchMistakes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size,
        sort
      };

      if (search.trim()) params.search = search.trim();
      if (selectedTopic) params.topic = selectedTopic;
      if (selectedMistakeType) params.mistakeType = selectedMistakeType;
      if (selectedPlatform) params.platform = selectedPlatform;
      if (selectedReviewStatus) params.reviewStatus = selectedReviewStatus;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await MistakeService.getMistakes(params);
      setMistakes(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, size, sort, search, selectedTopic, selectedMistakeType, selectedPlatform, selectedReviewStatus, startDate, endDate, showToast]);

  useEffect(() => {
    fetchMistakes();
  }, [fetchMistakes]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedTopic('');
    setSelectedMistakeType('');
    setSelectedPlatform('');
    setSelectedReviewStatus('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const hasActiveFilters = Boolean(
    search || selectedTopic || selectedMistakeType || selectedPlatform || selectedReviewStatus || startDate || endDate
  );

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await MistakeService.deleteMistake(deleteTarget.id);
      showToast({ message: `"${deleteTarget.problemName}" deleted successfully`, type: 'success' });
      setDeleteTarget(null);
      if (mistakes.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchMistakes();
      }
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveReview = async (reviewData) => {
    if (!reviewTarget) return;
    try {
      setIsReviewing(true);
      await MistakeService.updateReview(reviewTarget.id, reviewData);
      showToast({ message: 'Review status updated successfully', type: 'success' });
      setReviewTarget(null);
      fetchMistakes();
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setIsReviewing(false);
    }
  };

  const handleQuickToggleReview = async (e, mistake) => {
    e.stopPropagation();
    const newStatus = mistake.reviewStatus === 'REVIEWED' ? 'NOT_REVIEWED' : 'REVIEWED';
    try {
      await MistakeService.updateReview(mistake.id, {
        reviewStatus: newStatus,
        reviewDate: newStatus === 'REVIEWED' ? new Date().toISOString().split('T')[0] : null
      });
      showToast({ 
        message: newStatus === 'REVIEWED' ? 'Marked as Reviewed' : 'Reopened review for practice', 
        type: 'success' 
      });
      fetchMistakes();
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    }
  };

  // Status icon component matching LeetCode problemset style
  const renderStatusIcon = (status) => {
    if (status === 'REVIEWED') {
      return (
        <span title="Reviewed" className="d-inline-flex align-items-center justify-content-center" style={{ color: 'var(--lc-success)', width: '22px' }}>
          <CheckCircle2 size={17} />
        </span>
      );
    }
    if (status === 'NEEDS_ANOTHER_REVIEW') {
      return (
        <span title="Needs Another Review" className="d-inline-flex align-items-center justify-content-center" style={{ color: 'var(--lc-accent)', width: '22px' }}>
          <AlertCircle size={17} />
        </span>
      );
    }
    return (
      <span title="Not Reviewed" className="d-inline-flex align-items-center justify-content-center" style={{ color: 'var(--lc-text-muted)', width: '22px' }}>
        <Minus size={15} />
      </span>
    );
  };

  return (
    <div>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Mistake Record"
        message={`Are you sure you want to delete the mistake record for "${deleteTarget?.problemName}"? This action cannot be undone.`}
        confirmText="Delete Mistake"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={Boolean(reviewTarget)}
        mistake={reviewTarget}
        isLoading={isReviewing}
        onClose={() => setReviewTarget(null)}
        onSave={handleSaveReview}
      />

      {/* Header Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div className="d-flex align-items-center gap-3">
          <h1 className="h4 fw-bold mb-0" style={{ color: 'var(--lc-text-primary)', letterSpacing: '-0.01em' }}>
            My Mistakes
          </h1>
          <span 
            className="badge rounded-pill fw-medium"
            style={{ 
              backgroundColor: 'var(--lc-bg-card-hover)', 
              color: 'var(--lc-text-secondary)',
              border: '1px solid var(--lc-border)',
              fontSize: '0.75rem',
              padding: '0.25rem 0.6rem'
            }}
          >
            {totalElements} total
          </span>
        </div>

        <button 
          className="btn btn-lc-primary d-inline-flex align-items-center gap-1"
          onClick={() => navigate('/mistakes/new')}
        >
          <Plus size={15} />
          <span>Add Mistake</span>
        </button>
      </div>

      {/* LeetCode-style Filter & Search Toolbar */}
      <div className="lc-panel p-3 mb-3">
        <div className="row g-2 align-items-center">
          {/* Search Input */}
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <Search 
                size={15} 
                className="position-absolute text-muted" 
                style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type="text"
                className="form-control form-control-sm ps-4 pe-4"
                placeholder="Search problem name or notes..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
              {search && (
                <button 
                  className="btn btn-link text-muted border-0 p-0 position-absolute end-0 top-50 translate-middle-y me-2"
                  onClick={() => { setSearch(''); setPage(0); }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Sort Selector */}
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0);
              }}
            >
              <option value="createdAt,desc">Sort: Newest First</option>
              <option value="createdAt,asc">Sort: Oldest First</option>
              <option value="problemName,asc">Sort: Problem Name (A-Z)</option>
              <option value="problemName,desc">Sort: Problem Name (Z-A)</option>
            </select>
          </div>

          {/* Quick Status / Filter Toggle Buttons */}
          <div className="col-6 col-md-4 d-flex justify-content-end gap-2">
            <button
              type="button"
              className={`btn btn-sm ${showFilters ? 'btn-lc-primary' : 'btn-lc-secondary'} d-inline-flex align-items-center gap-1`}
              onClick={() => setShowFilters(prev => !prev)}
            >
              <Filter size={14} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="badge rounded-circle bg-warning text-dark p-1" style={{ fontSize: '0.65rem', lineHeight: 1 }}>•</span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-sm btn-lc-secondary d-inline-flex align-items-center gap-1"
                onClick={handleResetFilters}
                title="Clear all filters"
              >
                <RotateCcw size={13} />
                <span className="d-none d-sm-inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Extended Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-top" style={{ borderColor: 'var(--lc-border)' }}>
            <div className="row g-2">
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>Topic</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedTopic}
                  onChange={(e) => { setSelectedTopic(e.target.value); setPage(0); }}
                >
                  <option value="">All Topics</option>
                  {TOPICS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>Mistake Type</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedMistakeType}
                  onChange={(e) => { setSelectedMistakeType(e.target.value); setPage(0); }}
                >
                  <option value="">All Mistake Types</option>
                  {MISTAKE_TYPES.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-6 col-md-2">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>Platform</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedPlatform}
                  onChange={(e) => { setSelectedPlatform(e.target.value); setPage(0); }}
                >
                  <option value="">All Platforms</option>
                  {PLATFORMS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-6 col-md-2">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>Review Status</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedReviewStatus}
                  onChange={(e) => { setSelectedReviewStatus(e.target.value); setPage(0); }}
                >
                  <option value="">All Statuses</option>
                  {REVIEW_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-6 col-md-2">
                <label className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>From Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content: LeetCode-style Problemset Table */}
      <div className="lc-panel overflow-hidden">
        {loading ? (
          /* Loading Skeletons */
          <div className="p-3">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="d-flex align-items-center justify-content-between py-3 border-bottom"
                style={{ borderColor: 'var(--lc-border)' }}
              >
                <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
                  <div className="rounded-circle" style={{ width: 18, height: 18, backgroundColor: 'var(--lc-bg-card-hover)' }} />
                  <div style={{ width: '35%', height: 16, backgroundColor: 'var(--lc-bg-card-hover)', borderRadius: 4 }} />
                  <div style={{ width: '15%', height: 16, backgroundColor: 'var(--lc-bg-card-hover)', borderRadius: 4 }} />
                </div>
                <div style={{ width: '20%', height: 16, backgroundColor: 'var(--lc-bg-card-hover)', borderRadius: 4 }} />
                <div style={{ width: '10%', height: 16, backgroundColor: 'var(--lc-bg-card-hover)', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : mistakes.length === 0 ? (
          /* Empty / No Results State */
          <div className="text-center py-5 px-3">
            <FileSpreadsheet size={40} className="mb-2" style={{ color: 'var(--lc-text-muted)', strokeWidth: 1.5 }} />
            <h3 className="h6 fw-semibold mb-1" style={{ color: 'var(--lc-text-primary)' }}>
              {hasActiveFilters ? 'No Matching Mistakes Found' : 'No Mistakes Logged Yet'}
            </h3>
            <p className="small mb-3" style={{ color: 'var(--lc-text-secondary)', maxWidth: 400, margin: '0 auto' }}>
              {hasActiveFilters 
                ? 'No records match your selected filter criteria. Try clearing some filters or searching for a different keyword.'
                : 'Every bug is a lesson. Log your first mistake to start analyzing your algorithmic blind spots!'}
            </p>
            {hasActiveFilters ? (
              <button className="btn btn-sm btn-lc-secondary" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            ) : (
              <button className="btn btn-sm btn-lc-primary" onClick={() => navigate('/mistakes/new')}>
                Add Your First Mistake
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block">
              <table className="lc-table">
                <thead>
                  <tr>
                    <th style={{ width: '42px', textAlign: 'center' }}>Status</th>
                    <th>Problem Name</th>
                    <th style={{ width: '160px' }}>Topic</th>
                    <th style={{ width: '180px' }}>Mistake Type</th>
                    <th style={{ width: '130px' }}>Recorded</th>
                    <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mistakes.map((mistake) => (
                    <tr 
                      key={mistake.id}
                      onClick={() => navigate(`/mistakes/${mistake.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* 1. Review Status Icon */}
                      <td 
                        style={{ textAlign: 'center' }}
                        onClick={(e) => handleQuickToggleReview(e, mistake)}
                        title="Click to toggle reviewed status"
                      >
                        {renderStatusIcon(mistake.reviewStatus)}
                      </td>

                      {/* 2. Problem Name */}
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
                              title="External problem link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                          {mistake.timeComplexity && (
                            <span 
                              className="font-mono"
                              style={{ 
                                fontSize: '0.72rem', 
                                color: 'var(--lc-text-secondary)',
                                backgroundColor: 'var(--lc-bg-card-hover)',
                                padding: '1px 5px',
                                borderRadius: '3px'
                              }}
                            >
                              {mistake.timeComplexity}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Topic */}
                      <td>
                        <TopicBadge topic={mistake.topic} />
                      </td>

                      {/* 4. Mistake Type */}
                      <td>
                        <MistakeTypeBadge type={mistake.mistakeType} />
                      </td>

                      {/* 5. Date Recorded */}
                      <td>
                        <span className="small text-muted font-mono" style={{ fontSize: '0.78rem' }}>
                          {formatDate(mistake.createdAt)}
                        </span>
                      </td>

                      {/* 6. Actions */}
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="d-inline-flex align-items-center gap-1">
                          <button
                            className="btn btn-sm btn-lc-secondary p-1"
                            onClick={() => setReviewTarget(mistake)}
                            title="Review Note / Status"
                          >
                            <Check size={14} style={{ color: mistake.reviewStatus === 'REVIEWED' ? 'var(--lc-success)' : 'var(--lc-accent)' }} />
                          </button>
                          <Link
                            to={`/mistakes/${mistake.id}/edit`}
                            className="btn btn-sm btn-lc-secondary p-1 text-decoration-none"
                            title="Edit Mistake"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            className="btn btn-sm btn-lc-secondary p-1 text-danger"
                            onClick={() => setDeleteTarget(mistake)}
                            title="Delete Mistake"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive List Layout */}
            <div className="d-md-none p-2">
              {mistakes.map((mistake) => (
                <div 
                  key={mistake.id} 
                  className="p-3 mb-2 rounded" 
                  style={{ 
                    backgroundColor: 'var(--lc-bg-card)', 
                    border: '1px solid var(--lc-border)' 
                  }}
                  onClick={() => navigate(`/mistakes/${mistake.id}`)}
                >
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div onClick={(e) => handleQuickToggleReview(e, mistake)}>
                        {renderStatusIcon(mistake.reviewStatus)}
                      </div>
                      <span className="fw-semibold small" style={{ color: 'var(--lc-text-primary)' }}>
                        {mistake.problemName}
                      </span>
                    </div>
                    <ReviewStatusBadge status={mistake.reviewStatus} />
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-1 mb-2">
                    <PlatformBadge platform={mistake.platform} />
                    <TopicBadge topic={mistake.topic} />
                    <MistakeTypeBadge type={mistake.mistakeType} />
                  </div>

                  <div 
                    className="d-flex align-items-center justify-content-between pt-2 border-top mt-2" 
                    style={{ borderColor: 'var(--lc-border)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="small text-muted font-mono" style={{ fontSize: '0.75rem' }}>
                      {formatDate(mistake.createdAt)}
                    </span>
                    
                    <div className="d-flex align-items-center gap-1">
                      <button
                        className="btn btn-sm btn-lc-secondary p-1"
                        onClick={() => setReviewTarget(mistake)}
                        title="Review"
                      >
                        <Check size={14} style={{ color: 'var(--lc-success)' }} />
                      </button>
                      <Link
                        to={`/mistakes/${mistake.id}/edit`}
                        className="btn btn-sm btn-lc-secondary p-1 text-decoration-none"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        className="btn btn-sm btn-lc-secondary p-1 text-danger"
                        onClick={() => setDeleteTarget(mistake)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

export default MistakeHistoryPage;
