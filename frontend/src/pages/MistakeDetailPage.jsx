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
  RotateCcw
} from 'lucide-react';
import { MistakeService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import ReviewModal from '../components/ReviewModal';
import { MistakeTypeBadge, ReviewStatusBadge, TopicBadge, PlatformBadge } from '../components/BadgePill';
import { formatDate, formatDateTime } from '../utils/constants';

const MistakeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mistake, setMistake] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <LoadingSpinner text="Loading mistake details..." />;
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

      {/* Top Navigation Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <button 
          className="btn btn-secondary-custom d-inline-flex align-items-center gap-2"
          onClick={() => navigate('/mistakes')}
        >
          <ArrowLeft size={18} />
          <span>Back to Mistakes</span>
        </button>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-save d-inline-flex align-items-center gap-2 px-3"
            onClick={() => setShowReviewModal(true)}
          >
            <CheckCircle2 size={18} />
            <span>Review Mistake</span>
          </button>

          <Link
            to={`/mistakes/${id}/edit`}
            className="btn btn-secondary-custom d-inline-flex align-items-center gap-2 text-decoration-none"
          >
            <Edit size={17} />
            <span>Edit</span>
          </Link>

          <button
            className="btn btn-secondary-custom text-danger d-inline-flex align-items-center gap-2"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={17} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="custom-card p-4 p-md-5 mb-4">
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <PlatformBadge platform={mistake.platform} />
              <TopicBadge topic={mistake.topic} />
              <MistakeTypeBadge type={mistake.mistakeType} />
              <ReviewStatusBadge status={mistake.reviewStatus} />
            </div>

            <h1 className="h3 fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {mistake.problemName}
            </h1>

            {mistake.problemUrl && (
              <a 
                href={mistake.problemUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-decoration-none d-inline-flex align-items-center gap-1 small text-indigo"
                style={{ color: '#818cf8' }}
              >
                <span>Open problem on {mistake.platform || 'Platform'}</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          {/* Independent Resolution Flag */}
          <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', minWidth: '220px' }}>
            <div className="d-flex align-items-center gap-2 mb-1">
              <ShieldCheck size={18} className={mistake.solvedIndependently ? 'text-success' : 'text-muted'} />
              <span className="fw-semibold small" style={{ color: 'var(--text-primary)' }}>Independent Solve</span>
            </div>
            <span className={`badge ${mistake.solvedIndependently ? 'bg-success' : 'bg-secondary'}`}>
              {mistake.solvedIndependently ? 'Yes — Solved Independently' : 'Needs More Independent Practice'}
            </span>
          </div>
        </div>

        {/* Complexity Badges and Timestamps */}
        <div className="d-flex flex-wrap align-items-center gap-4 pt-3 border-top text-muted small" style={{ borderColor: 'var(--border-color)' }}>
          {mistake.timeComplexity && (
            <div className="d-flex align-items-center gap-1">
              <Clock size={16} />
              <span>Time: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{mistake.timeComplexity}</strong></span>
            </div>
          )}

          {mistake.spaceComplexity && (
            <div className="d-flex align-items-center gap-1">
              <HardDrive size={16} />
              <span>Space: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{mistake.spaceComplexity}</strong></span>
            </div>
          )}

          <div className="d-flex align-items-center gap-1">
            <Calendar size={16} />
            <span>Recorded: {formatDate(mistake.createdAt)}</span>
          </div>

          {mistake.reviewDate && (
            <div className="d-flex align-items-center gap-1 text-success">
              <CheckCircle2 size={16} />
              <span>Reviewed on: {formatDate(mistake.reviewDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* The 4 Distinct Retrospective Sections */}
      <div className="row g-4 mb-4">
        {/* Section 1: Original Approach */}
        <div className="col-12 col-lg-6">
          <div className="custom-card p-4 h-100" style={{ borderLeft: '4px solid #6366f1' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-2" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <Lightbulb size={20} />
              </div>
              <h2 className="h6 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                My First Approach
              </h2>
            </div>
            <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {mistake.firstApproach}
            </p>
          </div>
        </div>

        {/* Section 2: Why was it wrong? */}
        <div className="col-12 col-lg-6">
          <div className="custom-card p-4 h-100" style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-2" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                <AlertTriangle size={20} />
              </div>
              <h2 className="h6 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                Why was it wrong?
              </h2>
            </div>
            <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {mistake.whyWrong}
            </p>
          </div>
        </div>

        {/* Section 3: Correct Approach */}
        <div className="col-12 col-lg-6">
          <div className="custom-card p-4 h-100" style={{ borderLeft: '4px solid #10b981' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-2" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <CheckCircle2 size={20} />
              </div>
              <h2 className="h6 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                The Corrected Approach
              </h2>
            </div>
            <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {mistake.correctApproach || 'No optimal approach recorded yet.'}
            </p>
          </div>
        </div>

        {/* Section 4: What I will change next time */}
        <div className="col-12 col-lg-6">
          <div className="custom-card p-4 h-100" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-2" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <Sparkles size={20} />
              </div>
              <h2 className="h6 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                What I will change next time?
              </h2>
            </div>
            <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {mistake.whatToChangeNextTime}
            </p>
          </div>
        </div>
      </div>

      {/* Review Workflow & Notes Section */}
      <div className="custom-card p-4 p-md-5 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          <div className="d-flex align-items-center gap-2">
            <FileText size={20} className="text-muted" />
            <h2 className="h6 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
              Review Status & Practice Notes
            </h2>
          </div>
          <button 
            className="btn btn-sm btn-indigo d-inline-flex align-items-center gap-2"
            onClick={() => setShowReviewModal(true)}
          >
            <CheckCircle2 size={16} />
            <span>Update Review Status</span>
          </button>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.72rem' }}>
              Current Status
            </small>
            <ReviewStatusBadge status={mistake.reviewStatus} />
          </div>

          <div className="col-12 col-md-4">
            <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.72rem' }}>
              Last Review Date
            </small>
            <span className="fw-medium" style={{ color: 'var(--text-primary)' }}>
              {mistake.reviewDate ? formatDate(mistake.reviewDate) : 'Not yet reviewed'}
            </span>
          </div>

          <div className="col-12 col-md-4">
            <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.72rem' }}>
              Last Record Update
            </small>
            <span className="text-muted">
              {formatDateTime(mistake.updatedAt)}
            </span>
          </div>

          <div className="col-12">
            <small className="text-muted text-uppercase fw-bold d-block mb-2" style={{ fontSize: '0.72rem' }}>
              Retrospective Notes
            </small>
            <div className="p-3 rounded-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
              {mistake.notes ? (
                <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {mistake.notes}
                </p>
              ) : (
                <span className="text-muted fst-italic small">
                  No additional notes or edge case remarks logged for this problem.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MistakeDetailPage;
