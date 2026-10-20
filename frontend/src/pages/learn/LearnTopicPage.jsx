import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  ChevronRight, 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles,
  Check,
  Compass
} from 'lucide-react';
import { 
  LEARN_CURRICULUM, 
  getTopicBySlug, 
  getLessonBySlug 
} from '../../data/learnCurriculum';
import { LearnService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LearningPointStageFlow from '../../components/learn/LearningPointStageFlow';

const LearnTopicPage = () => {
  const { topicSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [togglingPointId, setTogglingPointId] = useState(null);

  // Resolve current Topic
  const topic = getTopicBySlug(topicSlug) || LEARN_CURRICULUM[0];

  // Resolve current Lesson
  const currentLesson = getLessonBySlug(topic.slug, lessonSlug) || topic.lessons[0];

  // Fetch authenticated user progress from backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await LearnService.getUserProgress();
        setUserProgress(data);
      } catch (e) {
        console.warn('Progress fetch failed:', e);
      }
    };
    fetchProgress();
  }, []);

  // Record lesson view for session resume
  useEffect(() => {
    if (topic && currentLesson) {
      LearnService.recordLessonView({
        topicSlug: topic.slug,
        lessonSlug: currentLesson.slug
      }).catch(() => {});
    }
  }, [topic?.slug, currentLesson?.slug]);

  // Handle Mark as Complete toggle
  const handleTogglePoint = async (pointId) => {
    try {
      setTogglingPointId(pointId);
      const isCurrentlyCompleted = userProgress?.completedPointIds?.includes(pointId);
      const updated = await LearnService.toggleProgress({
        topicSlug: topic.slug,
        lessonSlug: currentLesson.slug,
        learningPointId: pointId,
        completed: !isCurrentlyCompleted
      });
      setUserProgress(updated);

      if (!isCurrentlyCompleted) {
        addToast("Good progress. You've understood this concept! Keep going.", "success");
      } else {
        addToast("Point reopened for practice.", "info");
      }
    } catch (err) {
      addToast(err.message || "Failed to update progress", "error");
    } finally {
      setTogglingPointId(null);
    }
  };

  // Find previous and next lessons across all topics
  const allLessonsFlat = [];
  LEARN_CURRICULUM.forEach(t => {
    t.lessons.forEach(l => {
      allLessonsFlat.push({ topic: t, lesson: l });
    });
  });

  const currentIndex = allLessonsFlat.findIndex(
    item => item.topic.slug === topic.slug && item.lesson.slug === currentLesson.slug
  );

  const prevLesson = currentIndex > 0 ? allLessonsFlat[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessonsFlat.length - 1 ? allLessonsFlat[currentIndex + 1] : null;

  // Topic points count & completed count
  let topicTotalPoints = 0;
  let topicCompletedPoints = 0;
  topic.lessons.forEach(l => {
    l.points.forEach(p => {
      topicTotalPoints++;
      if (userProgress?.completedPointIds?.includes(p.id)) {
        topicCompletedPoints++;
      }
    });
  });
  const topicPct = topicTotalPoints > 0 ? Math.round((topicCompletedPoints / topicTotalPoints) * 100) : 0;

  return (
    <div className="learn-classroom-wrapper pb-5">
      {/* Mobile Sidebar Toggle Button */}
      <div className="d-lg-none mb-3 d-flex align-items-center justify-content-between p-3 rounded-4 learn-card">
        <button
          type="button"
          className="btn btn-sm btn-learn-secondary d-inline-flex align-items-center gap-2"
          onClick={() => setMobileMenuOpen(prev => !prev)}
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          <span>Course Outline</span>
        </button>

        <span className="small font-mono fw-bold" style={{ color: 'var(--learn-text-muted)', fontSize: '0.78rem' }}>
          {topic.title}
        </span>
      </div>

      <div className="row g-4">
        {/* Left-Hand Course Navigation Panel */}
        <div className={`col-12 col-lg-3 ${mobileMenuOpen ? 'd-block' : 'd-none d-lg-block'}`}>
          <div 
            className="learn-card p-3 position-sticky" 
            style={{ 
              top: '80px', 
              maxHeight: 'calc(100vh - 100px)', 
              overflowY: 'auto',
              border: '1px solid var(--learn-border)' 
            }}
          >
            {/* Back to Course Overview */}
            <Link 
              to="/learn" 
              className="small d-inline-flex align-items-center gap-1 mb-3 text-decoration-none font-mono fw-semibold"
              style={{ color: 'var(--learn-accent)', fontSize: '0.78rem' }}
            >
              <ArrowLeft size={13} />
              <span>All 13 Topics</span>
            </Link>

            {/* Current Topic Header & Progress */}
            <div className="mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--learn-border-subtle)' }}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="badge font-mono" style={{ backgroundColor: 'var(--learn-surface-secondary)', color: 'var(--learn-text-muted)', fontSize: '0.7rem' }}>
                  Topic {topic.order} of 13
                </span>
                <span className="small font-mono fw-bold" style={{ color: 'var(--learn-accent)', fontSize: '0.74rem' }}>
                  {topicPct}% done
                </span>
              </div>
              <h2 className="h6 fw-bold mb-2 mt-1" style={{ color: 'var(--learn-text)' }}>
                {topic.title}
              </h2>
              <div className="learn-progress-track">
                <div className="learn-progress-bar" style={{ width: `${topicPct}%` }} />
              </div>
            </div>

            {/* All 13 Topics & Lessons Outline */}
            <div className="d-flex flex-column gap-2">
              {LEARN_CURRICULUM.map(t => {
                const isSelectedTopic = t.slug === topic.slug;

                // Check if all points in topic are done
                let tPoints = 0;
                let tDone = 0;
                t.lessons.forEach(l => {
                  l.points.forEach(p => {
                    tPoints++;
                    if (userProgress?.completedPointIds?.includes(p.id)) tDone++;
                  });
                });
                const isTopicDone = tPoints > 0 && tDone === tPoints;

                return (
                  <div 
                    key={t.id} 
                    className="p-2 rounded-3 transition-all"
                    style={{ 
                      backgroundColor: isSelectedTopic ? 'var(--learn-surface-secondary)' : 'transparent',
                      border: isSelectedTopic ? '1px solid var(--learn-border-subtle)' : '1px solid transparent'
                    }}
                  >
                    <div 
                      className="d-flex align-items-center justify-content-between py-1"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (!isSelectedTopic) {
                          navigate(`/learn/${t.slug}/${t.lessons[0].slug}`);
                          setMobileMenuOpen(false);
                        }
                      }}
                    >
                      <span 
                        className="small fw-semibold"
                        style={{ 
                          color: isSelectedTopic ? 'var(--learn-accent)' : 'var(--learn-text)',
                          fontSize: '0.82rem' 
                        }}
                      >
                        {t.order}. {t.title}
                      </span>
                      {isTopicDone ? (
                        <CheckCircle2 size={13} style={{ color: 'var(--learn-success)' }} />
                      ) : isSelectedTopic ? (
                        <span className="badge rounded-circle p-1" style={{ backgroundColor: 'var(--learn-accent)', width: '7px', height: '7px' }} />
                      ) : null}
                    </div>

                    {/* Lessons for selected topic */}
                    {isSelectedTopic && (
                      <div className="ms-2 mt-2 ps-2 border-start d-flex flex-column gap-1" style={{ borderColor: 'var(--learn-border)' }}>
                        {t.lessons.map(l => {
                          const isActiveLesson = l.slug === currentLesson.slug;
                          const isLessonDone = l.points.every(p => userProgress?.completedPointIds?.includes(p.id));

                          return (
                            <Link
                              key={l.id}
                              to={`/learn/${t.slug}/${l.slug}`}
                              className="d-flex align-items-center justify-content-between py-1 px-2 rounded-2 text-decoration-none transition-all"
                              style={{
                                backgroundColor: isActiveLesson ? 'var(--learn-surface)' : 'transparent',
                                color: isActiveLesson ? 'var(--learn-accent)' : 'var(--learn-text-muted)',
                                fontSize: '0.78rem',
                                fontWeight: isActiveLesson ? 700 : 500,
                                border: isActiveLesson ? '1px solid var(--learn-border)' : '1px solid transparent'
                              }}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span className="text-truncate">{l.title}</span>
                              {isLessonDone && (
                                <CheckCircle2 size={13} style={{ color: 'var(--learn-success)', flexShrink: 0 }} />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right-Hand Focused Lesson Pane */}
        <div className="col-12 col-lg-9">
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            {/* Breadcrumb Navigation */}
            <div className="d-flex align-items-center gap-2 small font-mono mb-3" style={{ fontSize: '0.78rem' }}>
              <Link to="/learn" className="text-decoration-none" style={{ color: 'var(--learn-text-muted)' }}>Learn</Link>
              <span style={{ color: 'var(--learn-border)' }}>/</span>
              <span style={{ color: 'var(--learn-accent)' }}>{topic.title}</span>
              <span style={{ color: 'var(--learn-border)' }}>/</span>
              <span style={{ color: 'var(--learn-text)' }}>{currentLesson.title}</span>
            </div>

            {/* Lesson Header Banner */}
            <div 
              className="learn-card p-4 p-md-5 mb-4 rounded-4"
              style={{ borderLeft: '4px solid var(--learn-accent)' }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="learn-stage-pill stage-explore">
                  Topic {topic.order} • Lesson Guide
                </span>
              </div>

              <h1 className="h3 fw-bold mb-2" style={{ color: 'var(--learn-text)', letterSpacing: '-0.02em' }}>
                {currentLesson.title}
              </h1>

              <p className="mb-0" style={{ color: 'var(--learn-text-muted)', fontSize: '0.96rem', lineHeight: '1.65' }}>
                {currentLesson.summary}
              </p>
            </div>

            {/* 5-Stage Learning Points Journey */}
            {currentLesson.points.map((point) => {
              const isCompleted = userProgress?.completedPointIds?.includes(point.id);

              return (
                <LearningPointStageFlow
                  key={point.id}
                  point={point}
                  topic={topic}
                  isCompleted={isCompleted}
                  onToggleComplete={handleTogglePoint}
                  isToggling={togglingPointId === point.id}
                />
              );
            })}

            {/* Previous / Next Lesson Navigation Footer */}
            <div 
              className="learn-card p-4 d-flex flex-wrap align-items-center justify-content-between gap-3 rounded-4"
              style={{ border: '1px solid var(--learn-border)' }}
            >
              {prevLesson ? (
                <button
                  type="button"
                  className="btn btn-sm btn-learn-secondary d-inline-flex align-items-center gap-2"
                  onClick={() => navigate(`/learn/${prevLesson.topic.slug}/${prevLesson.lesson.slug}`)}
                >
                  <ArrowLeft size={15} />
                  <span>Prev: {prevLesson.lesson.title}</span>
                </button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <button
                  type="button"
                  className="btn btn-sm btn-learn-primary d-inline-flex align-items-center gap-2"
                  onClick={() => navigate(`/learn/${nextLesson.topic.slug}/${nextLesson.lesson.slug}`)}
                >
                  <span>Next: {nextLesson.lesson.title}</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <Link to="/learn" className="btn btn-sm btn-learn-primary px-3 py-2">
                  Course Complete! Return to Overview
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnTopicPage;
