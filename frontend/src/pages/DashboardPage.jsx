import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Plus, 
  ArrowRight,
  ExternalLink,
  Code2,
  Sparkles,
  BookOpen,
  RotateCw,
  TrendingUp,
  CheckSquare
} from 'lucide-react';
import { DashboardService, MistakeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import ActivityHeatmap from '../components/ActivityHeatmap';
import LoadingSpinner from '../components/LoadingSpinner';
import { MistakeTypeBadge, ReviewStatusBadge, TopicBadge } from '../components/BadgePill';
import ReviewModal from '../components/ReviewModal';
import { formatDate } from '../utils/constants';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [stats, setStats] = useState(null);
  const [mistakesByType, setMistakesByType] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [dueMistakes, setDueMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalMistake, setReviewModalMistake] = useState(null);
  const [updatingReview, setUpdatingReview] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, typesData, timelineData, dueData] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getMistakesByType(),
        DashboardService.getMistakesOverTime(120),
        MistakeService.getMistakes({ reviewStatus: 'NEEDS_ANOTHER_REVIEW', size: 5, sort: 'createdAt,desc' }).catch(() => ({ content: [] }))
      ]);

      setStats(statsData);
      setMistakesByType(typesData || []);
      setTimeline(timelineData || []);
      setDueMistakes(dueData?.content || []);
    } catch (err) {
      addToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveReview = async (reviewData) => {
    try {
      setUpdatingReview(true);
      await MistakeService.updateReview(reviewModalMistake.id, reviewData);
      addToast('Review status updated successfully', 'success');
      setReviewModalMistake(null);
      fetchDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to update review status', 'error');
    } finally {
      setUpdatingReview(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <LoadingSpinner message="Loading developer workspace..." />
      </div>
    );
  }

  const total = stats?.totalMistakes || 0;
  const reviewed = stats?.reviewedCount || 0;
  const needsReview = stats?.needsReviewCount || 0;
  const completionRate = total > 0 ? Math.round((reviewed / total) * 100) : 0;
  const recentMistakes = stats?.recentlyAddedMistakes || [];

  return (
    <div className="container-fluid px-0" style={{ maxWidth: '1280px' }}>
      {/* LeetCode Profile Header */}
      <div className="lc-panel mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded d-flex align-items-center justify-content-center fw-bold"
            style={{ 
              width: '44px', 
              height: '44px', 
              fontSize: '18px',
              backgroundColor: 'rgba(255, 161, 22, 0.15)', 
              color: 'var(--lc-accent)',
              border: '1px solid rgba(255, 161, 22, 0.3)'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h1 className="h6 fw-bold mb-0" style={{ color: 'var(--lc-text-primary)', fontSize: '16px' }}>
                {user?.name || 'Developer'}
              </h1>
              <span className="badge" style={{ backgroundColor: 'var(--lc-bg-secondary)', color: 'var(--lc-text-secondary)', border: '1px solid var(--lc-border)', fontSize: '11px' }}>
                DSA Workspace
              </span>
            </div>
            <div className="text-muted" style={{ fontSize: '12px' }}>
              {user?.email} • Systematic mistake tracking and invariant internalization
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-lc-secondary btn-sm"
            onClick={fetchDashboardData}
            title="Refresh statistics"
          >
            <RotateCw size={13} />
            <span>Refresh</span>
          </button>
          <button 
            className="btn btn-lc-primary btn-sm"
            onClick={() => navigate('/mistakes/new')}
          >
            <Plus size={14} />
            <span>Record Mistake</span>
          </button>
        </div>
      </div>

      {/* 4 Compact LeetCode Stat Panels */}
      <div className="row g-2 mb-3">
        <div className="col-6 col-lg-3">
          <StatCard 
            title="Total Recorded"
            value={total}
            subtitle={`${stats?.mistakesThisWeek || 0} this week`}
            icon={BookOpen}
            color="var(--lc-text-primary)"
            bgColor="var(--lc-bg-secondary)"
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard 
            title="Problems Reviewed"
            value={reviewed}
            subtitle="Internalized invariants"
            icon={CheckCircle2}
            color="var(--lc-success)"
            bgColor="var(--lc-success-subtle)"
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard 
            title="Awaiting Review"
            value={needsReview}
            subtitle="Queue pending attention"
            icon={Clock}
            color="var(--lc-accent)"
            bgColor="var(--lc-accent-subtle)"
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard 
            title="Completion Rate"
            value={`${completionRate}%`}
            subtitle={`${reviewed} / ${total} solved`}
            icon={TrendingUp}
            color="var(--lc-info)"
            bgColor="var(--lc-info-subtle)"
          />
        </div>
      </div>

      {/* LeetCode Activity Calendar Heatmap */}
      <div className="mb-3">
        <ActivityHeatmap timeline={timeline} days={120} />
      </div>

      {/* Mistake Category Summary */}
      <div className="lc-panel mb-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <Sparkles size={16} style={{ color: 'var(--lc-accent)' }} />
            <span className="fw-semibold" style={{ color: 'var(--lc-text-primary)', fontSize: '13px' }}>
              Failure Archetype Breakdown
            </span>
          </div>
          <Link to="/analytics" className="text-decoration-none d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
            <span>Detailed Analytics</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="row g-2">
          {mistakesByType.map((item) => {
            const count = item.count || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={item.mistakeType} className="col-6 col-md-4 col-lg">
                <div 
                  className="p-2 rounded" 
                  style={{ 
                    backgroundColor: 'var(--lc-bg-secondary)', 
                    border: '1px solid var(--lc-border-subtle)' 
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-truncate text-muted" style={{ fontSize: '11px', maxWidth: '110px' }}>
                      {item.label}
                    </span>
                    <strong style={{ color: 'var(--lc-text-primary)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                      {count}
                    </strong>
                  </div>
                  <div className="progress" style={{ height: '3px', backgroundColor: 'var(--lc-border)' }}>
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${pct}%`, 
                        backgroundColor: 'var(--lc-accent)' 
                      }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Section: Recently Recorded & Due for Review */}
      <div className="row g-3">
        {/* Recently Added Section */}
        <div className="col-12 col-lg-6">
          <div className="lc-panel h-100 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <BookOpen size={16} style={{ color: 'var(--lc-text-secondary)' }} />
                <span className="fw-semibold" style={{ color: 'var(--lc-text-primary)', fontSize: '13px' }}>
                  Recently Recorded Mistakes
                </span>
              </div>
              <Link to="/mistakes" className="text-decoration-none d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                <span>Problemset</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="flex-grow-1">
              {recentMistakes.length === 0 ? (
                <div className="text-center py-4 text-muted" style={{ fontSize: '12px' }}>
                  No mistake records logged yet. Click "Record Mistake" to start.
                </div>
              ) : (
                <div className="lc-table-container">
                  <table className="lc-table">
                    <thead>
                      <tr>
                        <th>Problem</th>
                        <th>Topic</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMistakes.map((mistake) => (
                        <tr key={mistake.id} onClick={() => navigate(`/mistakes/${mistake.id}`)}>
                          <td>
                            <div className="fw-medium text-truncate" style={{ maxWidth: '180px', color: 'var(--lc-text-primary)' }}>
                              {mistake.problemName}
                            </div>
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              {formatDate(mistake.createdAt)}
                            </small>
                          </td>
                          <td>
                            <TopicBadge topic={mistake.topic} />
                          </td>
                          <td>
                            <ReviewStatusBadge status={mistake.reviewStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Due for Review Section */}
        <div className="col-12 col-lg-6">
          <div className="lc-panel h-100 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <CheckSquare size={16} style={{ color: 'var(--lc-accent)' }} />
                <span className="fw-semibold" style={{ color: 'var(--lc-text-primary)', fontSize: '13px' }}>
                  Due for Review ({needsReview})
                </span>
              </div>
              <Link to="/reviews" className="text-decoration-none d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                <span>Review Queue</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="flex-grow-1">
              {dueMistakes.length === 0 ? (
                <div className="text-center py-4 text-muted" style={{ fontSize: '12px' }}>
                  <CheckCircle2 size={24} className="text-success mb-2 d-block mx-auto" />
                  All caught up! No problems currently awaiting review.
                </div>
              ) : (
                <div className="lc-table-container">
                  <table className="lc-table">
                    <thead>
                      <tr>
                        <th>Problem</th>
                        <th>Category</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dueMistakes.map((mistake) => (
                        <tr key={mistake.id}>
                          <td onClick={() => navigate(`/mistakes/${mistake.id}`)}>
                            <div className="fw-medium text-truncate" style={{ maxWidth: '180px', color: 'var(--lc-text-primary)' }}>
                              {mistake.problemName}
                            </div>
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              {mistake.topic || 'General'}
                            </small>
                          </td>
                          <td onClick={() => navigate(`/mistakes/${mistake.id}`)}>
                            <MistakeTypeBadge type={mistake.mistakeType} />
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-lc-success btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewModalMistake(mistake);
                              }}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalMistake && (
        <ReviewModal
          mistake={reviewModalMistake}
          isOpen={!!reviewModalMistake}
          onClose={() => setReviewModalMistake(null)}
          onSave={handleSaveReview}
          loading={updatingReview}
        />
      )}
    </div>
  );
};

export default DashboardPage;
