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
  ExternalLink,
  Calendar,
  X,
  FileSpreadsheet
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
import LoadingSpinner from '../components/LoadingSpinner';
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
  const [size, setSize] = useState(10);
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
      // If last item on current page, go back a page
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

  // Quick toggle between REVIEWED and NOT_REVIEWED
  const handleQuickToggleReview = async (mistake) => {
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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Mistake History & Practice Log
          </h2>
          <p className="text-muted mb-0 small">
            Browse, search, filter, and review all recorded algorithmic mistakes.
          </p>
        </div>

        <button 
          className="btn btn-save d-inline-flex align-items-center gap-2"
          onClick={() => navigate('/mistakes/new')}
        >
          <Plus size={18} />
          <span>Record Mistake</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="custom-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          {/* Search Input */}
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by problem name or notes..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
              {search && (
                <button 
                  className="btn btn-link text-reset border-0 p-2 position-absolute end-0 top-50 translate-middle-y z-3"
                  onClick={() => { setSearch(''); setPage(0); }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sort Selector */}
          <div className="col-6 col-md-4">
            <select
              className="form-select"
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

          {/* Filter Toggle Button */}
          <div className="col-6 col-md-3 d-flex gap-2">
            <button
              type="button"
              className={`btn flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2 ${showFilters ? 'btn-indigo' : 'btn-secondary-custom'}`}
              onClick={() => setShowFilters(prev => !prev)}
            >
              <Filter size={17} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="badge rounded-pill bg-light text-dark ms-1">Active</span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary-custom p-2"
                onClick={handleResetFilters}
                title="Reset all filters"
              >
                <RotateCcw size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Extended Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small">Topic</label>
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
                <label className="form-label small">Mistake Type</label>
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

              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small">Platform</label>
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

              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small">Review Status</label>
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

              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small">From Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                />
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small">To Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner text="Loading mistake records from MySQL..." />
      ) : mistakes.length === 0 ? (
        <div className="custom-card empty-state p-5">
          <FileSpreadsheet size={48} className="text-muted mb-3" />
          <h3 className="h5 fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            No Mistakes Found
          </h3>
          <p className="text-muted mb-4 small" style={{ maxWidth: '420px', margin: '0 auto' }}>
            {hasActiveFilters 
              ? 'No records matched your search filters. Try clearing or relaxing some filters.'
              : 'You have not recorded any DSA mistakes yet. Log your first mistake to start tracking your progress!'}
          </p>
          {hasActiveFilters ? (
            <button className="btn btn-secondary-custom" onClick={handleResetFilters}>
              Clear All Filters
            </button>
          ) : (
            <button className="btn btn-save" onClick={() => navigate('/mistakes/new')}>
              Add Your First Mistake
            </button>
          )}
        </div>
      ) : (
        <div className="custom-card p-4">
          {/* Desktop Table View */}
          <div className="table-responsive d-none d-md-block">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Problem Name</th>
                  <th>Topic</th>
                  <th>Mistake Type</th>
                  <th>Date Recorded</th>
                  <th>Review Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mistakes.map((mistake) => (
                  <tr key={mistake.id}>
                    <td>
                      <div className="fw-semibold">
                        <Link 
                          to={`/mistakes/${mistake.id}`} 
                          className="text-decoration-none text-reset hover-underline"
                        >
                          {mistake.problemName}
                        </Link>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <PlatformBadge platform={mistake.platform} />
                        {mistake.problemUrl && (
                          <a 
                            href={mistake.problemUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-muted text-decoration-none"
                            title="Open external problem link"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        {mistake.timeComplexity && (
                          <span className="complexity-pill" style={{ fontSize: '0.72rem' }}>
                            {mistake.timeComplexity}
                          </span>
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
                      <small className="text-muted">{formatDate(mistake.createdAt)}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <ReviewStatusBadge status={mistake.reviewStatus} />
                        {mistake.reviewStatus === 'REVIEWED' ? (
                          <button
                            className="btn btn-sm btn-link text-warning p-0 text-decoration-none"
                            title="Reopen review"
                            onClick={() => handleQuickToggleReview(mistake)}
                          >
                            <small style={{ fontSize: '0.75rem' }}>(Reopen)</small>
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-link text-success p-0 text-decoration-none"
                            title="Mark as reviewed"
                            onClick={() => handleQuickToggleReview(mistake)}
                          >
                            <small style={{ fontSize: '0.75rem' }}>(Mark done)</small>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          className="btn btn-sm btn-secondary-custom p-1"
                          onClick={() => setReviewTarget(mistake)}
                          title="Full Review Workflow"
                        >
                          <CheckCircle2 size={16} className="text-success" />
                        </button>
                        <Link
                          to={`/mistakes/${mistake.id}`}
                          className="btn btn-sm btn-secondary-custom p-1 text-decoration-none"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/mistakes/${mistake.id}/edit`}
                          className="btn btn-sm btn-secondary-custom p-1 text-decoration-none"
                          title="Edit Mistake"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          className="btn btn-sm btn-secondary-custom p-1 text-danger"
                          onClick={() => setDeleteTarget(mistake)}
                          title="Delete Mistake"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="d-md-none">
            {mistakes.map((mistake) => (
              <div 
                key={mistake.id} 
                className="p-3 mb-3 rounded-3" 
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
              >
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <div>
                    <h3 className="fs-6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      <Link to={`/mistakes/${mistake.id}`} className="text-decoration-none text-reset">
                        {mistake.problemName}
                      </Link>
                    </h3>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      <PlatformBadge platform={mistake.platform} />
                      <TopicBadge topic={mistake.topic} />
                    </div>
                  </div>
                  <ReviewStatusBadge status={mistake.reviewStatus} />
                </div>

                <div className="my-2">
                  <MistakeTypeBadge type={mistake.mistakeType} />
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-2" style={{ borderColor: 'var(--border-color)' }}>
                  <small className="text-muted">{formatDate(mistake.createdAt)}</small>
                  
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-secondary-custom p-1"
                      onClick={() => setReviewTarget(mistake)}
                      title="Review"
                    >
                      <CheckCircle2 size={16} className="text-success" />
                    </button>
                    <Link
                      to={`/mistakes/${mistake.id}`}
                      className="btn btn-sm btn-secondary-custom p-1 text-decoration-none"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/mistakes/${mistake.id}/edit`}
                      className="btn btn-sm btn-secondary-custom p-1 text-decoration-none"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      className="btn btn-sm btn-secondary-custom p-1 text-danger"
                      onClick={() => setDeleteTarget(mistake)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
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
      )}
    </div>
  );
};

export default MistakeHistoryPage;
