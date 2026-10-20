import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const ActivityHeatmap = ({ timeline = [], days = 120 }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Group days into columns of 7 days (Sunday to Saturday or Monday to Sunday)
  // timeline is an ordered array from (today - days) to today
  const totalRecorded = timeline.reduce((sum, item) => sum + (item.count || 0), 0);
  const activeDays = timeline.filter(item => item.count > 0).length;

  const getIntensityLevel = (count) => {
    if (!count || count === 0) return 'level-0';
    if (count === 1) return 'level-1';
    if (count === 2) return 'level-2';
    if (count === 3) return 'level-3';
    return 'level-4';
  };

  // Build grid columns of 7 items each
  const columns = [];
  let currentColumn = [];

  timeline.forEach((item, index) => {
    currentColumn.push(item);
    if (currentColumn.length === 7 || index === timeline.length - 1) {
      columns.push(currentColumn);
      currentColumn = [];
    }
  });

  const formatDateDisplay = (dateStr) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="lc-panel">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <Calendar size={16} style={{ color: 'var(--lc-accent)' }} />
          <span className="fw-semibold" style={{ color: 'var(--lc-text-primary)', fontSize: '13px' }}>
            Problem Log Activity
          </span>
          <span className="badge rounded-pill" style={{ backgroundColor: 'var(--lc-bg-secondary)', color: 'var(--lc-text-secondary)', fontSize: '11px', border: '1px solid var(--lc-border)' }}>
            {totalRecorded} mistakes in past {timeline.length || days} days
          </span>
        </div>

        <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: '12px' }}>
          <div>
            Active Days: <strong style={{ color: 'var(--lc-text-primary)' }}>{activeDays}</strong>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="lc-heatmap-container position-relative">
        {timeline.length === 0 ? (
          <div className="text-center py-4 text-muted" style={{ fontSize: '12px' }}>
            No activity records found for this period.
          </div>
        ) : (
          <div className="lc-heatmap-grid">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="lc-heatmap-col">
                {col.map((cell) => {
                  const levelClass = getIntensityLevel(cell.count);
                  const isHovered = hoveredCell?.date === cell.date;

                  return (
                    <div
                      key={cell.date}
                      className={`lc-heatmap-cell ${levelClass}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({
                          date: cell.date,
                          count: cell.count || 0,
                          x: rect.left + rect.width / 2,
                          y: rect.top
                        });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      aria-label={`${cell.count || 0} mistakes on ${cell.date}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Floating Tooltip */}
        {hoveredCell && (
          <div
            className="position-fixed shadow-sm px-2 py-1 rounded"
            style={{
              top: `${hoveredCell.y - 32}px`,
              left: `${hoveredCell.x}px`,
              transform: 'translateX(-50%)',
              backgroundColor: '#111111',
              border: '1px solid #444444',
              color: '#EEEEEE',
              fontSize: '11px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 9999
            }}
          >
            <strong>{hoveredCell.count}</strong> {hoveredCell.count === 1 ? 'mistake' : 'mistakes'} on {formatDateDisplay(hoveredCell.date)}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top" style={{ borderColor: 'var(--lc-border-subtle)', fontSize: '11px' }}>
        <span className="text-muted">
          Cell intensity reflects frequency of mistake logs and reviews
        </span>

        <div className="d-flex align-items-center gap-1">
          <span className="text-muted me-1">Less</span>
          <div className="lc-heatmap-cell level-0" style={{ cursor: 'default' }} />
          <div className="lc-heatmap-cell level-1" style={{ cursor: 'default' }} />
          <div className="lc-heatmap-cell level-2" style={{ cursor: 'default' }} />
          <div className="lc-heatmap-cell level-3" style={{ cursor: 'default' }} />
          <div className="lc-heatmap-cell level-4" style={{ cursor: 'default' }} />
          <span className="text-muted ms-1">More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
