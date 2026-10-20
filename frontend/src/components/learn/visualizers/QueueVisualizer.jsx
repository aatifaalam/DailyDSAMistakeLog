import React, { useState } from 'react';
import { Users, UserPlus, UserCheck, RotateCcw } from 'lucide-react';

const QueueVisualizer = () => {
  const [queue, setQueue] = useState(["Alice", "Bob", "Charlie"]);
  const [inputName, setInputName] = useState('');
  const [log, setLog] = useState("Queue initialized: Alice is at the FRONT (First-In, First-Out).");

  const handleEnqueue = (e) => {
    e.preventDefault();
    const name = inputName.trim() || `Person ${queue.length + 1}`;
    if (queue.length >= 6) {
      setLog("Queue line is full for this demo! Serve someone at the front first.");
      return;
    }
    setQueue(prev => [...prev, name]);
    setInputName('');
    setLog(`ENQUEUE: '${name}' joined at the BACK (Rear). O(1) time.`);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setLog("Cannot DEQUEUE from an empty line (Queue Underflow)!");
      return;
    }
    const served = queue[0];
    setQueue(prev => prev.slice(1));
    setLog(`DEQUEUE: Served '${served}' from the FRONT in O(1) time (FIFO order).`);
  };

  const handleReset = () => {
    setQueue(["Alice", "Bob", "Charlie"]);
    setLog("Reset queue to 3 people in line.");
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
          <Users size={13} />
          Interactive Queue: First-In, First-Out (FIFO)
        </span>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <form onSubmit={handleEnqueue} className="d-flex gap-1">
            <input
              type="text"
              placeholder="e.g. Dave"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="form-control form-control-sm font-mono"
              style={{ 
                width: '100px', 
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
              <UserPlus size={13} />
              <span>Enqueue</span>
            </button>
          </form>

          <button 
            type="button" 
            className="btn btn-sm btn-learn-secondary py-1 px-3" 
            style={{ fontSize: '0.78rem', height: '32px', color: 'var(--learn-success)' }}
            onClick={handleDequeue}
            disabled={queue.length === 0}
          >
            <UserCheck size={13} />
            <span>Serve Front</span>
          </button>

          <button 
            type="button" 
            className="btn btn-sm btn-learn-secondary py-1 px-2" 
            style={{ fontSize: '0.78rem', height: '32px' }}
            onClick={handleReset}
            title="Reset line"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      <p className="small mb-3" style={{ color: 'var(--learn-text-muted)' }}>
        Like waiting in line at a movie ticket counter: the first person to arrive is the first person served (FIFO). New arrivals join at the back!
      </p>

      {/* Queue Horizontal Line */}
      <div className="my-4 py-3 px-3 rounded-4" style={{ backgroundColor: 'var(--learn-surface-secondary)', border: '1px solid var(--learn-border-subtle)' }}>
        <div className="d-flex align-items-center justify-content-between mb-2 small font-mono" style={{ color: 'var(--learn-text-muted)', fontSize: '0.75rem' }}>
          <span>← FRONT (Exit / Next Served)</span>
          <span>REAR (Entrance) →</span>
        </div>

        <div className="d-flex flex-wrap gap-2 align-items-center py-2" style={{ minHeight: '60px' }}>
          {queue.length === 0 ? (
            <div className="m-auto text-muted small font-mono py-2">
              Queue is empty. Click Enqueue to add a person!
            </div>
          ) : (
            queue.map((name, idx) => {
              const isFront = idx === 0;
              const isRear = idx === queue.length - 1;

              return (
                <div 
                  key={idx}
                  className="p-2 rounded-3 text-center font-mono fw-bold transition-all shadow-sm d-flex align-items-center gap-2"
                  style={{ 
                    backgroundColor: isFront ? 'var(--learn-success-subtle)' : 'var(--learn-surface)',
                    border: `2px solid ${isFront ? 'var(--learn-success)' : 'var(--learn-border)'}`,
                    color: isFront ? 'var(--learn-success)' : 'var(--learn-text)',
                    fontSize: '0.88rem',
                    transform: isFront ? 'scale(1.04)' : 'scale(1)'
                  }}
                >
                  <Users size={14} />
                  <span>{name}</span>
                  {isFront && (
                    <span className="badge font-mono" style={{ backgroundColor: 'var(--learn-success)', color: '#FFFFFF', fontSize: '0.62rem' }}>
                      NEXT
                    </span>
                  )}
                  {isRear && !isFront && (
                    <span className="badge font-mono" style={{ backgroundColor: 'var(--learn-surface-secondary)', color: 'var(--learn-text-muted)', fontSize: '0.62rem' }}>
                      REAR
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Feedback log */}
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

export default QueueVisualizer;
