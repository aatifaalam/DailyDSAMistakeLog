import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  pageNumber = 0, 
  totalPages = 1, 
  totalElements = 0, 
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}) => {
  if (totalElements === 0) return null;

  const startIdx = pageNumber * pageSize + 1;
  const endIdx = Math.min((pageNumber + 1) * pageSize, totalElements);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, pageNumber - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 pt-3 mt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
      <div className="d-flex align-items-center gap-3">
        <small className="text-muted">
          Showing <strong style={{ color: 'var(--text-primary)' }}>{startIdx}</strong> to <strong style={{ color: 'var(--text-primary)' }}>{endIdx}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalElements}</strong> mistakes
        </small>
        
        {onPageSizeChange && (
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">Rows:</small>
            <select
              className="form-select form-select-sm py-1 px-2"
              style={{ width: 'auto' }}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        )}
      </div>

      <nav aria-label="Pagination Navigation">
        <ul className="pagination pagination-sm mb-0 gap-1">
          <li className={`page-item ${pageNumber === 0 ? 'disabled' : ''}`}>
            <button 
              className="page-link rounded-2"
              onClick={() => onPageChange(pageNumber - 1)}
              disabled={pageNumber === 0}
              aria-label="Previous"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: pageNumber === 0 ? 'var(--text-muted)' : 'var(--text-primary)'
              }}
            >
              <ChevronLeft size={16} />
            </button>
          </li>

          {getPageNumbers().map((num) => (
            <li key={num} className="page-item">
              <button 
                className="page-link rounded-2 fw-medium"
                onClick={() => onPageChange(num)}
                style={{
                  backgroundColor: pageNumber === num ? '#6366f1' : 'var(--bg-card)',
                  borderColor: pageNumber === num ? '#6366f1' : 'var(--border-color)',
                  color: pageNumber === num ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                {num + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${pageNumber >= totalPages - 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link rounded-2"
              onClick={() => onPageChange(pageNumber + 1)}
              disabled={pageNumber >= totalPages - 1}
              aria-label="Next"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: pageNumber >= totalPages - 1 ? 'var(--text-muted)' : 'var(--text-primary)'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
