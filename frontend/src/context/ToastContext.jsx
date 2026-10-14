import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ message, type = 'success', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => {
          const bgClass =
            toast.type === 'error'
              ? 'bg-danger text-white'
              : toast.type === 'warning'
              ? 'bg-warning text-dark'
              : toast.type === 'info'
              ? 'bg-info text-dark'
              : 'bg-success text-white';

          const IconComponent =
            toast.type === 'error'
              ? AlertCircle
              : toast.type === 'warning'
              ? AlertTriangle
              : toast.type === 'info'
              ? Info
              : CheckCircle2;

          return (
            <div
              key={toast.id}
              className={`toast show align-items-center border-0 shadow-lg mb-2 ${bgClass}`}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              style={{ minWidth: '300px', borderRadius: '10px' }}
            >
              <div className="d-flex p-2 align-items-center">
                <div className="me-2 d-flex align-items-center">
                  <IconComponent size={20} />
                </div>
                <div className="toast-body flex-grow-1 py-1 px-2 fw-medium">
                  {toast.message}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-reset p-1 text-decoration-none"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
