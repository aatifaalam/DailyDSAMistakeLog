import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  CheckCircle2, 
  BrainCircuit, 
  RotateCw,
  Clock,
  Layers
} from 'lucide-react';
import { DashboardService } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import { getMistakeTypeColor } from '../utils/constants';

const AnalyticsPage = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(14);
  const [stats, setStats] = useState(null);
  const [mistakesByType, setMistakesByType] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [topics, setTopics] = useState([]);

  const fetchAnalytics = async (selectedDays = days) => {
    try {
      setLoading(true);
      const [statsData, typesData, timelineData, topicData] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getMistakesByType(),
        DashboardService.getMistakesOverTime(selectedDays),
        DashboardService.getMistakesByTopic()
      ]);

      setStats(statsData);
      setMistakesByType(typesData || []);
      setTimeline(timelineData || []);
      setTopics(topicData || []);
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  const reviewCompletionRate = stats && stats.totalMistakes > 0
    ? Math.round((stats.reviewedCount / stats.totalMistakes) * 100)
    : 0;

  const reviewSplitData = stats ? [
    { name: 'Reviewed', value: stats.reviewedCount || 0, color: 'var(--lc-success)' },
    { name: 'Pending Review', value: Math.max(0, (stats.totalMistakes || 0) - (stats.reviewedCount || 0)), color: 'var(--lc-accent)' }
  ] : [];

  const customTooltipStyle = {
    backgroundColor: '#262626',
    border: '1px solid #3A3A3A',
    borderRadius: '6px',
    color: '#EEEEEE',
    fontSize: '0.8rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
  };

  if (loading && !stats) {
    return (
      <div className="lc-panel p-5 text-center">
        <div className="spinner-border spinner-border-sm text-warning mb-2" role="status" />
        <p className="small text-muted mb-0">Computing DSA mistake analytics and charts...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: 'var(--lc-text-primary)', letterSpacing: '-0.01em' }}>
            Mistake Analytics
          </h1>
          <p className="small mb-0" style={{ color: 'var(--lc-text-secondary)' }}>
            Deep dive into recurring failure patterns, algorithmic weak points, and spaced repetition pace.
          </p>
        </div>

        <button 
          className="btn btn-sm btn-lc-secondary d-inline-flex align-items-center gap-1"
          onClick={() => fetchAnalytics(days)}
        >
          <RotateCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Review Completion"
            value={`${reviewCompletionRate}%`}
            subtitle={`${stats?.reviewedCount || 0} of ${stats?.totalMistakes || 0} mastered`}
            icon={CheckCircle2}
            color="var(--lc-success)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Pending Review"
            value={stats?.needsReviewCount || 0}
            subtitle="Needs re-attempt"
            icon={BrainCircuit}
            color="var(--lc-accent)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Most Frequent Error"
            value={stats?.mostFrequentMistakeTypeLabel || 'None'}
            subtitle="Recurring blindspot"
            icon={TrendingUp}
            color="var(--lc-error)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Top Mistake Topic"
            value={topics.length > 0 ? topics[0].topic : 'None'}
            subtitle={topics.length > 0 ? `${topics[0].count} recorded issues` : 'No data yet'}
            icon={PieIcon}
            color="var(--lc-info)"
          />
        </div>
      </div>

      {/* Velocity / Mistakes Over Time Timeline */}
      <div className="lc-panel p-3 mb-3">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
          <div>
            <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
              Mistake Logging Velocity
            </h2>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              Daily recorded mistakes over time
            </small>
          </div>

          <div className="btn-group btn-group-sm" role="group">
            {[7, 14, 30].map(d => (
              <button
                key={d}
                type="button"
                className={`btn btn-sm ${days === d ? 'btn-lc-primary' : 'btn-lc-secondary'}`}
                onClick={() => setDays(d)}
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsTimelineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFA116" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FFA116" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#737373" 
                fontSize={10}
                tickFormatter={(val) => {
                  if (!val) return '';
                  const parts = val.split('-');
                  return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : val;
                }}
              />
              <YAxis stroke="#737373" fontSize={10} allowDecimals={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area 
                type="monotone" 
                dataKey="count" 
                name="Mistakes"
                stroke="#FFA116" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#analyticsTimelineGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Failure Categories & Topics */}
      <div className="row g-3 mb-3">
        {/* Mistakes by Category */}
        <div className="col-12 col-lg-6">
          <div className="lc-panel p-3 h-100">
            <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
              Mistakes by Failure Category
            </h2>
            <small className="text-muted d-block mb-3" style={{ fontSize: '0.75rem' }}>
              Root causes behind algorithmic failures
            </small>

            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mistakesByType} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" horizontal={false} />
                  <XAxis type="number" stroke="#737373" fontSize={10} allowDecimals={false} />
                  <YAxis 
                    type="category" 
                    dataKey="label" 
                    stroke="#A0A0A0" 
                    fontSize={10} 
                    width={130}
                    tickFormatter={(val) => val.length > 18 ? `${val.substring(0, 16)}...` : val}
                  />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                    {mistakesByType.map((entry, index) => (
                      <Cell key={`type-cell-${index}`} fill={getMistakeTypeColor(entry.mistakeType)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mistakes by Topic */}
        <div className="col-12 col-lg-6">
          <div className="lc-panel p-3 h-100">
            <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
              Mistakes by Topic
            </h2>
            <small className="text-muted d-block mb-3" style={{ fontSize: '0.75rem' }}>
              DSA areas requiring reinforcement
            </small>

            {topics.length === 0 ? (
              <div className="text-center py-5 text-muted small">
                No topic data logged yet.
              </div>
            ) : (
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topics} margin={{ top: 5, right: 10, left: -25, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" vertical={false} />
                    <XAxis 
                      dataKey="topic" 
                      stroke="#A0A0A0" 
                      fontSize={10} 
                      angle={-25} 
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis stroke="#737373" fontSize={10} allowDecimals={false} />
                    <Tooltip contentStyle={customTooltipStyle} />
                    <Bar dataKey="count" name="Mistakes" fill="var(--lc-info)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Breakdown: Reviewed vs Unreviewed */}
      <div className="lc-panel p-3 mb-3">
        <h2 className="h6 fw-semibold mb-0" style={{ color: 'var(--lc-text-primary)' }}>
          Reviewed vs. Unreviewed Mistakes
        </h2>
        <small className="text-muted d-block mb-2" style={{ fontSize: '0.75rem' }}>
          Current completion of recorded mistakes across your practice logs
        </small>

        <div className="row align-items-center g-3">
          <div className="col-12 col-md-5" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewSplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {reviewSplitData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend 
                  wrapperStyle={{ fontSize: '0.75rem', color: '#A0A0A0' }}
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="col-12 col-md-7">
            <div className="p-3 rounded" style={{ backgroundColor: 'var(--lc-bg-main)', border: '1px solid var(--lc-border)' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Reviewed / Mastered</span>
                <span className="font-mono fw-bold" style={{ color: 'var(--lc-success)', fontSize: '0.85rem' }}>
                  {stats?.reviewedCount || 0} problems
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="small text-muted">Awaiting Re-attempt</span>
                <span className="font-mono fw-bold" style={{ color: 'var(--lc-accent)', fontSize: '0.85rem' }}>
                  {Math.max(0, (stats?.totalMistakes || 0) - (stats?.reviewedCount || 0))} problems
                </span>
              </div>
              <div className="progress" style={{ height: 6, backgroundColor: '#333333' }}>
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${reviewCompletionRate}%`, backgroundColor: 'var(--lc-success)' }}
                  aria-valuenow={reviewCompletionRate} 
                  aria-valuemin="0" 
                  aria-valuemax="100" 
                />
              </div>
              <div className="text-end mt-1 font-mono text-muted" style={{ fontSize: '0.72rem' }}>
                {reviewCompletionRate}% total completion
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
