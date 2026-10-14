import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  ExternalLink,
  Eye,
  Edit,
  RotateCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { DashboardService, MistakeService } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { MistakeTypeBadge, ReviewStatusBadge, TopicBadge, PlatformBadge } from '../components/BadgePill';
import ReviewModal from '../components/ReviewModal';
import { formatDate, getMistakeTypeColor } from '../utils/constants';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [mistakesByType, setMistakesByType] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalMistake, setReviewModalMistake] = useState(null);
  const [updatingReview, setUpdatingReview] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, typesData, timelineData] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getMistakesByType(),
        DashboardService.getMistakesOverTime(14)
      ]);

      setStats(statsData);
      setMistakesByType(typesData || []);
      setTimeline(timelineData || []);
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
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
      showToast({ message: 'Review status successfully updated!', type: 'success' });
      setReviewModalMistake(null);
      fetchDashboardData();
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setUpdatingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching dashboard metrics from MySQL..." />;
  }

  // Filter out zero-count mistake types for cleaner pie chart
  const activeMistakeTypes = mistakesByType.filter(t => t.count > 0);

  return (
    <div>
      <ReviewModal
        isOpen={Boolean(reviewModalMistake)}
        mistake={reviewModalMistake}
        isLoading={updatingReview}
        onClose={() => setReviewModalMistake(null)}
        onSave={handleSaveReview}
      />

      {/* Top Welcome / Action Banner */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            DSA Mistake Dashboard
          </h2>
          <p className="text-muted mb-0 small">
            Track patterns, review past mistakes, and build algorithmic intuition.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-secondary-custom d-inline-flex align-items-center gap-2"
            onClick={fetchDashboardData}
            title="Refresh statistics"
          >
            <RotateCw size={16} />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>

          <button 
            className="btn btn-save d-inline-flex align-items-center gap-2 px-3 py-2"
            onClick={() => navigate('/mistakes/new')}
          >
            <Plus size={18} />
            <span>Add New Mistake</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Mistakes"
            value={stats?.totalMistakes}
            subtitle="Persisted in database"
            icon={FileText}
            color="#6366f1"
            bgColor="rgba(99, 102, 241, 0.14)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Recorded This Week"
            value={stats?.mistakesThisWeek}
            subtitle="Past 7 days"
            icon={Calendar}
            color="#3b82f6"
            bgColor="rgba(59, 130, 246, 0.14)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Problems Reviewed"
            value={stats?.reviewedCount}
            subtitle={`${stats?.needsReviewCount || 0} still needing review`}
            icon={CheckCircle2}
            color="#10b981"
            bgColor="rgba(16, 185, 129, 0.14)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Most Frequent Mistake"
            value={stats?.mostFrequentMistakeTypeLabel || 'None'}
            subtitle="Top focus area for practice"
            icon={TrendingUp}
            color="#f59e0b"
            bgColor="rgba(245, 158, 11, 0.14)"
          />
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="row g-4 mb-4">
        {/* Timeline Area Chart */}
        <div className="col-12 col-lg-7">
          <div className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h3 className="h6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Mistakes Recorded Over Time
                </h3>
                <small className="text-muted">Daily mistake trend (Past 14 days)</small>
              </div>
            </div>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-muted)" 
                    fontSize={11}
                    tickFormatter={(val) => {
                      if (!val) return '';
                      const parts = val.split('-');
                      return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : val;
                    }}
                  />
                  <YAxis stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-card)', 
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Mistakes"
                    stroke="#6366f1" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Categories Distribution Donut Chart */}
        <div className="col-12 col-lg-5">
          <div className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h3 className="h6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Mistake Categories Distribution
                </h3>
                <small className="text-muted">Breakdown of root causes</small>
              </div>
            </div>

            {activeMistakeTypes.length === 0 ? (
              <div className="text-center py-5 text-muted small">
                No mistake category data recorded yet.
              </div>
            ) : (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeMistakeTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="label"
                    >
                      {activeMistakeTypes.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getMistakeTypeColor(entry.mistakeType)} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-card)', 
                        borderColor: 'var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)'
                      }} 
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={40}
                      formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recently Added Mistakes Table */}
      <div className="custom-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h3 className="h6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Recently Added Mistakes
            </h3>
            <small className="text-muted">Recent entries logged in your system</small>
          </div>
          <Link 
            to="/mistakes" 
            className="btn btn-sm btn-secondary-custom d-inline-flex align-items-center gap-1 text-decoration-none"
          >
            <span>View All</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {(!stats?.recentlyAddedMistakes || stats.recentlyAddedMistakes.length === 0) ? (
          <div className="empty-state py-4">
            <AlertCircle size={32} className="mb-2 text-muted" />
            <p className="mb-2">No mistake logs recorded yet.</p>
            <button 
              className="btn btn-save btn-sm"
              onClick={() => navigate('/mistakes/new')}
            >
              Add Your First Mistake
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Problem Name</th>
                  <th>Topic</th>
                  <th>Mistake Type</th>
                  <th>Review Status</th>
                  <th>Recorded</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentlyAddedMistakes.map((mistake) => (
                  <tr key={mistake.id}>
                    <td>
                      <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        <Link 
                          to={`/mistakes/${mistake.id}`} 
                          className="text-decoration-none text-reset hover-underline"
                        >
                          {mistake.problemName}
                        </Link>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <PlatformBadge platform={mistake.platform} />
                        {mistake.problemUrl && (
                          <a 
                            href={mistake.problemUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-muted text-decoration-none d-inline-flex align-items-center"
                            title="Open external problem link"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <TopicBadge topic={mistake.topic} />
                    </td>
                    <td>
                      <MistakeTypeBadge type={mistake.mistakeType} />
                    </td>
                    <td>
                      <ReviewStatusBadge status={mistake.reviewStatus} />
                    </td>
                    <td>
                      <small className="text-muted">{formatDate(mistake.createdAt)}</small>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          className="btn btn-sm btn-secondary-custom p-1"
                          onClick={() => setReviewModalMistake(mistake)}
                          title="Quick Review"
                        >
                          <CheckCircle2 size={16} className="text-success" />
                        </button>
                        <Link
                          to={`/mistakes/${mistake.id}`}
                          className="btn btn-sm btn-secondary-custom p-1 text-decoration-none"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/mistakes/${mistake.id}/edit`}
                          className="btn btn-sm btn-secondary-custom p-1 text-decoration-none"
                          title="Edit Mistake"
                        >
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
