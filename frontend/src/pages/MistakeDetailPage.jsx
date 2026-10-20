import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Calendar, 
  FileText,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Check,
  Copy,
  ChevronRight,
  Code2
} from 'lucide-react';
import { MistakeService } from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';
import ReviewModal from '../components/ReviewModal';
import { MistakeTypeBadge, ReviewStatusBadge, TopicBadge, PlatformBadge } from '../components/BadgePill';
import { formatDate, formatDateTime } from '../utils/constants';

// Helper to render text with code blocks or formatted monospace
const FormattedContent = ({ content, defaultText }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!content || !content.trim()) {
    return <span className="text-muted fst-italic small">{defaultText || 'No details provided.'}</span>;
  }

  // Check if content contains fenced code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let blockIndex = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }
    parts.push({
      type: 'code',
      lang: match[1] || 'code',
      content: match[2],
      id: blockIndex++
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  const handleCopy = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (parts.length === 1 && parts[0].type === 'text') {
    return (
      <p 
        className="mb-0" 
        style={{ 
          color: 'var(--lc-text-primary)', 
          whiteSpace: 'pre-wrap', 
          lineHeight: '1.7',
          fontSize: '0.9rem' 
        }}
      >
        {content}
      </p>
    );
  }

  return (
    <div>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return (
            <p 
              key={i} 
              className="mb-2" 
              style={{ 
                color: 'var(--lc-text-primary)', 
                whiteSpace: 'pre-wrap', 
                lineHeight: '1.7',
                fontSize: '0.9rem' 
              }}
            >
              {part.content}
            </p>
          );
        }
        return (
          <div 
            key={i} 
            className="my-3 rounded overflow-hidden" 
            style={{ 
              backgroundColor: 'var(--lc-bg-main)', 
              border: '1px solid var(--lc-border)' 
            }}
          >
            <div 
              className="d-flex align-items-center justify-content-between px-3 py-1 border-bottom"
              style={{ backgroundColor: 'var(--lc-bg-sidebar)', borderColor: 'var(--lc-border)' }}
            >
              <span className="small text-muted font-mono" style={{ fontSize: '0.72rem' }}>
                {part.lang}
              </span>
              <button 
                type="button" 
                className="btn btn-link text-muted p-0 d-inline-flex align-items-center gap-1 text-decoration-none"
                onClick={() => handleCopy(part.content, part.id)}
                style={{ fontSize: '0.72rem' }}
              >
                {copiedIndex === part.id ? (
                  <>
                    <Check size={12} style={{ color: 'var(--lc-success)' }} />
                    <span style={{ color: 'var(--lc-success)' }}>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre 
              className="p-3 mb-0 font-mono" 
              style={{ 
                color: '#e6edf3', 
                fontSize: '0.85rem', 
                overflowX: 'auto',
                lineHeight: '1.5' 
              }}
            >
              <code>{part.content}</code>
            </pre>
          </div>
        );
      })}
    </div>
  );
};

const MistakeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mistake, setMistake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ANALYSIS' | 'COMPLEXITY' | 'REVIEW'
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isUpdatingReview, setIsUpdatingReview] = useState(false);

  const fetchMistake = async () => {
    try {
      setLoading(true);
      const data = await MistakeService.getMistakeById(id);
      setMistake(data);
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
      navigate('/mistakes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMistake();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await MistakeService.deleteMistake(id);
      showToast({ message: `"${mistake?.problemName}" deleted successfully`, type: 'success' });
      navigate('/mistakes');
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSaveReview = async (reviewData) => {
    try {
      setIsUpdatingReview(true);
      const updated = await MistakeService.updateReview(id, reviewData);
      setMistake(updated);
      showToast({ message: 'Review recorded successfully!', type: 'success' });
      setShowReviewModal(false);
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setIsUpdatingReview(false);
    }
  };

  const handleQuickReviewStatus = async (status) => {
    try {
      const reviewData = {
        reviewStatus: status,
        reviewDate: status === 'REVIEWED' ? new Date().toISOString().split('T')[0] : (mistake.reviewDate || null),
        notes: mistake.notes
      };
      const updated = await MistakeService.updateReview(id, reviewData);
      setMistake(updated);
      showToast({ 
        message: status === 'REVIEWED' ? 'Marked as Reviewed' : 'Scheduled for another review', 
        type: 'success' 
      });
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="lc-panel p-5 text-center">
        <div className="spinner-border spinner-border-sm text-warning mb-2" role="status" />
        <p className="small text-muted mb-0">Loading problem workspace...</p>
      </div>
    );
  }

  if (!mistake) return null;

  return (
    <div>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Mistake Record"
        message={`Are you sure you want to permanently delete the log for "${mistake.problemName}"? This action cannot be reversed.`}
        confirmText="Delete Mistake"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        mistake={mistake}
        isLoading={isUpdatingReview}
        onClose={() => setShowReviewModal(false)}
        onSave={handleSaveReview}
      />

      {/* Breadcrumb / Top Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-sm btn-lc-secondary d-inline-flex align-items-center gap-1"
            onClick={() => navigate('/mistakes')}
          >
            <ArrowLeft size={14} />
            <span>Problemset</span>
          </button>
          <span style={{ color: 'var(--lc-text-muted)' }}>/</span>
          <span className="small text-muted font-mono">{mistake.topic || 'DSA'}</span>
          <span style={{ color: 'var(--lc-text-muted)' }}>/</span>
          <span className="small fw-medium" style={{ color: 'var(--lc-text-primary)' }}>
            {mistake.problemName}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          {mistake.reviewStatus !== 'REVIEWED' ? (
            <button
              className="btn btn-sm btn-lc-primary d-inline-flex align-items-center gap-1"
              onClick={() => handleQuickReviewStatus('REVIEWED')}
            >
              <Check size={14} />
              <span>Mark Reviewed</span>
            </button>
          ) : (
            <button
              className="btn btn-sm btn-lc-secondary d-inline-flex align-items-center gap-1"
              onClick={() => handleQuickReviewStatus('NEEDS_ANOTHER_REVIEW')}
            >
              <RotateCcw size={13} style={{ color: 'var(--lc-accent)' }} />
              <span>Schedule Next Review</span>
            </button>
          )}

          <button
            className="btn btn-sm btn-lc-secondary d-inline-flex align-items-center gap-1"
            onClick={() => setShowReviewModal(true)}
            title="Edit review notes & status"
          >
            <FileText size={14} />
            <span className="d-none d-sm-inline">Review Notes</span>
          </button>

          <Link
            to={`/mistakes/${id}/edit`}
            className="btn btn-sm btn-lc-secondary d-inline-flex align-items-center gap-1 text-decoration-none"
          >
            <Edit size={14} />
            <span className="d-none d-sm-inline">Edit</span>
          </Link>

          <button
            className="btn btn-sm btn-lc-secondary text-danger d-inline-flex align-items-center gap-1"
            onClick={() => setShowDeleteModal(true)}
            title="Delete Mistake"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Workspace Header (LeetCode Problem Header) */}
      <div className="lc-panel p-4 mb-3">
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <PlatformBadge platform={mistake.platform} />
              <TopicBadge topic={mistake.topic} />
              <MistakeTypeBadge type={mistake.mistakeType} />
              <ReviewStatusBadge status={mistake.reviewStatus} />
            </div>

            <h1 className="h4 fw-bold mb-1" style={{ color: 'var(--lc-text-primary)' }}>
              {mistake.problemName}
            </h1>

            {mistake.problemUrl && (
              <a 
                href={mistake.problemUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-decoration-none d-inline-flex align-items-center gap-1 small mt-1"
                style={{ color: 'var(--lc-info)' }}
              >
                <span>View on {mistake.platform || 'Platform'}</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Quick Metrics Badge */}
          <div 
            className="p-2 rounded text-end"
            style={{ 
              backgroundColor: 'var(--lc-bg-main)', 
              border: '1px solid var(--lc-border)',
              minWidth: '180px'
            }}
          >
            <div className="d-flex align-items-center justify-content-end gap-1 mb-1">
              <ShieldCheck size={14} style={{ color: mistake.solvedIndependently ? 'var(--lc-success)' : 'var(--lc-text-muted)' }} />
              <span className="small fw-semibold" style={{ color: 'var(--lc-text-primary)', fontSize: '0.75rem' }}>
                {mistake.solvedIndependently ? 'Solved Independently' : 'Needed Hints / Solution'}
              </span>
            </div>
            <div className="font-mono text-muted" style={{ fontSize: '0.72rem' }}>
              Logged: {formatDate(mistake.createdAt)}
            </div>
          </div>
        </div>

        {/* Complexity & Timestamps Strip */}
        <div 
          className="d-flex flex-wrap align-items-center gap-4 pt-3 border-top small" 
          style={{ borderColor: 'var(--lc-border)' }}
        >
          <div className="d-flex align-items-center gap-1">
            <Clock size={14} className="text-muted" />
            <span className="text-muted">Time:</span>
            <span className="font-mono fw-semibold" style={{ color: 'var(--lc-text-primary)' }}>
              {mistake.timeComplexity || 'Not specified'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-1">
            <HardDrive size={14} className="text-muted" />
            <span className="text-muted">Space:</span>
            <span className="font-mono fw-semibold" style={{ color: 'var(--lc-text-primary)' }}>
              {mistake.spaceComplexity || 'Not specified'}
            </span>
          </div>

          {mistake.reviewDate && (
            <div className="d-flex align-items-center gap-1" style={{ color: 'var(--lc-success)' }}>
              <CheckCircle2 size={14} />
              <span>Last reviewed: {formatDate(mistake.reviewDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* LeetCode Workspace Tab Navigation */}
      <div className="d-flex gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'var(--lc-border)' }}>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'ALL' ? 'btn-lc-primary' : 'btn-lc-secondary'}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Sections
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'ANALYSIS' ? 'btn-lc-primary' : 'btn-lc-secondary'}`}
          onClick={() => setActiveTab('ANALYSIS')}
        >
          Solution Breakdown
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'COMPLEXITY' ? 'btn-lc-primary' : 'btn-lc-secondary'}`}
          onClick={() => setActiveTab('COMPLEXITY')}
        >
          Complexity & Strategy
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'REVIEW' ? 'btn-lc-primary' : 'btn-lc-secondary'}`}
          onClick={() => setActiveTab('REVIEW')}
        >
          Review & Notes
        </button>
      </div>

      {/* Sections Workspace */}
      <div className="row g-3">
        {/* Section 1: Original Approach */}
        {(activeTab === 'ALL' || activeTab === 'ANALYSIS') && (
          <div className="col-12 col-lg-6">
            <div className="lc-panel p-3 h-100" style={{ borderLeft: '3px solid var(--lc-info)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Lightbulb size={16} style={{ color: 'var(--lc-info)' }} />
                <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                  Section 1: Original Approach
                </h2>
              </div>
              <FormattedContent content={mistake.firstApproach} defaultText="No initial approach recorded." />
            </div>
          </div>
        )}

        {/* Section 2: Why It Failed */}
        {(activeTab === 'ALL' || activeTab === 'ANALYSIS') && (
          <div className="col-12 col-lg-6">
            <div className="lc-panel p-3 h-100" style={{ borderLeft: '3px solid var(--lc-error)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <AlertTriangle size={16} style={{ color: 'var(--lc-error)' }} />
                <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                  Section 2: Why It Failed
                </h2>
              </div>
              <FormattedContent content={mistake.whyWrong} defaultText="No failure explanation recorded." />
            </div>
          </div>
        )}

        {/* Section 3: Correct Approach */}
        {(activeTab === 'ALL' || activeTab === 'ANALYSIS') && (
          <div className="col-12">
            <div className="lc-panel p-3" style={{ borderLeft: '3px solid var(--lc-success)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <CheckCircle2 size={16} style={{ color: 'var(--lc-success)' }} />
                <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                  Section 3: Correct Approach
                </h2>
              </div>
              <FormattedContent content={mistake.correctApproach} defaultText="No optimal approach recorded." />
            </div>
          </div>
        )}

        {/* Section 4: Complexity Analysis */}
        {(activeTab === 'ALL' || activeTab === 'COMPLEXITY') && (
          <div className="col-12 col-lg-6">
            <div className="lc-panel p-3 h-100" style={{ borderLeft: '3px solid var(--lc-accent)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Code2 size={16} style={{ color: 'var(--lc-accent)' }} />
                <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                  Section 4: Complexity Analysis
                </h2>
              </div>
              <div className="d-flex flex-column gap-2 mt-2">
                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: 'var(--lc-bg-main)' }}>
                  <span className="small text-muted">Time Complexity</span>
                  <span className="font-mono fw-bold" style={{ color: 'var(--lc-accent)' }}>
                    {mistake.timeComplexity || 'O(?)'}
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: 'var(--lc-bg-main)' }}>
                  <span className="small text-muted">Space Complexity</span>
                  <span className="font-mono fw-bold" style={{ color: 'var(--lc-info)' }}>
                    {mistake.spaceComplexity || 'O(?)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Next-Time Strategy */}
        {(activeTab === 'ALL' || activeTab === 'COMPLEXITY') && (
          <div className="col-12 col-lg-6">
            <div className="lc-panel p-3 h-100" style={{ borderLeft: '3px solid #FFC01E' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Sparkles size={16} style={{ color: '#FFC01E' }} />
                <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                  Section 5: Next-Time Strategy
                </h2>
              </div>
              <FormattedContent content={mistake.whatToChangeNextTime} defaultText="No next-time heuristics logged." />
            </div>
          </div>
        )}

        {/* Section 6: Review History & Notes */}
        {(activeTab === 'ALL' || activeTab === 'REVIEW') && (
          <div className="col-12">
            <div className="lc-panel p-4" style={{ borderLeft: '3px solid var(--lc-text-muted)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
                <div className="d-flex align-items-center gap-2">
                  <FileText size={16} className="text-muted" />
                  <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                    Section 6: Review History & Retrospective Notes
                  </h2>
                </div>
                <button 
                  className="btn btn-sm btn-lc-secondary"
                  onClick={() => setShowReviewModal(true)}
                >
                  Update Review
                </button>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>Current Review Status</div>
                  <ReviewStatusBadge status={mistake.reviewStatus} />
                </div>
                <div className="col-12 col-md-4">
                  <div className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>Review Date</div>
                  <span className="small font-mono" style={{ color: 'var(--lc-text-primary)' }}>
                    {mistake.reviewDate ? formatDate(mistake.reviewDate) : 'Not yet reviewed'}
                  </span>
                </div>
                <div className="col-12 col-md-4">
                  <div className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>Last Updated</div>
                  <span className="small font-mono text-muted">
                    {formatDateTime(mistake.updatedAt)}
                  </span>
                </div>
                <div className="col-12">
                  <div className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>Review Notes & Takeaways</div>
                  <div 
                    className="p-3 rounded" 
                    style={{ backgroundColor: 'var(--lc-bg-main)', border: '1px solid var(--lc-border)' }}
                  >
                    <FormattedContent content={mistake.notes} defaultText="No additional review notes recorded." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MistakeDetailPage;
