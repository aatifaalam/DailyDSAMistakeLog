import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  confirmVariant = 'danger', 
  onConfirm, 
  onCancel,
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        onClick={!isLoading ? onCancel : undefined}
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
                  style={{ 
                    backgroundColor: confirmVariant === 'danger' ? 'rgba(239, 71, 67, 0.15)' : 'rgba(255, 161, 22, 0.15)',
                    color: confirmVariant === 'danger' ? 'var(--lc-error)' : 'var(--lc-accent)'
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
                  {title}
                </h2>
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-link text-muted p-1 text-decoration-none" 
                onClick={onCancel}
                disabled={isLoading}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="modal-body py-3 px-1" style={{ color: 'var(--lc-text-secondary)', fontSize: '0.875rem' }}>
              <p className="mb-0">{message}</p>
            </div>
            
            <div className="modal-footer border-0 pt-0 px-1 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-sm btn-lc-secondary" 
                onClick={onCancel}
                disabled={isLoading}
              >
                {cancelText}
              </button>
              <button 
                type="button" 
                className={`btn btn-sm ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-lc-primary'} px-3`} 
                onClick={onConfirm}
                disabled={isLoading}
                style={confirmVariant === 'danger' ? { backgroundColor: 'var(--lc-error)', borderColor: 'var(--lc-error)' } : undefined}
              >
                {isLoading && (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                )}
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
