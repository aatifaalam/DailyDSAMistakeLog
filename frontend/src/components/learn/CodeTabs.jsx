import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

const CodeTabs = ({ codeExamples }) => {
  const [activeLang, setActiveLang] = useState('java');
  const [copied, setCopied] = useState(false);

  if (!codeExamples) return null;

  const currentCode = codeExamples[activeLang] || codeExamples.java || Object.values(codeExamples)[0];

  const handleCopy = () => {
    if (currentCode) {
      navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-3 learn-code-container">
      {/* Tab Header */}
      <div className="d-flex align-items-center justify-content-between px-3 py-2 learn-code-header">
        <div className="d-flex gap-2">
          {codeExamples.java && (
            <button
              type="button"
              className={`btn btn-sm py-1 px-3 border-0 transition-all ${
                activeLang === 'java' 
                  ? 'text-white fw-bold shadow-sm' 
                  : 'text-muted'
              }`}
              style={{
                backgroundColor: activeLang === 'java' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                borderRadius: '6px',
                fontSize: '0.8rem'
              }}
              onClick={() => setActiveLang('java')}
            >
              Java
            </button>
          )}

          {codeExamples.python && (
            <button
              type="button"
              className={`btn btn-sm py-1 px-3 border-0 transition-all ${
                activeLang === 'python' 
                  ? 'text-white fw-bold shadow-sm' 
                  : 'text-muted'
              }`}
              style={{
                backgroundColor: activeLang === 'python' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                borderRadius: '6px',
                fontSize: '0.8rem'
              }}
              onClick={() => setActiveLang('python')}
            >
              Python
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn btn-sm btn-link text-decoration-none p-1 d-inline-flex align-items-center gap-1 text-light opacity-75 hover-opacity-100"
          style={{ fontSize: '0.75rem' }}
          onClick={handleCopy}
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={14} className="text-success" />
              <span className="text-success fw-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3" style={{ overflowX: 'auto' }}>
        <pre 
          className="mb-0 font-mono"
          style={{ 
            color: 'var(--learn-code-text)', 
            fontSize: '0.85rem', 
            lineHeight: '1.65',
            tabSize: 4
          }}
        >
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeTabs;
