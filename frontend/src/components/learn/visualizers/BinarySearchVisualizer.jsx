import React, { useState } from 'react';
import { Play, RotateCcw, Search, Sparkles, CheckCircle2 } from 'lucide-react';

const BinarySearchVisualizer = () => {
  const nums = [3, 8, 14, 21, 29, 37, 46, 58, 67, 75, 84, 99];
  const [target, setTarget] = useState(67);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(nums.length - 1);
  const [mid, setMid] = useState(Math.floor((0 + nums.length - 1) / 2));
  const [found, setFound] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [log, setLog] = useState(`Searching for ${target}. The range is [0..${nums.length - 1}]. Click 'Step Binary Search' to test midpoint!`);

  const handleStep = () => {
    if (left > right || found) return;

    const currentMid = Math.floor(left + (right - left) / 2);
    setMid(currentMid);
    setStepCount(prev => prev + 1);

    if (nums[currentMid] === target) {
      setFound(true);
      setLog(`🎯 Found target ${target} at index [${currentMid}] in only ${stepCount + 1} steps (O(log n))!`);
    } else if (nums[currentMid] < target) {
      setLeft(currentMid + 1);
      setLog(`Midpoint [${currentMid}] is ${nums[currentMid]}, which is < ${target}. Discarding left half! Remaining: [${currentMid + 1}..${right}].`);
    } else {
      setRight(currentMid - 1);
      setLog(`Midpoint [${currentMid}] is ${nums[currentMid]}, which is > ${target}. Discarding right half! Remaining: [${left}..${currentMid - 1}].`);
    }
  };

  const handleReset = (newTarget = target) => {
    setTarget(newTarget);
    setLeft(0);
    setRight(nums.length - 1);
    setMid(Math.floor((0 + nums.length - 1) / 2));
    setFound(false);
    setStepCount(0);
    setLog(`Reset search for ${newTarget}. Range spans index 0 to ${nums.length - 1}.`);
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
          <Search size={13} />
          Interactive Binary Search: Range Halving
        </span>

        <div className="d-flex align-items-center gap-2">
          <select 
            className="form-select form-select-sm font-mono"
            style={{ 
              width: 'auto', 
              height: '32px', 
              fontSize: '0.8rem',
              backgroundColor: 'var(--learn-surface-secondary)',
              color: 'var(--learn-text)',
              borderColor: 'var(--learn-border)'
            }}
            value={target}
            onChange={(e) => handleReset(Number(e.target.value))}
          >
            {nums.map(n => <option key={n} value={n}>Target: {n}</option>)}
          </select>

          <button
            type="button"
            className="btn btn-sm btn-learn-primary py-1 px-3 d-inline-flex align-items-center gap-1"
            style={{ fontSize: '0.78rem', height: '32px' }}
            onClick={handleStep}
            disabled={found || left > right}
          >
            <Play size={12} />
            <span>Step Search</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-learn-secondary py-1 px-2"
            style={{ fontSize: '0.78rem', height: '32px' }}
            onClick={() => handleReset()}
            title="Reset binary search"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <p className="small mb-3" style={{ color: 'var(--learn-text-muted)' }}>
        Like looking up a word in a dictionary, binary search checks the middle element and cuts the remaining search space in half with every step!
      </p>

      {/* Sorted Array Display */}
      <div className="d-flex flex-wrap gap-2 justify-content-center py-2 mb-3">
        {nums.map((num, idx) => {
          const isMid = idx === mid;
          const isInRange = idx >= left && idx <= right;
          const isTargetMatch = found && num === target;

          let bg = 'var(--learn-surface-secondary)';
          let border = 'var(--learn-border)';
          let color = 'var(--learn-text)';

          if (isTargetMatch) {
            bg = 'var(--learn-success-subtle)';
            border = 'var(--learn-success)';
            color = 'var(--learn-success)';
          } else if (isMid) {
            bg = 'var(--learn-accent-subtle)';
            border = 'var(--learn-accent)';
            color = 'var(--learn-accent)';
          } else if (!isInRange) {
            bg = 'var(--learn-surface)';
            border = 'var(--learn-border-subtle)';
            color = 'var(--learn-text-subtle)';
          }

          return (
            <div 
              key={idx} 
              className="text-center transition-all" 
              style={{ 
                minWidth: '44px', 
                opacity: isInRange ? 1 : 0.35,
                transform: isMid || isTargetMatch ? 'scale(1.08)' : 'scale(1)'
              }}
            >
              <div className="small font-mono mb-1" style={{ fontSize: '0.7rem', color: 'var(--learn-text-muted)' }}>
                [{idx}]
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 font-mono fw-bold transition-all shadow-sm"
                style={{ 
                  height: '42px', 
                  backgroundColor: bg,
                  border: `2px solid ${border}`,
                  color: color,
                  fontSize: '0.95rem'
                }}
              >
                {num}
              </div>
              <div className="mt-1" style={{ minHeight: '16px' }}>
                {idx === left && <span className="badge font-mono" style={{ backgroundColor: 'var(--learn-info)', color: '#FFFFFF', fontSize: '0.62rem' }}>L</span>}
                {isMid && <span className="badge font-mono ms-1" style={{ backgroundColor: 'var(--learn-accent)', color: '#FFFFFF', fontSize: '0.62rem' }}>M</span>}
                {idx === right && <span className="badge font-mono ms-1" style={{ backgroundColor: 'var(--learn-info)', color: '#FFFFFF', fontSize: '0.62rem' }}>R</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Output Bar */}
      <div 
        className="p-3 rounded-3 text-center small font-mono" 
        style={{ 
          backgroundColor: 'var(--learn-surface-secondary)', 
          color: 'var(--learn-text)', 
          border: '1px solid var(--learn-border-subtle)',
          fontSize: '0.84rem' 
        }}
      >
        {log}
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;
