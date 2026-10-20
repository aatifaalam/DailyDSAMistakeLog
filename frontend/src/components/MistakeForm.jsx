import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  AlertCircle, 
  ExternalLink,
  Clock,
  HardDrive,
  Info
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

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialSnapshot);
  }, [formData, initialSnapshot]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

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
      errors.firstApproach = 'Original approach is required';
    }
    if (!formData.whyWrong.trim()) {
      errors.whyWrong = 'Reason for failure is required';
    }
    if (!formData.mistakeType) {
      errors.mistakeType = 'Please select a mistake category';
    }
    if (!formData.whatToChangeNextTime.trim()) {
      errors.whatToChangeNextTime = 'Next-time strategy is required';
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
      window.scrollTo({ top: 80, behavior: 'smooth' });
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

  const errors = { ...clientErrors, ...(serverErrors || {}) };

  return (
    <>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Discard Changes"
        confirmVariant="warning"
        onConfirm={handleConfirmModal}
        onCancel={() => setConfirmModal({ isOpen: false, action: null, title: '', message: '' })}
      />

      <form onSubmit={handleSubmit} noValidate>
        {/* Top Control Bar */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <button 
            type="button" 
            className="btn btn-sm btn-lc-secondary d-inline-flex align-items-center gap-1"
            onClick={handleCancelClick}
          >
            <ArrowLeft size={14} />
            <span>Cancel</span>
          </button>

          <div className="d-flex align-items-center gap-2">
            {isDirty && (
              <span className="small text-muted font-mono d-none d-sm-inline" style={{ fontSize: '0.75rem' }}>
                Unsaved modifications
              </span>
            )}
            <button 
              type="button" 
              className="btn btn-sm btn-lc-secondary d-inline-flex align-items-center gap-1"
              onClick={handleResetClick}
              disabled={isLoading || !isDirty}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button 
              type="submit" 
              className="btn btn-sm btn-lc-primary d-inline-flex align-items-center gap-1 px-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              ) : (
                <Save size={14} />
              )}
              <span>{isEdit ? 'Update Mistake' : 'Save Mistake'}</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {serverErrors && serverErrors._general && (
          <div 
            className="p-3 mb-3 rounded d-flex align-items-center gap-2"
            style={{ backgroundColor: 'rgba(239, 71, 67, 0.1)', border: '1px solid var(--lc-error)', color: 'var(--lc-error)' }}
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="small">{serverErrors._general}</span>
          </div>
        )}

        {/* Section 1: Problem Identity */}
        <div className="lc-panel p-4 mb-3">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
            <div>
              <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                1. Problem Details
              </h2>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                Specify the target problem, algorithmic topic, and platform source.
              </small>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="problemName" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Problem Name <span style={{ color: 'var(--lc-error)' }}>*</span>
              </label>
              <input
                type="text"
                id="problemName"
                name="problemName"
                className={`form-control form-control-sm ${errors.problemName ? 'is-invalid' : ''}`}
                placeholder="e.g. Trapping Rain Water, LRU Cache, 3Sum"
                value={formData.problemName}
                onChange={handleChange}
                required
              />
              {errors.problemName && (
                <div className="invalid-feedback" style={{ fontSize: '0.72rem' }}>{errors.problemName}</div>
              )}
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="platform" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                className="form-select form-select-sm"
                value={formData.platform}
                onChange={handleChange}
              >
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="topic" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Topic
              </label>
              <select
                id="topic"
                name="topic"
                className="form-select form-select-sm"
                value={formData.topic}
                onChange={handleChange}
              >
                {TOPICS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="problemUrl" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Problem URL <span className="text-muted fw-normal">(Optional link)</span>
              </label>
              <div className="input-group input-group-sm">
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
                    className="btn btn-lc-secondary d-flex align-items-center"
                    title="Open problem link"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
              {errors.problemUrl && (
                <div className="text-danger small mt-1" style={{ fontSize: '0.72rem' }}>{errors.problemUrl}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Mistake Category */}
        <div className="lc-panel p-4 mb-3">
          <div className="mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
            <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
              2. Mistake Type / Archetype <span style={{ color: 'var(--lc-error)' }}>*</span>
            </h2>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              Select the fundamental reason why the initial solution did not pass.
            </small>
          </div>

          <div className="radio-tile-group">
            {MISTAKE_TYPES.map((type) => {
              const isSelected = formData.mistakeType === type.value;
              return (
                <label 
                  key={type.value}
                  className={`radio-tile ${isSelected ? 'selected' : ''}`}
                  style={{
                    cursor: 'pointer',
                    ...(isSelected ? {
                      borderColor: type.color || 'var(--lc-accent)',
                      backgroundColor: type.bg || 'rgba(255, 161, 22, 0.12)',
                      color: type.color || 'var(--lc-accent)',
                      boxShadow: `0 0 0 1px ${type.color || 'var(--lc-accent)'}`
                    } : {})
                  }}
                >
                  <input
                    type="radio"
                    name="mistakeType"
                    value={type.value}
                    checked={isSelected}
                    onChange={handleChange}
                    style={{
                      accentColor: type.color || 'var(--lc-accent)',
                      cursor: 'pointer'
                    }}
                  />
                  <span 
                    className="rounded-circle d-inline-block" 
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: type.color || 'var(--lc-accent)',
                      flexShrink: 0 
                    }} 
                  />
                  <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 600 : 500 }}>
                    {type.label}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.mistakeType && (
            <div className="text-danger small mt-2 d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
              <AlertCircle size={14} />
              <span>{errors.mistakeType}</span>
            </div>
          )}
        </div>

        {/* Section 3: Deep Retrospective (Two-column layout on desktop) */}
        <div className="lc-panel p-4 mb-3">
          <div className="mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
            <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
              3. Retrospective Analysis
            </h2>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              Deconstruct your intuition, identify the breakdown, and specify how to solve it. (Wrap code in ``` if needed)
            </small>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="firstApproach" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Original Approach <span style={{ color: 'var(--lc-error)' }}>*</span>
              </label>
              <textarea
                id="firstApproach"
                name="firstApproach"
                rows="4"
                className={`form-control form-control-sm ${errors.firstApproach ? 'is-invalid' : ''}`}
                placeholder="What was your initial intuition or greedy logic before failure?"
                value={formData.firstApproach}
                onChange={handleChange}
                required
              />
              {errors.firstApproach && (
                <div className="invalid-feedback" style={{ fontSize: '0.72rem' }}>{errors.firstApproach}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="whyWrong" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Why It Failed <span style={{ color: 'var(--lc-error)' }}>*</span>
              </label>
              <textarea
                id="whyWrong"
                name="whyWrong"
                rows="4"
                className={`form-control form-control-sm ${errors.whyWrong ? 'is-invalid' : ''}`}
                placeholder="Explain the flaw: missed edge case, quadratic TLE, boundary overflow..."
                value={formData.whyWrong}
                onChange={handleChange}
                required
              />
              {errors.whyWrong && (
                <div className="invalid-feedback" style={{ fontSize: '0.72rem' }}>{errors.whyWrong}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="correctApproach" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Correct Approach <span className="text-muted fw-normal">(Optimal method or code snippet)</span>
              </label>
              <textarea
                id="correctApproach"
                name="correctApproach"
                rows="4"
                className="form-control form-control-sm"
                placeholder="Describe the optimal invariant, dynamic programming state, or paste code..."
                value={formData.correctApproach}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="whatToChangeNextTime" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Next-Time Strategy <span style={{ color: 'var(--lc-error)' }}>*</span>
              </label>
              <textarea
                id="whatToChangeNextTime"
                name="whatToChangeNextTime"
                rows="4"
                className={`form-control form-control-sm ${errors.whatToChangeNextTime ? 'is-invalid' : ''}`}
                placeholder="Trigger/heuristic: 'Whenever array is sorted, think two pointers before binary search'..."
                value={formData.whatToChangeNextTime}
                onChange={handleChange}
                required
              />
              {errors.whatToChangeNextTime && (
                <div className="invalid-feedback" style={{ fontSize: '0.72rem' }}>{errors.whatToChangeNextTime}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Complexity, Review & Notes */}
        <div className="lc-panel p-4 mb-4">
          <div className="mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--lc-border)' }}>
            <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
              4. Complexity & Spaced Repetition
            </h2>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              Record algorithmic asymptotic complexity and review schedule.
            </small>
          </div>

          <div className="row g-3">
            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="timeComplexity" className="form-label small mb-1 d-flex align-items-center gap-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                <Clock size={12} /> Time Complexity
              </label>
              <input
                type="text"
                id="timeComplexity"
                name="timeComplexity"
                className="form-control form-control-sm font-mono"
                placeholder="e.g. O(n log n)"
                value={formData.timeComplexity}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="spaceComplexity" className="form-label small mb-1 d-flex align-items-center gap-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                <HardDrive size={12} /> Space Complexity
              </label>
              <input
                type="text"
                id="spaceComplexity"
                name="spaceComplexity"
                className="form-control form-control-sm font-mono"
                placeholder="e.g. O(1), O(n)"
                value={formData.spaceComplexity}
                onChange={handleChange}
              />
            </div>

            {isEdit && (
              <div className="col-12 col-sm-6 col-md-3">
                <label htmlFor="reviewStatus" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                  Review Status
                </label>
                <select
                  id="reviewStatus"
                  name="reviewStatus"
                  className="form-select form-select-sm"
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
              <label htmlFor="reviewDate" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Review Date
              </label>
              <input
                type="date"
                id="reviewDate"
                name="reviewDate"
                className="form-control form-control-sm"
                value={formData.reviewDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <div 
                className="form-check form-switch p-2 rounded" 
                style={{ backgroundColor: 'var(--lc-bg-main)', border: '1px solid var(--lc-border)' }}
              >
                <input
                  className="form-check-input ms-0 me-3"
                  type="checkbox"
                  id="solvedIndependently"
                  name="solvedIndependently"
                  checked={formData.solvedIndependently}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                <label className="form-check-label small fw-medium" htmlFor="solvedIndependently" style={{ cursor: 'pointer', color: 'var(--lc-text-primary)' }}>
                  Solved independently after review
                </label>
                <small className="d-block text-muted ms-4" style={{ fontSize: '0.75rem' }}>
                  Toggle on if you re-coded and passed all test cases independently without viewing hints.
                </small>
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="notes" className="form-label small mb-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.75rem' }}>
                Retrospective Notes & Edge Cases
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="2"
                className="form-control form-control-sm"
                placeholder="Any corner cases, company tags, interview reflections, or related problem numbers..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="d-flex align-items-center justify-content-between py-2 mb-4">
          <button 
            type="button" 
            className="btn btn-sm btn-lc-secondary"
            onClick={handleCancelClick}
          >
            Cancel
          </button>

          <div className="d-flex align-items-center gap-2">
            <button 
              type="button" 
              className="btn btn-sm btn-lc-secondary"
              onClick={handleResetClick}
              disabled={isLoading || !isDirty}
            >
              Reset
            </button>
            <button 
              type="submit" 
              className="btn btn-sm btn-lc-primary px-4"
              disabled={isLoading}
            >
              {isLoading && (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
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
