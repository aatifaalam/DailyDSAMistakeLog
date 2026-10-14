import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  AlertCircle, 
  ExternalLink,
  HelpCircle,
  Clock,
  HardDrive
} from 'lucide-react';
import { MISTAKE_TYPES, PLATFORMS, TOPICS, REVIEW_STATUSES } from '../utils/constants';
import ConfirmationModal from './ConfirmationModal';

const defaultFormState = {
  problemName: '',
  platform: 'LeetCode',
  problemUrl: '',
  topic: 'Arrays',
  firstApproach: '',
  whyWrong: '',
  mistakeType: 'WRONG_ALGORITHM',
  correctApproach: '',
  whatToChangeNextTime: '',
  timeComplexity: '',
  spaceComplexity: '',
  solvedIndependently: false,
  reviewStatus: 'NOT_REVIEWED',
  reviewDate: '',
  notes: ''
};

const MistakeForm = ({ 
  initialData = null, 
  onSubmit, 
  isEdit = false, 
  isLoading = false,
  serverErrors = null 
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(defaultFormState);
  const [initialSnapshot, setInitialSnapshot] = useState(defaultFormState);
  const [clientErrors, setClientErrors] = useState({});
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '' });

  useEffect(() => {
    if (initialData) {
      const formatted = {
        problemName: initialData.problemName || '',
        platform: initialData.platform || 'LeetCode',
        problemUrl: initialData.problemUrl || '',
        topic: initialData.topic || 'Arrays',
        firstApproach: initialData.firstApproach || '',
        whyWrong: initialData.whyWrong || '',
        mistakeType: initialData.mistakeType || 'WRONG_ALGORITHM',
        correctApproach: initialData.correctApproach || '',
        whatToChangeNextTime: initialData.whatToChangeNextTime || '',
        timeComplexity: initialData.timeComplexity || '',
        spaceComplexity: initialData.spaceComplexity || '',
        solvedIndependently: Boolean(initialData.solvedIndependently),
        reviewStatus: initialData.reviewStatus || 'NOT_REVIEWED',
        reviewDate: initialData.reviewDate || '',
        notes: initialData.notes || ''
      };
      setFormData(formatted);
      setInitialSnapshot(formatted);
    }
  }, [initialData]);

  // Track whether form has unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialSnapshot);
  }, [formData, initialSnapshot]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear client validation error on change
    if (clientErrors[name]) {
      setClientErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.problemName.trim()) {
      errors.problemName = 'Problem name is required';
    }
    if (!formData.firstApproach.trim()) {
      errors.firstApproach = 'My first approach is required';
    }
    if (!formData.whyWrong.trim()) {
      errors.whyWrong = 'Why was it wrong is required';
    }
    if (!formData.mistakeType) {
      errors.mistakeType = 'Please select a mistake category';
    }
    if (!formData.whatToChangeNextTime.trim()) {
      errors.whatToChangeNextTime = 'What will I change next time is required';
    }
    if (formData.problemUrl && formData.problemUrl.trim()) {
      const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
      if (!urlPattern.test(formData.problemUrl.trim())) {
        errors.problemUrl = 'Please enter a valid URL (starting with http:// or https://)';
      }
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // scroll to first error
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    onSubmit({
      ...formData,
      problemName: formData.problemName.trim(),
      problemUrl: formData.problemUrl.trim() || null,
      timeComplexity: formData.timeComplexity.trim() || null,
      spaceComplexity: formData.spaceComplexity.trim() || null,
      reviewDate: formData.reviewDate || null,
      notes: formData.notes.trim() || null
    });
  };

  const handleResetClick = () => {
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        action: 'reset',
        title: 'Reset Form Changes?',
        message: 'Are you sure you want to discard your changes and reset the form to initial values?'
      });
    } else {
      setFormData(initialSnapshot);
      setClientErrors({});
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        action: 'cancel',
        title: 'Discard Unsaved Changes?',
        message: 'You have unsaved changes in this form. Are you sure you want to leave this page?'
      });
    } else {
      navigate(-1);
    }
  };

  const handleConfirmModal = () => {
    if (confirmModal.action === 'reset') {
      setFormData(initialSnapshot);
      setClientErrors({});
    } else if (confirmModal.action === 'cancel') {
      navigate(-1);
    }
    setConfirmModal({ isOpen: false, action: null, title: '', message: '' });
  };

  // Merge client and server validation errors
  const errors = { ...clientErrors, ...(serverErrors || {}) };

  return (
    <>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Yes, Discard"
        confirmVariant="warning"
        onConfirm={handleConfirmModal}
        onCancel={() => setConfirmModal({ isOpen: false, action: null, title: '', message: '' })}
      />

      <form onSubmit={handleSubmit} noValidate>
        {/* Top Action Bar */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <button 
            type="button" 
            className="btn btn-secondary-custom d-inline-flex align-items-center gap-2"
            onClick={handleCancelClick}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="d-flex align-items-center gap-2">
            <button 
              type="button" 
              className="btn btn-secondary-custom d-inline-flex align-items-center gap-2"
              onClick={handleResetClick}
              disabled={isLoading || !isDirty}
            >
              <RotateCcw size={17} />
              <span>Reset</span>
            </button>

            <button 
              type="submit" 
              className="btn btn-save d-inline-flex align-items-center gap-2 px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              ) : (
                <Save size={18} />
              )}
              <span>{isEdit ? 'Update Mistake' : 'Save Mistake'}</span>
            </button>
          </div>
        </div>

        {/* Global Server Error Alert if any */}
        {serverErrors && serverErrors._general && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
            <AlertCircle size={20} className="flex-shrink-0" />
            <div>{serverErrors._general}</div>
          </div>
        )}

        {/* Section 1: Problem Identity */}
        <div className="custom-card p-4 p-md-5 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <h2 className="h5 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>1. Problem Identification</h2>
              <small className="text-muted">Problem details, platform source, and algorithmic topic.</small>
            </div>
            {isDirty && (
              <span className="badge rounded-pill bg-warning text-dark px-3 py-2 fw-semibold">
                Unsaved Changes
              </span>
            )}
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <label htmlFor="problemName" className="form-label">
                Problem Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="problemName"
                name="problemName"
                className={`form-control ${errors.problemName ? 'is-invalid' : ''}`}
                placeholder="e.g. Daily Temperatures, 3Sum, LRU Cache"
                value={formData.problemName}
                onChange={handleChange}
                required
              />
              {errors.problemName && (
                <div className="invalid-feedback">{errors.problemName}</div>
              )}
            </div>

            <div className="col-12 col-md-3">
              <label htmlFor="platform" className="form-label">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                className="form-select"
                value={formData.platform}
                onChange={handleChange}
              >
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-3">
              <label htmlFor="topic" className="form-label">
                Topic
              </label>
              <select
                id="topic"
                name="topic"
                className="form-select"
                value={formData.topic}
                onChange={handleChange}
              >
                {TOPICS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="problemUrl" className="form-label">
                Problem URL <small className="text-muted fw-normal">(Optional link to LeetCode/HackerRank)</small>
              </label>
              <div className="input-group">
                <input
                  type="url"
                  id="problemUrl"
                  name="problemUrl"
                  className={`form-control ${errors.problemUrl ? 'is-invalid' : ''}`}
                  placeholder="https://leetcode.com/problems/..."
                  value={formData.problemUrl}
                  onChange={handleChange}
                />
                {formData.problemUrl && (
                  <a
                    href={formData.problemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary-custom d-flex align-items-center"
                    title="Open problem link"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                {errors.problemUrl && (
                  <div className="invalid-feedback d-block">{errors.problemUrl}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Mistake Categorization */}
        <div className="custom-card p-4 p-md-5 mb-4">
          <div className="mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="h5 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              2. Mistake Type <span className="text-danger">*</span>
            </h2>
            <small className="text-muted">Select the root category behind what went wrong.</small>
          </div>

          <div className="radio-tile-group">
            {MISTAKE_TYPES.map((type) => {
              const isSelected = formData.mistakeType === type.value;
              return (
                <label 
                  key={type.value}
                  className={`radio-tile ${isSelected ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="mistakeType"
                    value={type.value}
                    checked={isSelected}
                    onChange={handleChange}
                  />
                  <div>
                    <div className="fw-semibold small" style={{ color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                      {type.label}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          {errors.mistakeType && (
            <div className="text-danger small mt-2 d-flex align-items-center gap-1">
              <AlertCircle size={16} />
              <span>{errors.mistakeType}</span>
            </div>
          )}
        </div>

        {/* Section 3: Deep Retrospective */}
        <div className="custom-card p-4 p-md-5 mb-4">
          <div className="mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="h5 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              3. Retrospective Analysis
            </h2>
            <small className="text-muted">Articulate the failure and solidify the mental model.</small>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <label htmlFor="firstApproach" className="form-label">
                My First Approach <span className="text-danger">*</span>
              </label>
              <textarea
                id="firstApproach"
                name="firstApproach"
                rows="4"
                className={`form-control ${errors.firstApproach ? 'is-invalid' : ''}`}
                placeholder="What was your initial intuition or algorithm before finding out it failed?"
                value={formData.firstApproach}
                onChange={handleChange}
                required
              />
              {errors.firstApproach && (
                <div className="invalid-feedback">{errors.firstApproach}</div>
              )}
            </div>

            <div className="col-12 col-lg-6">
              <label htmlFor="whyWrong" className="form-label">
                Why was it wrong? <span className="text-danger">*</span>
              </label>
              <textarea
                id="whyWrong"
                name="whyWrong"
                rows="4"
                className={`form-control ${errors.whyWrong ? 'is-invalid' : ''}`}
                placeholder="Explain the flaw: missed edge case, wrong greedy assumption, quadratic time limit, etc."
                value={formData.whyWrong}
                onChange={handleChange}
                required
              />
              {errors.whyWrong && (
                <div className="invalid-feedback">{errors.whyWrong}</div>
              )}
            </div>

            <div className="col-12 col-lg-6">
              <label htmlFor="correctApproach" className="form-label">
                Correct Approach <small className="text-muted fw-normal">(Optimal method)</small>
              </label>
              <textarea
                id="correctApproach"
                name="correctApproach"
                rows="4"
                className="form-control"
                placeholder="Describe the optimal algorithm, invariant, or data structure pattern..."
                value={formData.correctApproach}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-lg-6">
              <label htmlFor="whatToChangeNextTime" className="form-label">
                What will I change next time? <span className="text-danger">*</span>
              </label>
              <textarea
                id="whatToChangeNextTime"
                name="whatToChangeNextTime"
                rows="4"
                className={`form-control ${errors.whatToChangeNextTime ? 'is-invalid' : ''}`}
                placeholder="Key trigger or rule: 'Whenever I see X, test Y and remember Z'..."
                value={formData.whatToChangeNextTime}
                onChange={handleChange}
                required
              />
              {errors.whatToChangeNextTime && (
                <div className="invalid-feedback">{errors.whatToChangeNextTime}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Complexity & Review Tracking */}
        <div className="custom-card p-4 p-md-5 mb-4">
          <div className="mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="h5 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              4. Complexity, Review & Notes
            </h2>
            <small className="text-muted">Target asymptotic complexities and review schedule.</small>
          </div>

          <div className="row g-4">
            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="timeComplexity" className="form-label">
                <Clock size={16} className="text-muted" /> Time Complexity
              </label>
              <input
                type="text"
                id="timeComplexity"
                name="timeComplexity"
                className="form-control font-mono"
                placeholder="e.g. O(n), O(log n)"
                value={formData.timeComplexity}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="spaceComplexity" className="form-label">
                <HardDrive size={16} className="text-muted" /> Space Complexity
              </label>
              <input
                type="text"
                id="spaceComplexity"
                name="spaceComplexity"
                className="form-control font-mono"
                placeholder="e.g. O(1), O(n)"
                value={formData.spaceComplexity}
                onChange={handleChange}
              />
            </div>

            {isEdit && (
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="reviewStatus" className="form-label">
                  Review Status
                </label>
                <select
                  id="reviewStatus"
                  name="reviewStatus"
                  className="form-select"
                  value={formData.reviewStatus}
                  onChange={handleChange}
                >
                  {REVIEW_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className={`col-12 col-sm-6 ${isEdit ? 'col-md-3' : 'col-md-6'}`}>
              <label htmlFor="reviewDate" className="form-label">
                Review Date
              </label>
              <input
                type="date"
                id="reviewDate"
                name="reviewDate"
                className="form-control"
                value={formData.reviewDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <div className="form-check form-switch p-2 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <input
                  className="form-check-input ms-0 me-3"
                  type="checkbox"
                  id="solvedIndependently"
                  name="solvedIndependently"
                  checked={formData.solvedIndependently}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                <label className="form-check-label fw-semibold" htmlFor="solvedIndependently" style={{ cursor: 'pointer', color: 'var(--text-primary)' }}>
                  Solved independently after review
                </label>
                <small className="d-block text-muted ms-5" style={{ fontSize: '0.8rem' }}>
                  Check this if you were able to re-implement the optimal solution without consulting external solutions.
                </small>
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="notes" className="form-label">
                Additional Notes & Edge Cases
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="form-control"
                placeholder="Any special trick, caveat, related problems, or interview context..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="d-flex align-items-center justify-content-between py-3 mb-5">
          <button 
            type="button" 
            className="btn btn-secondary-custom"
            onClick={handleCancelClick}
          >
            Cancel
          </button>

          <div className="d-flex align-items-center gap-2">
            <button 
              type="button" 
              className="btn btn-secondary-custom"
              onClick={handleResetClick}
              disabled={isLoading || !isDirty}
            >
              Reset
            </button>
            <button 
              type="submit" 
              className="btn btn-save px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              ) : (
                <Save size={18} className="me-2" />
              )}
              <span>{isEdit ? 'Update Mistake' : 'Save Mistake'}</span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default MistakeForm;
