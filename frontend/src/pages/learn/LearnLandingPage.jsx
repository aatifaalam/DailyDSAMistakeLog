import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Clock, 
  Award, 
  Sparkles, 
  Flame,
  ChevronRight,
  Quote,
  Box,
  Hash,
  Link as LinkIcon,
  GitBranch,
  Search,
  Cpu,
  Briefcase,
  Wrench,
  Star,
  Check
} from 'lucide-react';
import { 
  LEARN_CURRICULUM, 
  getTotalLearningPointsCount, 
  getDailyQuote, 
  SIGNATURE_QUOTE 
} from '../../data/learnCurriculum';
import { LearnService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

// Helper to assign a friendly icon to each topic
const getTopicIcon = (slug) => {
  switch (slug) {
    case 'arrays-and-strings': return Box;
    case 'hashing': return Hash;
    case 'linked-lists': return LinkIcon;
    case 'stacks-and-queues': return Layers;
    case 'trees-and-graphs': return GitBranch;
    case 'heap': return Award;
    case 'greedy-algorithms': return Compass;
    case 'binary-search': return Search;
    case 'backtracking': return Sparkles;
    case 'dynamic-programming': return Cpu;
    case 'interviews': return Briefcase;
    case 'tools': return Wrench;
    case 'bonus': return Star;
    default: return BookOpen;
  }
};

const LearnLandingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const totalPoints = getTotalLearningPointsCount();
  const dailyQuote = getDailyQuote();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await LearnService.getUserProgress();
        setProgress(data);
      } catch (err) {
        console.warn('Could not fetch user progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const completedCount = progress?.totalCompletedPoints || 0;
  const overallPercentage = totalPoints > 0 ? Math.round((completedCount / totalPoints) * 100) : 0;

  // Compute started and completed topics accurately
  let topicsStarted = 0;
  let topicsCompleted = 0;

  LEARN_CURRICULUM.forEach(topic => {
    let topicPointCount = 0;
    let topicCompletedCount = 0;

    topic.lessons.forEach(l => {
      l.points.forEach(p => {
        topicPointCount++;
        if (progress?.completedPointIds?.includes(p.id)) {
          topicCompletedCount++;
        }
      });
    });

    if (topicCompletedCount > 0) {
      topicsStarted++;
      if (topicCompletedCount >= topicPointCount && topicPointCount > 0) {
        topicsCompleted++;
      }
    }
  });

  const lastTopicSlug = progress?.lastAccessedTopicSlug || 'arrays-and-strings';
  const lastLessonSlug = progress?.lastAccessedLessonSlug || 'intro-to-arrays';

  const handleContinueLearning = () => {
    navigate(`/learn/${lastTopicSlug}/${lastLessonSlug}`);
  };

  return (
    <div className="learn-classroom-wrapper pb-5">
      {/* Friendly Classroom Hero Banner */}
      <div 
        className="learn-card p-4 p-md-5 mb-4 position-relative overflow-hidden"
        style={{ 
          background: 'var(--learn-surface)',
          border: '1px solid var(--learn-border)'
        }}
      >
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-7">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="learn-stage-pill stage-explore">
                <Sparkles size={13} />
                Welcome to the Classroom
              </span>
              <span className="small font-mono text-muted" style={{ fontSize: '0.78rem' }}>
                13 Step-by-Step Modules
              </span>
            </div>

            <h1 className="display-6 fw-bold mb-2" style={{ color: 'var(--learn-text)', letterSpacing: '-0.02em' }}>
              Let's Learn DSA
            </h1>

            <p className="lead mb-4" style={{ color: 'var(--learn-text-muted)', fontSize: '1.05rem', maxWidth: '580px', lineHeight: '1.6' }}>
              "Start with everyday life. Discover the logic. Build your coding skills."
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <button 
                type="button" 
                className="btn btn-learn-primary px-4 py-2"
                onClick={handleContinueLearning}
              >
                <span>{completedCount > 0 ? "Continue Learning" : "Start with Topic 1"}</span>
                <ArrowRight size={16} />
              </button>

              <a 
                href="#all-topics"
                className="btn btn-learn-secondary px-3 py-2 text-decoration-none"
              >
                <span>Browse All 13 Topics</span>
              </a>
            </div>
          </div>

          {/* Friendly Illustration of Everyday Familiar Objects */}
          <div className="col-12 col-lg-5 text-center">
            <div 
              className="p-4 rounded-4 d-inline-block transition-all"
              style={{ 
                backgroundColor: 'var(--learn-surface-secondary)', 
                border: '1px solid var(--learn-border-subtle)',
                maxWidth: '380px',
                width: '100%'
              }}
            >
              <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-100 h-auto">
                {/* Numbered Gym Lockers / Boxes */}
                <rect x="20" y="30" width="45" height="55" rx="6" fill="var(--learn-accent-subtle)" stroke="var(--learn-accent)" strokeWidth="2" />
                <text x="42" y="62" fill="var(--learn-accent)" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">[0]</text>
                
                <rect x="75" y="30" width="45" height="55" rx="6" fill="var(--learn-surface)" stroke="var(--learn-border)" strokeWidth="2" />
                <text x="97" y="62" fill="var(--learn-text-muted)" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">[1]</text>
                
                <rect x="130" y="30" width="45" height="55" rx="6" fill="var(--learn-surface)" stroke="var(--learn-border)" strokeWidth="2" />
                <text x="152" y="62" fill="var(--learn-text-muted)" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">[2]</text>
                
                {/* Connection pointer arrow */}
                <path d="M185 58 H215" stroke="var(--learn-accent)" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="230" cy="58" r="14" fill="var(--learn-info-subtle)" stroke="var(--learn-info)" strokeWidth="2" />
                <text x="230" y="62" fill="var(--learn-info)" fontSize="10" fontWeight="bold" textAnchor="middle">Node</text>

                {/* Stack of plates / books */}
                <g transform="translate(40, 115)">
                  <rect x="0" y="40" width="110" height="16" rx="4" fill="var(--learn-surface)" stroke="var(--learn-border)" strokeWidth="1.5" />
                  <rect x="10" y="22" width="90" height="16" rx="4" fill="var(--learn-surface)" stroke="var(--learn-border)" strokeWidth="1.5" />
                  <rect x="20" y="4" width="70" height="16" rx="4" fill="var(--learn-success-subtle)" stroke="var(--learn-success)" strokeWidth="2" />
                  <text x="55" y="16" fill="var(--learn-success)" fontSize="9" fontWeight="bold" textAnchor="middle">TOP (LIFO)</text>
                </g>

                {/* Puzzle piece connection */}
                <g transform="translate(190, 110)">
                  <rect x="10" y="10" width="60" height="50" rx="8" fill="var(--learn-accent-subtle)" stroke="var(--learn-accent)" strokeWidth="2" />
                  <circle cx="40" cy="10" r="8" fill="var(--learn-surface-secondary)" stroke="var(--learn-accent)" strokeWidth="2" />
                  <text x="40" y="42" fill="var(--learn-accent)" fontSize="11" fontWeight="bold" textAnchor="middle">Logic</text>
                </g>
              </svg>
              
              <div className="small fw-semibold mt-2" style={{ color: 'var(--learn-text)' }}>
                Familiar Everyday Objects → Structured Code
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Metric KPI Bar */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="learn-card p-3 h-100">
            <span className="small text-muted d-block mb-1 font-mono" style={{ fontSize: '0.74rem' }}>
              Overall Progress
            </span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="h4 fw-bold mb-0 font-mono" style={{ color: 'var(--learn-accent)' }}>
                {overallPercentage}%
              </span>
              <span className="small text-muted font-mono" style={{ fontSize: '0.72rem' }}>
                completed
              </span>
            </div>
            <div className="learn-progress-track mt-2">
              <div 
                className="learn-progress-bar" 
                style={{ width: `${overallPercentage}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="learn-card p-3 h-100">
            <span className="small text-muted d-block mb-1 font-mono" style={{ fontSize: '0.74rem' }}>
              Mastered Concepts
            </span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="h4 fw-bold mb-0 font-mono" style={{ color: 'var(--learn-success)' }}>
                {completedCount}
              </span>
              <span className="small text-muted font-mono" style={{ fontSize: '0.72rem' }}>
                / {totalPoints} points
              </span>
            </div>
            <div className="learn-progress-track mt-2">
              <div 
                className="learn-progress-bar" 
                style={{ width: `${overallPercentage}%`, background: 'var(--learn-success)' }} 
              />
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="learn-card p-3 h-100">
            <span className="small text-muted d-block mb-1 font-mono" style={{ fontSize: '0.74rem' }}>
              Topics Started
            </span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="h4 fw-bold mb-0 font-mono" style={{ color: 'var(--learn-info)' }}>
                {topicsStarted}
              </span>
              <span className="small text-muted font-mono" style={{ fontSize: '0.72rem' }}>
                / 13 topics
              </span>
            </div>
            <div className="learn-progress-track mt-2">
              <div 
                className="learn-progress-bar" 
                style={{ width: `${Math.round((topicsStarted / 13) * 100)}%`, background: 'var(--learn-info)' }} 
              />
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="learn-card p-3 h-100">
            <span className="small text-muted d-block mb-1 font-mono" style={{ fontSize: '0.74rem' }}>
              Topics Completed
            </span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="h4 fw-bold mb-0 font-mono" style={{ color: 'var(--learn-warning)' }}>
                {topicsCompleted}
              </span>
              <span className="small text-muted font-mono" style={{ fontSize: '0.72rem' }}>
                / 13 fully done
              </span>
            </div>
            <div className="learn-progress-track mt-2">
              <div 
                className="learn-progress-bar" 
                style={{ width: `${Math.round((topicsCompleted / 13) * 100)}%`, background: 'var(--learn-warning)' }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Philosophy Section */}
      <div 
        className="learn-card p-4 mb-4 rounded-4"
        style={{ 
          backgroundColor: 'var(--learn-surface-secondary)', 
          borderLeft: '4px solid var(--learn-accent)' 
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-2">
          <Quote size={16} style={{ color: 'var(--learn-accent)' }} />
          <span className="small text-uppercase font-mono fw-bold" style={{ color: 'var(--learn-accent)', fontSize: '0.75rem' }}>
            Our Learning Philosophy
          </span>
        </div>
        <h3 className="h6 fw-bold mb-2" style={{ color: 'var(--learn-text)' }}>
          "{SIGNATURE_QUOTE}"
        </h3>
        <p className="small mb-0" style={{ color: 'var(--learn-text-muted)', lineHeight: '1.6', maxWidth: '800px' }}>
          The secret to mastering Data Structures and Algorithms is understanding <em>why</em> they were created. When you understand the everyday intuition behind a concept, you won't need to memorize solutions — the code will flow naturally from your own reasoning.
        </p>
      </div>

      {/* Topics Section */}
      <div id="all-topics" className="mt-4 pt-2">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1" style={{ color: 'var(--learn-text)' }}>
              Course Curriculum
            </h2>
            <p className="small mb-0" style={{ color: 'var(--learn-text-muted)' }}>
              13 structured modules ordered from foundational memory principles to advanced algorithmic patterns.
            </p>
          </div>
        </div>

        <div className="row g-3">
          {LEARN_CURRICULUM.map((topic, index) => {
            const Icon = getTopicIcon(topic.slug);
            let topicPoints = 0;
            let topicDone = 0;

            topic.lessons.forEach(l => {
              l.points.forEach(p => {
                topicPoints++;
                if (progress?.completedPointIds?.includes(p.id)) {
                  topicDone++;
                }
              });
            });

            const topicPct = topicPoints > 0 ? Math.round((topicDone / topicPoints) * 100) : 0;
            const isFinished = topicDone === topicPoints && topicPoints > 0;
            const isFirstTopic = index === 0;

            return (
              <div key={topic.id} className="col-12 col-md-6 col-xl-4">
                <div 
                  className={`learn-card learn-card-hover p-4 h-100 d-flex flex-column justify-content-between transition-all ${
                    isFirstTopic && topicDone === 0 ? 'position-relative' : ''
                  }`}
                  style={{ 
                    borderLeft: `4px solid ${isFinished ? 'var(--learn-success)' : topicDone > 0 ? 'var(--learn-accent)' : isFirstTopic ? 'var(--learn-accent)' : 'var(--learn-border)'}`
                  }}
                  onClick={() => navigate(`/learn/${topic.slug}`)}
                >
                  <div>
                    {/* Header badge & status */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            backgroundColor: 'var(--learn-accent-subtle)', 
                            color: 'var(--learn-accent)' 
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <span 
                          className="badge font-mono"
                          style={{ 
                            backgroundColor: 'var(--learn-surface-secondary)', 
                            color: 'var(--learn-text-muted)', 
                            border: '1px solid var(--learn-border-subtle)',
                            fontSize: '0.72rem' 
                          }}
                        >
                          Topic {topic.order}
                        </span>
                      </div>

                      {isFinished ? (
                        <span className="badge font-mono d-flex align-items-center gap-1" style={{ backgroundColor: 'var(--learn-success-subtle)', color: 'var(--learn-success)' }}>
                          <CheckCircle2 size={12} /> Done
                        </span>
                      ) : topicDone > 0 ? (
                        <span className="small font-mono fw-bold" style={{ color: 'var(--learn-accent)', fontSize: '0.75rem' }}>
                          {topicPct}% done
                        </span>
                      ) : isFirstTopic ? (
                        <span className="badge" style={{ backgroundColor: 'var(--learn-accent)', color: '#FFFFFF', fontSize: '0.68rem' }}>
                          Start Here ⭐
                        </span>
                      ) : (
                        <span className="small font-mono" style={{ color: 'var(--learn-text-subtle)', fontSize: '0.72rem' }}>
                          Not started
                        </span>
                      )}
                    </div>

                    <h3 className="h6 fw-bold mb-1" style={{ color: 'var(--learn-text)' }}>
                      {topic.title}
                    </h3>

                    <p className="small mb-3" style={{ color: 'var(--learn-text-muted)', fontSize: '0.84rem', lineHeight: '1.5' }}>
                      {topic.tagline}
                    </p>

                    {/* Everyday Analogy Callout Box */}
                    <div 
                      className="p-3 mb-3 rounded-3"
                      style={{ backgroundColor: 'var(--learn-surface-secondary)', border: '1px solid var(--learn-border-subtle)' }}
                    >
                      <div className="d-flex align-items-center gap-1 small font-mono mb-1" style={{ color: 'var(--learn-accent)', fontSize: '0.72rem' }}>
                        <Compass size={13} />
                        <span className="fw-bold">Everyday Metaphor:</span>
                      </div>
                      <div className="small" style={{ color: 'var(--learn-text)', fontSize: '0.82rem', lineHeight: '1.4' }}>
                        {topic.everydayAnalogySummary}
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Progress bar */}
                    <div className="learn-progress-track mb-3" style={{ height: '5px' }}>
                      <div 
                        className="learn-progress-bar" 
                        style={{ 
                          width: `${topicPct}%`, 
                          background: isFinished ? 'var(--learn-success)' : 'var(--learn-accent)' 
                        }} 
                      />
                    </div>

                    <div className="d-flex align-items-center justify-content-between pt-1">
                      <span className="small font-mono" style={{ color: 'var(--learn-text-muted)', fontSize: '0.74rem' }}>
                        {topic.lessons.length} {topic.lessons.length === 1 ? 'Lesson' : 'Lessons'} • {topicPoints} points
                      </span>

                      <span className="small fw-bold d-inline-flex align-items-center gap-1" style={{ color: 'var(--learn-accent)', fontSize: '0.82rem' }}>
                        <span>{topicDone > 0 ? "Continue" : "Start Learning"}</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearnLandingPage;
