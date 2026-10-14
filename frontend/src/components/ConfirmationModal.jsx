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

  const btnClass = 
    confirmVariant === 'danger' 
      ? 'btn btn-danger' 
      : confirmVariant === 'warning'
      ? 'btn btn-warning'
      : 'btn btn-indigo';

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        onClick={!isLoading ? onCancel : undefined}
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
                <div className="text-warning p-2 rounded-circle" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
                  <AlertTriangle size={22} />
                </div>
                <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h5>
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-link text-reset p-1 text-decoration-none" 
                onClick={onCancel}
                disabled={isLoading}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body py-3" style={{ color: 'var(--text-secondary)' }}>
              <p className="mb-0">{message}</p>
            </div>
            
            <div className="modal-footer border-0 pt-0">
              <button 
                type="button" 
                className="btn btn-secondary-custom" 
                onClick={onCancel}
                disabled={isLoading}
              >
                {cancelText}
              </button>
              <button 
                type="button" 
                className={`${btnClass} px-3`} 
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                ) : null}
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
