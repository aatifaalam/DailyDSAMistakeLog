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
    <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 pt-3 mt-3 border-top" style={{ borderColor: 'var(--lc-border)' }}>
      <div className="d-flex align-items-center gap-3">
        <small className="text-muted" style={{ fontSize: '12px' }}>
          Showing <span style={{ color: 'var(--lc-text-primary)', fontWeight: 600 }}>{startIdx}–{endIdx}</span> of <span style={{ color: 'var(--lc-text-primary)', fontWeight: 600 }}>{totalElements}</span>
        </small>
        
        {onPageSizeChange && (
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted" style={{ fontSize: '12px' }}>Rows:</small>
            <select
              className="form-select form-select-sm py-0 px-2"
              style={{ width: 'auto', height: '26px', fontSize: '12px' }}
              value={pageSize}
              onChange={(e) => onPageChange && onPageSizeChange(Number(e.target.value))}
            >
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
        )}
      </div>

      <nav aria-label="LeetCode Pagination">
        <ul className="pagination pagination-sm mb-0 gap-1">
          <li className={`page-item ${pageNumber === 0 ? 'disabled' : ''}`}>
            <button 
              className="page-link rounded-1 p-1 d-flex align-items-center justify-content-center"
              onClick={() => onPageChange(pageNumber - 1)}
              disabled={pageNumber === 0}
              aria-label="Previous Page"
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: 'var(--lc-bg-secondary)',
                borderColor: 'var(--lc-border)',
                color: pageNumber === 0 ? 'var(--lc-text-muted)' : 'var(--lc-text-primary)'
              }}
            >
              <ChevronLeft size={14} />
            </button>
          </li>

          {getPageNumbers().map((num) => (
            <li key={num} className="page-item">
              <button 
                className="page-link rounded-1 fw-semibold d-flex align-items-center justify-content-center p-0"
                onClick={() => onPageChange(num)}
                style={{
                  width: '28px',
                  height: '28px',
                  fontSize: '12px',
                  backgroundColor: pageNumber === num ? 'var(--lc-accent)' : 'var(--lc-bg-secondary)',
                  borderColor: pageNumber === num ? 'var(--lc-accent)' : 'var(--lc-border)',
                  color: pageNumber === num ? '#1A1A1A' : 'var(--lc-text-primary)'
                }}
              >
                {num + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${pageNumber >= totalPages - 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link rounded-1 p-1 d-flex align-items-center justify-content-center"
              onClick={() => onPageChange(pageNumber + 1)}
              disabled={pageNumber >= totalPages - 1}
              aria-label="Next Page"
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: 'var(--lc-bg-secondary)',
                borderColor: 'var(--lc-border)',
                color: pageNumber >= totalPages - 1 ? 'var(--lc-text-muted)' : 'var(--lc-text-primary)'
              }}
            >
              <ChevronRight size={14} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
