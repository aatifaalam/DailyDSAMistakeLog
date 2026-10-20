import React, { useState } from 'react';
import { Play, RotateCcw, Box, ArrowRight, Sparkles, Check } from 'lucide-react';

const ArrayVisualizer = () => {
  const [elements] = useState([
    { val: 12, label: "Box 0" },
    { val: 25, label: "Box 1" },
    { val: 38, label: "Box 2" },
    { val: 47, label: "Box 3" },
    { val: 56, label: "Box 4" },
    { val: 69, label: "Box 5" },
    { val: 81, label: "Box 6" }
  ]);
  const [selectedIndex, setSelectedIndex] = useState(3);
  const [twoPointerMode, setTwoPointerMode] = useState(false);
  const [leftPtr, setLeftPtr] = useState(0);
  const [rightPtr, setRightPtr] = useState(6);

  const baseAddress = 0x1000;
  const currentAddress = baseAddress + selectedIndex * 4;

  const handleStepTwoPointers = () => {
    if (leftPtr < rightPtr) {
      setLeftPtr(prev => prev + 1);
      setRightPtr(prev => prev - 1);
    }
  };

  const handleResetTwoPointers = () => {
    setLeftPtr(0);
    setRightPtr(6);
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
        <div className="d-flex align-items-center gap-2">
          <span className="learn-stage-pill stage-explore">
            <Box size={13} />
            Interactive Array & Index Explorer
          </span>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className={`btn btn-sm ${!twoPointerMode ? 'btn-learn-primary' : 'btn-learn-secondary'}`}
            style={{ fontSize: '0.78rem' }}
            onClick={() => setTwoPointerMode(false)}
          >
            Direct Index Lookup
          </button>
          <button
            type="button"
            className={`btn btn-sm ${twoPointerMode ? 'btn-learn-primary' : 'btn-learn-secondary'}`}
            style={{ fontSize: '0.78rem' }}
            onClick={() => setTwoPointerMode(true)}
          >
            Two Pointers Demo
          </button>
        </div>
      </div>

      <p className="small mb-3" style={{ color: 'var(--learn-text-muted)' }}>
        {!twoPointerMode 
          ? "Click any numbered box to see how the computer calculates its exact memory position instantly in O(1) time without searching!"
          : "Watch how two pointers start at both ends and step inward toward each other in a single pass."}
      </p>

      {/* Array Boxes Container */}
      <div className="d-flex flex-wrap gap-2 justify-content-center py-2 mb-3">
        {elements.map((item, idx) => {
          const isSelected = !twoPointerMode && idx === selectedIndex;
          const isLeft = twoPointerMode && idx === leftPtr;
          const isRight = twoPointerMode && idx === rightPtr;
          const isPointerActive = isLeft || isRight;

          return (
            <button
              key={idx}
              type="button"
              className="border-0 bg-transparent p-0 text-center transition-all"
              style={{ minWidth: '58px', cursor: 'pointer' }}
              onClick={() => {
                if (!twoPointerMode) setSelectedIndex(idx);
              }}
              title={`Click to inspect index ${idx}`}
            >
              {/* Index label above */}
              <div 
                className="small font-mono fw-bold mb-1" 
                style={{ 
                  color: isSelected || isPointerActive ? 'var(--learn-accent)' : 'var(--learn-text-muted)',
                  fontSize: '0.75rem' 
                }}
              >
                Index [{idx}]
              </div>

              {/* Box Element */}
              <div 
                className="d-flex flex-column align-items-center justify-content-center rounded-3 fw-bold font-mono transition-all"
                style={{ 
                  height: '56px', 
                  backgroundColor: isSelected || isPointerActive 
                    ? 'var(--learn-accent-subtle)' 
                    : 'var(--learn-surface-secondary)',
                  border: `2px solid ${isSelected || isPointerActive ? 'var(--learn-accent)' : 'var(--learn-border)'}`,
                  color: isSelected || isPointerActive ? 'var(--learn-accent)' : 'var(--learn-text)',
                  fontSize: '1.1rem',
                  boxShadow: isSelected || isPointerActive ? '0 4px 12px var(--learn-accent-subtle)' : 'none',
                  transform: isSelected || isPointerActive ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <span>{item.val}</span>
                <span className="font-mono text-muted" style={{ fontSize: '0.62rem', fontWeight: 400 }}>
                  val
                </span>
              </div>

              {/* Indicator below */}
              <div className="mt-1" style={{ minHeight: '18px' }}>
                {isSelected && (
                  <span className="badge font-mono" style={{ backgroundColor: 'var(--learn-accent)', color: '#FFFFFF', fontSize: '0.65rem' }}>
                    Selected
                  </span>
                )}
                {isLeft && (
                  <span className="badge font-mono" style={{ backgroundColor: 'var(--learn-info)', color: '#FFFFFF', fontSize: '0.65rem' }}>
                    Left
                  </span>
                )}
                {isRight && (
                  <span className="badge font-mono ms-1" style={{ backgroundColor: 'var(--learn-accent)', color: '#FFFFFF', fontSize: '0.65rem' }}>
                    Right
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanatory Info Box */}
      {!twoPointerMode ? (
        <div 
          className="p-3 rounded-3"
          style={{ 
            backgroundColor: 'var(--learn-surface-secondary)', 
            border: '1px solid var(--learn-border-subtle)' 
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div>
              <div className="fw-bold small mb-1" style={{ color: 'var(--learn-text)' }}>
                Direct Memory Calculation for arr[{selectedIndex}]:
              </div>
              <div className="font-mono small" style={{ color: 'var(--learn-accent)', fontSize: '0.85rem' }}>
                Memory Address = Base (0x1000) + [{selectedIndex} × 4 bytes] = 0x{currentAddress.toString(16).toUpperCase()}
              </div>
            </div>
            <div className="small text-muted" style={{ fontSize: '0.8rem', maxWidth: '380px' }}>
              Because elements sit in consecutive memory slots, the CPU calculates the address with one multiplication and one addition: <strong>O(1) instant access</strong>.
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="p-3 rounded-3"
          style={{ 
            backgroundColor: 'var(--learn-surface-secondary)', 
            border: '1px solid var(--learn-border-subtle)' 
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div>
              <div className="font-mono small" style={{ color: 'var(--learn-text)' }}>
                Left: index [{leftPtr}] ({elements[leftPtr]?.val}) | Right: index [{rightPtr}] ({elements[rightPtr]?.val})
              </div>
              <div className="small text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                {leftPtr < rightPtr 
                  ? `Comparing both ends (Sum: ${elements[leftPtr]?.val + elements[rightPtr]?.val}). Click 'Step' to advance.`
                  : "Both pointers have converged in the middle! Entire array traversed in linear O(N) time."}
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-learn-primary"
                onClick={handleStepTwoPointers}
                disabled={leftPtr >= rightPtr}
              >
                <Play size={12} />
                <span>Step Inward</span>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-learn-secondary"
                onClick={handleResetTwoPointers}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArrayVisualizer;
