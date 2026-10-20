import React, { useState } from 'react';
import { Layers, ArrowDown, Eye, RotateCcw, Plus, Trash2 } from 'lucide-react';

const StackVisualizer = () => {
  const [stack, setStack] = useState(["Plate 1", "Plate 2", "Plate 3"]);
  const [inputVal, setInputVal] = useState('');
  const [log, setLog] = useState("Stack initialized with 3 plates. Plate 3 is currently on Top (LIFO).");

  const handlePush = (e) => {
    e.preventDefault();
    const val = inputVal.trim() || `Plate ${stack.length + 1}`;
    if (stack.length >= 6) {
      setLog("Plate stack is full for this demo! Pop a plate first.");
      return;
    }
    setStack(prev => [...prev, val]);
    setInputVal('');
    setLog(`PUSH: Placed '${val}' on top in O(1) time. It will be the FIRST one removed!`);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setLog("Cannot POP from an empty stack (Stack Underflow)!");
      return;
    }
    const popped = stack[stack.length - 1];
    setStack(prev => prev.slice(0, prev.length - 1));
    setLog(`POP: Removed '${popped}' from top in O(1) time (Last-In, First-Out).`);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setLog("Stack is empty.");
      return;
    }
    const top = stack[stack.length - 1];
    setLog(`PEEK: Looked at top item '${top}' in O(1) time without removing it.`);
  };

  const handleReset = () => {
    setStack(["Plate 1", "Plate 2", "Plate 3"]);
    setLog("Reset stack to 3 initial plates.");
  };

  return (
    <div 
      className="p-4 my-3 rounded-4 transition-all"
      style={{ 
        backgroundColor: 'var(--learn-surface)', 
        border: '1px solid var(--learn-border)',
        boxShadow: 'var(--learn-card-shadow)'
      }}
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <span className="learn-stage-pill stage-explore">
          <Layers size={13} />
          Interactive Stack: Last-In, First-Out (LIFO)
        </span>

        {/* Action Controls */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          <form onSubmit={handlePush} className="d-flex gap-1">
            <input
              type="text"
              placeholder="e.g. Plate 4"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="form-control form-control-sm font-mono"
              style={{ 
                width: '110px', 
                height: '32px', 
                fontSize: '0.8rem',
                backgroundColor: 'var(--learn-surface-secondary)',
                color: 'var(--learn-text)',
                borderColor: 'var(--learn-border)'
              }}
            />
            <button 
              type="submit" 
              className="btn btn-sm btn-learn-primary py-1 px-3" 
              style={{ fontSize: '0.78rem', height: '32px' }}
            >
              <Plus size={13} />
              <span>Push</span>
            </button>
          </form>

          <button 
            type="button" 
            className="btn btn-sm btn-learn-secondary py-1 px-3" 
            style={{ fontSize: '0.78rem', height: '32px', color: 'var(--learn-error)' }}
            onClick={handlePop}
            disabled={stack.length === 0}
          >
            <Trash2 size={13} />
            <span>Pop</span>
          </button>

          <button 
            type="button" 
            className="btn btn-sm btn-learn-secondary py-1 px-3" 
            style={{ fontSize: '0.78rem', height: '32px' }}
            onClick={handlePeek}
            disabled={stack.length === 0}
          >
            <Eye size={13} />
            <span>Peek</span>
          </button>

          <button 
            type="button" 
            className="btn btn-sm btn-learn-secondary py-1 px-2" 
            style={{ fontSize: '0.78rem', height: '32px' }}
            onClick={handleReset}
            title="Reset stack"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      <p className="small mb-3" style={{ color: 'var(--learn-text-muted)' }}>
        Think of a pile of clean plates in a cafeteria. Whenever you add a plate, it goes on top. When someone takes a plate, they take the top plate first!
      </p>

      {/* Visual Stack Bucket */}
      <div className="d-flex justify-content-center my-4">
        <div 
          className="d-flex flex-column-reverse p-3 rounded-bottom-4 transition-all"
          style={{ 
            width: '240px', 
            minHeight: '180px', 
            border: '3px solid var(--learn-border)', 
            borderTop: 'none', 
            backgroundColor: 'var(--learn-surface-secondary)',
            gap: '6px'
          }}
        >
          {stack.length === 0 ? (
            <div className="m-auto text-muted small font-mono py-4 text-center">
              Stack is empty.<br />Click Push to add an item!
            </div>
          ) : (
            stack.map((val, idx) => {
              const isTop = idx === stack.length - 1;
              return (
                <div 
                  key={idx}
                  className="p-2 rounded-3 text-center font-mono fw-bold transition-all shadow-sm d-flex align-items-center justify-content-between px-3"
                  style={{ 
                    backgroundColor: isTop ? 'var(--learn-accent-subtle)' : 'var(--learn-surface)',
                    border: `2px solid ${isTop ? 'var(--learn-accent)' : 'var(--learn-border)'}`,
                    color: isTop ? 'var(--learn-accent)' : 'var(--learn-text)',
                    fontSize: '0.88rem',
                    transform: isTop ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <span>{val}</span>
                  {isTop ? (
                    <span className="badge font-mono" style={{ backgroundColor: 'var(--learn-accent)', color: '#FFFFFF', fontSize: '0.65rem' }}>
                      TOP (Next Out)
                    </span>
                  ) : (
                    <span className="small text-muted font-mono" style={{ fontSize: '0.68rem' }}>
                      #{idx}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Log Feedback Bar */}
      <div 
        className="p-2 rounded-3 text-center small font-mono" 
        style={{ 
          backgroundColor: 'var(--learn-surface-secondary)', 
          color: 'var(--learn-text)', 
          border: '1px solid var(--learn-border-subtle)',
          fontSize: '0.82rem' 
        }}
      >
        {log}
      </div>
    </div>
  );
};

export default StackVisualizer;
