import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  Quote, 
  ArrowRight, 
  ArrowLeft,
  Circle, 
  HelpCircle,
  Lightbulb,
  Clock,
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';
import EverydayAnalogyCard from './EverydayAnalogyCard';
import InteractiveVisualizerHost from './InteractiveVisualizerHost';
import CodeTabs from './CodeTabs';
import QuoteCard from './QuoteCard';
import PracticeProblemCard from './PracticeProblemCard';
import { getPointStageData } from '../../utils/learnStageData';

const STAGES = [
  { id: 'guess', label: 'Stage A: Guess', icon: Lightbulb, color: 'var(--learn-info)' },
  { id: 'explore', label: 'Stage B: Explore', icon: Compass, color: 'var(--learn-accent)' },
  { id: 'understand', label: 'Stage C: Understand', icon: BookOpen, color: 'var(--learn-success)' },
  { id: 'practice', label: 'Stage D: Practice', icon: CheckCircle2, color: 'var(--learn-warning)' },
  { id: 'reflect', label: 'Stage E: Reflect', icon: Quote, color: 'var(--learn-text)' }
];

const LearningPointStageFlow = ({ 
  point, 
  topic, 
  isCompleted, 
  onToggleComplete, 
  isToggling 
}) => {
  const [activeStage, setActiveStage] = useState('guess');
  const [selectedGuessIdx, setSelectedGuessIdx] = useState(null);
  const [selectedQuizIdx, setSelectedQuizIdx] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const stageData = getPointStageData(point, topic.slug);

  const handleSelectGuess = (idx) => {
    setSelectedGuessIdx(idx);
  };

  const handleSelectQuiz = (idx) => {
    setSelectedQuizIdx(idx);
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedQuizIdx(null);
    setQuizSubmitted(false);
  };

  const goToStage = (stageId) => {
    setActiveStage(stageId);
  };

  const currentStageIndex = STAGES.findIndex(s => s.id === activeStage);
  const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;
  const prevStage = currentStageIndex > 0 ? STAGES[currentStageIndex - 1] : null;

  return (
    <div 
      className="learn-card p-4 p-md-5 mb-5 transition-all"
      style={{ border: '1px solid var(--learn-border)' }}
    >
      {/* Learning Point Title Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-4 border-bottom" style={{ borderColor: 'var(--learn-border-subtle)' }}>
        <div>
          <span className="small text-uppercase font-mono fw-bold" style={{ color: 'var(--learn-accent)', fontSize: '0.74rem' }}>
            {topic.title}
          </span>
          <h2 className="h4 fw-bold mb-0 mt-1" style={{ color: 'var(--learn-text)', letterSpacing: '-0.01em' }}>
            {point.title}
          </h2>
        </div>

        {/* Mark Complete Checkbox / Action */}
        <button
          type="button"
          className={`btn btn-sm ${isCompleted ? 'btn-learn-secondary' : 'btn-learn-primary'} d-inline-flex align-items-center gap-2`}
          onClick={() => onToggleComplete(point.id)}
          disabled={isToggling}
          title={isCompleted ? "Click to reopen for practice" : "Mark point as understood and complete"}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={16} style={{ color: 'var(--learn-success)' }} />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Circle size={16} />
              <span>Mark as Complete</span>
            </>
          )}
        </button>
      </div>

      {/* 5-Stage Interactive Navigation Bar */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2 align-items-center p-2 rounded-4" style={{ backgroundColor: 'var(--learn-surface-secondary)', border: '1px solid var(--learn-border-subtle)' }}>
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                className="btn btn-sm border-0 d-inline-flex align-items-center gap-2 py-2 px-3 rounded-3 transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--learn-surface)' : 'transparent',
                  color: isActive ? 'var(--learn-text)' : 'var(--learn-text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.8rem',
                  boxShadow: isActive ? 'var(--learn-card-shadow)' : 'none',
                  border: isActive ? '1px solid var(--learn-border)' : '1px solid transparent'
                }}
                onClick={() => goToStage(stage.id)}
              >
                <Icon size={14} style={{ color: stage.color }} />
                <span>{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* STAGE A: GUESS (Everyday Question to Trigger Curiosity)   */}
      {/* ======================================================== */}
      {activeStage === 'guess' && (
        <div className="p-3 p-md-4 rounded-4" style={{ backgroundColor: 'var(--learn-surface-secondary)', border: '1px solid var(--learn-border-subtle)' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="learn-stage-pill stage-guess">
              <Lightbulb size={13} />
              Stage A: Everyday Life Question
            </span>
          </div>

          <h3 className="h5 fw-bold mb-2" style={{ color: 'var(--learn-text)' }}>
            Think First: How would you approach this?
          </h3>

          <p className="mb-3" style={{ color: 'var(--learn-text)', opacity: 0.9, fontSize: '0.94rem', lineHeight: '1.6' }}>
            {stageData.guess.scenario}
          </p>

          <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: 'var(--learn-surface)', border: '1px solid var(--learn-border)' }}>
            <div className="fw-semibold mb-3" style={{ color: 'var(--learn-text)', fontSize: '0.95rem' }}>
              ❓ {stageData.guess.question}
            </div>

            <div className="d-flex flex-column gap-2">
              {stageData.guess.options.map((opt, idx) => {
                const isSelected = selectedGuessIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`learn-choice-btn ${isSelected ? (opt.isCorrect ? 'selected-correct' : 'selected-incorrect') : ''}`}
                    onClick={() => handleSelectGuess(idx)}
                  >
                    <span>{opt.text}</span>
                    {isSelected && (
                      <span className="badge rounded-pill" style={{ backgroundColor: opt.isCorrect ? 'var(--learn-success)' : 'var(--learn-accent)', color: '#FFFFFF' }}>
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedGuessIdx !== null && (
              <div 
                className="mt-3 p-3 rounded-3 transition-all"
                style={{ 
                  backgroundColor: stageData.guess.options[selectedGuessIdx].isCorrect ? 'var(--learn-success-subtle)' : 'var(--learn-accent-subtle)',
                  border: `1px solid ${stageData.guess.options[selectedGuessIdx].isCorrect ? 'var(--learn-success)' : 'var(--learn-accent)'}`,
                  color: 'var(--learn-text)'
                }}
              >
                <div className="fw-bold small mb-1" style={{ color: stageData.guess.options[selectedGuessIdx].isCorrect ? 'var(--learn-success)' : 'var(--learn-accent)' }}>
                  {stageData.guess.options[selectedGuessIdx].isCorrect ? "🎯 Intuition Check Passed!" : "💡 Great Thinking!"}
                </div>
                <p className="mb-0 small" style={{ lineHeight: '1.55' }}>
                  {stageData.guess.options[selectedGuessIdx].feedback}
                </p>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-learn-primary"
              onClick={() => goToStage('explore')}
            >
              <span>Continue to Stage B: Explore</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE B: EXPLORE (Analogy & Interactive Visualizer)       */}
      {/* ======================================================== */}
      {activeStage === 'explore' && (
        <div>
          <EverydayAnalogyCard 
            analogy={point.everydayAnalogy}
            theProblem={point.theProblem}
            theIntuition={point.theIntuition}
          />

          {point.visualType && (
            <div className="my-4">
              <InteractiveVisualizerHost visualType={point.visualType} />
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'var(--learn-border-subtle)' }}>
            <button
              type="button"
              className="btn btn-learn-secondary"
              onClick={() => goToStage('guess')}
            >
              <ArrowLeft size={15} />
              <span>Back to Guess</span>
            </button>

            <button
              type="button"
              className="btn btn-learn-primary"
              onClick={() => goToStage('understand')}
            >
              <span>Continue to Stage C: Understand</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE C: UNDERSTAND (Formal Concept, Traces, Code)        */}
      {/* ======================================================== */}
      {activeStage === 'understand' && (
        <div>
          {/* Formal Concept Box */}
          <div className="p-4 mb-4 rounded-4" style={{ backgroundColor: 'var(--learn-surface)', border: '1px solid var(--learn-border)', boxShadow: 'var(--learn-card-shadow)' }}>
            <span className="learn-stage-pill stage-understand mb-2">
              <BookOpen size={13} />
              Stage C: Formal Concept in Plain English
            </span>

            <p className="h6 fw-bold mb-2 mt-2" style={{ color: 'var(--learn-text)', lineHeight: '1.6' }}>
              {point.formalConcept}
            </p>

            <div className="p-3 mt-3 rounded-3" style={{ backgroundColor: 'var(--learn-surface-secondary)', border: '1px solid var(--learn-border-subtle)' }}>
              <strong style={{ color: 'var(--learn-info)' }}>How it works internally: </strong>
              <span style={{ color: 'var(--learn-text)', opacity: 0.95 }}>{point.internalWorking}</span>
            </div>
          </div>

          {/* Dry Run Trace Steps */}
          {point.dryRunSteps && point.dryRunSteps.length > 0 && (
            <div className="mb-4">
              <div className="fw-bold small mb-2 d-flex align-items-center gap-2" style={{ color: 'var(--learn-text)' }}>
                <Clock size={14} style={{ color: 'var(--learn-accent)' }} />
                <span>Step-by-Step Dry Run Execution Trace</span>
              </div>

              <div className="table-responsive">
                <table className="learn-trace-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Step</th>
                      <th style={{ width: '180px' }}>Phase</th>
                      <th>Trace Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {point.dryRunSteps.map((s, idx) => (
                      <tr key={idx}>
                        <td className="font-mono text-muted">#{s.step}</td>
                        <td className="fw-bold" style={{ color: 'var(--learn-accent)' }}>{s.label}</td>
                        <td className="font-mono">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pseudocode snippet if available */}
          {point.pseudocode && (
            <div className="mb-4">
              <div className="fw-bold small mb-2" style={{ color: 'var(--learn-text)' }}>
                Pseudocode Blueprint
              </div>
              <div className="learn-code-container p-3">
                <pre className="mb-0 font-mono" style={{ color: 'var(--learn-code-text)', fontSize: '0.84rem', lineHeight: '1.6' }}>
                  <code>{point.pseudocode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Code Tabs */}
          {point.codeExamples && (
            <div className="mb-4">
              <div className="fw-bold small mb-2" style={{ color: 'var(--learn-text)' }}>
                Executable Code Implementation
              </div>
              <CodeTabs codeExamples={point.codeExamples} />
            </div>
          )}

          {/* Complexity Cards */}
          {point.complexity && (
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 h-100" style={{ backgroundColor: 'var(--learn-surface-secondary)', border: '1px solid var(--learn-border)' }}>
                  <div className="small fw-bold mb-1" style={{ color: 'var(--learn-accent)' }}>
                    ⏱️ Time Complexity
                  </div>
                  <div className="font-mono fw-bold" style={{ color: 'var(--learn-text)', fontSize: '0.9rem' }}>
                    {point.complexity.time}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 h-100" style={{ backgroundColor: 'var(--learn-surface-secondary)', border: '1px solid var(--learn-border)' }}>
                  <div className="small fw-bold mb-1" style={{ color: 'var(--learn-info)' }}>
                    💾 Space Complexity
                  </div>
                  <div className="font-mono fw-bold" style={{ color: 'var(--learn-text)', fontSize: '0.9rem' }}>
                    {point.complexity.space}
                  </div>
                </div>
              </div>

              {point.complexity.details && (
                <div className="col-12">
                  <div className="small p-2 px-3 rounded-3" style={{ backgroundColor: 'var(--learn-surface)', border: '1px solid var(--learn-border-subtle)', color: 'var(--learn-text-muted)' }}>
                    {point.complexity.details}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'var(--learn-border-subtle)' }}>
            <button
              type="button"
              className="btn btn-learn-secondary"
              onClick={() => goToStage('explore')}
            >
              <ArrowLeft size={15} />
              <span>Back to Explore</span>
            </button>

            <button
              type="button"
              className="btn btn-learn-primary"
              onClick={() => goToStage('practice')}
            >
              <span>Continue to Stage D: Practice</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE D: PRACTICE (Interactive Concept Comprehension)    */}
      {/* ======================================================== */}
      {activeStage === 'practice' && (
        <div className="p-3 p-md-4 rounded-4" style={{ backgroundColor: 'var(--learn-surface-secondary)', border: '1px solid var(--learn-border-subtle)' }}>
          <span className="learn-stage-pill stage-practice mb-2">
            <CheckCircle2 size={13} />
            Stage D: Quick Concept Check
          </span>

          <h3 className="h5 fw-bold mb-3 mt-2" style={{ color: 'var(--learn-text)' }}>
            Test Your Intuition
          </h3>

          <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: 'var(--learn-surface)', border: '1px solid var(--learn-border)' }}>
            <div className="fw-semibold mb-3" style={{ color: 'var(--learn-text)', fontSize: '0.95rem' }}>
              🧠 {stageData.practice.question}
            </div>

            <div className="d-flex flex-column gap-2">
              {stageData.practice.options.map((opt, idx) => {
                const isSelected = selectedQuizIdx === idx;
                const isCorrect = opt.isCorrect;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`learn-choice-btn ${quizSubmitted && isSelected ? (isCorrect ? 'selected-correct' : 'selected-incorrect') : ''}`}
                    onClick={() => handleSelectQuiz(idx)}
                  >
                    <span>{opt.text}</span>
                    {quizSubmitted && isSelected && (
                      <span className="badge rounded-pill" style={{ backgroundColor: isCorrect ? 'var(--learn-success)' : 'var(--learn-error)', color: '#FFFFFF' }}>
                        {isCorrect ? 'Correct!' : 'Review logic'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && selectedQuizIdx !== null && (
              <div 
                className="mt-3 p-3 rounded-3 transition-all"
                style={{ 
                  backgroundColor: stageData.practice.options[selectedQuizIdx].isCorrect ? 'var(--learn-success-subtle)' : 'var(--learn-accent-subtle)',
                  border: `1px solid ${stageData.practice.options[selectedQuizIdx].isCorrect ? 'var(--learn-success)' : 'var(--learn-accent)'}`,
                  color: 'var(--learn-text)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fw-bold small" style={{ color: stageData.practice.options[selectedQuizIdx].isCorrect ? 'var(--learn-success)' : 'var(--learn-accent)' }}>
                    {stageData.practice.options[selectedQuizIdx].isCorrect ? "🎉 Excellent! Concept Understood!" : "💡 Almost there!"}
                  </span>
                  {!stageData.practice.options[selectedQuizIdx].isCorrect && (
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 text-decoration-none small"
                      style={{ color: 'var(--learn-accent)' }}
                      onClick={handleResetQuiz}
                    >
                      Try Again
                    </button>
                  )}
                </div>
                <p className="mb-0 small" style={{ lineHeight: '1.55' }}>
                  {stageData.practice.options[selectedQuizIdx].explanation}
                </p>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-learn-secondary"
              onClick={() => goToStage('understand')}
            >
              <ArrowLeft size={15} />
              <span>Back to Understand</span>
            </button>

            <button
              type="button"
              className="btn btn-learn-primary"
              onClick={() => goToStage('reflect')}
            >
              <span>Continue to Stage E: Reflect</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE E: REFLECT (Takeaways, Pitfalls, Quote, Problems)   */}
      {/* ======================================================== */}
      {activeStage === 'reflect' && (
        <div>
          {/* Main Takeaway & Common Mistake */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-4 h-100" style={{ backgroundColor: 'var(--learn-surface)', border: '1px solid var(--learn-border)', borderLeft: '4px solid var(--learn-success)', boxShadow: 'var(--learn-card-shadow)' }}>
                <div className="fw-bold small mb-2 d-flex align-items-center gap-1" style={{ color: 'var(--learn-success)' }}>
                  <Check size={16} />
                  <span>The Core Invariant</span>
                </div>
                <p className="mb-0 small" style={{ color: 'var(--learn-text)', lineHeight: '1.6' }}>
                  {point.summary || "Master the intuition first. An index tells you where an item lives; the algorithm tells you how to navigate."}
                </p>
              </div>
            </div>

            {point.commonMistakes && point.commonMistakes.length > 0 && (
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-4 h-100" style={{ backgroundColor: 'var(--learn-surface)', border: '1px solid var(--learn-border)', borderLeft: '4px solid var(--learn-error)', boxShadow: 'var(--learn-card-shadow)' }}>
                  <div className="fw-bold small mb-2 d-flex align-items-center gap-1" style={{ color: 'var(--learn-error)' }}>
                    <AlertTriangle size={15} />
                    <span>Common Pitfall to Avoid</span>
                  </div>
                  <div className="small fw-semibold" style={{ color: 'var(--learn-text)' }}>
                    {point.commonMistakes[0].mistake}
                  </div>
                  <div className="small text-muted mt-1" style={{ lineHeight: '1.5' }}>
                    Fix: {point.commonMistakes[0].fix}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Motivational Quote for this Learning Point */}
          <QuoteCard quote={point.quote} context={`Core Principle for ${point.title}`} />

          {/* Practice Problems with Progressive Hints */}
          {point.practiceProblems && point.practiceProblems.length > 0 && (
            <div className="mt-4">
              <h4 className="h6 fw-bold mb-2" style={{ color: 'var(--learn-text)' }}>
                Apply Your Knowledge on LeetCode
              </h4>
              {point.practiceProblems.map(prob => (
                <PracticeProblemCard key={prob.id} problem={prob} topicTitle={topic.title} />
              ))}
            </div>
          )}

          {/* Completion Celebration Action */}
          <div className="p-4 mt-4 rounded-4 text-center" style={{ backgroundColor: 'var(--learn-surface-secondary)', border: '1px solid var(--learn-border-subtle)' }}>
            <h4 className="h6 fw-bold mb-2" style={{ color: 'var(--learn-text)' }}>
              {isCompleted ? "🎉 You've Mastered This Concept!" : "Ready to mark this concept as completed?"}
            </h4>
            <p className="small text-muted mb-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
              Progress is recorded directly in your account so you can pick up anytime without losing your place.
            </p>

            <button
              type="button"
              className={`btn btn-sm ${isCompleted ? 'btn-learn-secondary' : 'btn-learn-primary'} px-4 py-2`}
              onClick={() => onToggleComplete(point.id)}
              disabled={isToggling}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={16} style={{ color: 'var(--learn-success)' }} />
                  <span>Completed (Click to Reopen)</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Mark as Completed & Continue</span>
                </>
              )}
            </button>
          </div>

          <div className="d-flex justify-content-start pt-3 border-top mt-4" style={{ borderColor: 'var(--learn-border-subtle)' }}>
            <button
              type="button"
              className="btn btn-learn-secondary"
              onClick={() => goToStage('practice')}
            >
              <ArrowLeft size={15} />
              <span>Back to Practice</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPointStageFlow;
