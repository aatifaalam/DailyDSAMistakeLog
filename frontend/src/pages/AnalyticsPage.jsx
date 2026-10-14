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
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  CheckCircle2, 
  BrainCircuit, 
  Calendar,
  RotateCw
} from 'lucide-react';
import { DashboardService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
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

  if (loading && !stats) {
    return <LoadingSpinner text="Computing DSA mistake analytics and charts..." />;
  }

  const reviewCompletionRate = stats && stats.totalMistakes > 0
    ? Math.round((stats.reviewedCount / stats.totalMistakes) * 100)
    : 0;

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            DSA Mistake Analytics & Insights
          </h2>
          <p className="text-muted mb-0 small">
            Understand your problem-solving bottlenecks and measure review consistency.
          </p>
        </div>

        <button 
          className="btn btn-secondary-custom d-inline-flex align-items-center gap-2"
          onClick={() => fetchAnalytics(days)}
        >
          <RotateCw size={16} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Review Completion"
            value={`${reviewCompletionRate}%`}
            subtitle={`${stats?.reviewedCount || 0} of ${stats?.totalMistakes || 0} reviewed`}
            icon={CheckCircle2}
            color="#10b981"
            bgColor="rgba(16, 185, 129, 0.14)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Needs Review"
            value={stats?.needsReviewCount || 0}
            subtitle="Pending repetition"
            icon={BrainCircuit}
            color="#f59e0b"
            bgColor="rgba(245, 158, 11, 0.14)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Top Mistake Pattern"
            value={stats?.mostFrequentMistakeTypeLabel || 'None'}
            subtitle="Needs deliberate practice"
            icon={TrendingUp}
            color="#ef4444"
            bgColor="rgba(239, 68, 68, 0.14)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Top Problem Topic"
            value={topics.length > 0 ? topics[0].topic : 'None'}
            subtitle={topics.length > 0 ? `${topics[0].count} recorded mistakes` : 'No data'}
            icon={PieIcon}
            color="#6366f1"
            bgColor="rgba(99, 102, 241, 0.14)"
          />
        </div>
      </div>

      {/* Timeline Section with Days Switcher */}
      <div className="custom-card p-4 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h3 className="h6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Mistake Logging Velocity
            </h3>
            <small className="text-muted">Total mistakes logged across the selected time period</small>
          </div>

          <div className="btn-group btn-group-sm" role="group">
            {[7, 14, 30].map(d => (
              <button
                key={d}
                type="button"
                className={`btn ${days === d ? 'btn-indigo' : 'btn-secondary-custom'}`}
                onClick={() => setDays(d)}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsTimelineGradient" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#analyticsTimelineGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Breakdown: By Type & By Topic */}
      <div className="row g-4 mb-4">
        {/* By Mistake Type Bar Chart */}
        <div className="col-12 col-lg-6">
          <div className="custom-card p-4 h-100">
            <h3 className="h6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Mistakes by Failure Category
            </h3>
            <small className="text-muted d-block mb-3">Which root causes happen most frequently?</small>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mistakesByType} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
                  <YAxis 
                    type="category" 
                    dataKey="label" 
                    stroke="var(--text-muted)" 
                    fontSize={11} 
                    width={130}
                    tickFormatter={(val) => val.length > 18 ? `${val.substring(0, 16)}...` : val}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-card)', 
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }} 
                  />
                  <Bar dataKey="count" name="Count" radius={[0, 6, 6, 0]}>
                    {mistakesByType.map((entry, index) => (
                      <Cell key={`type-cell-${index}`} fill={getMistakeTypeColor(entry.mistakeType)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* By Topic Bar Chart */}
        <div className="col-12 col-lg-6">
          <div className="custom-card p-4 h-100">
            <h3 className="h6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Mistakes by Algorithmic Topic
            </h3>
            <small className="text-muted d-block mb-3">Which DSA domains give you the hardest time?</small>

            {topics.length === 0 ? (
              <div className="text-center py-5 text-muted small">
                No topic data logged yet.
              </div>
            ) : (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topics} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis 
                      dataKey="topic" 
                      stroke="var(--text-muted)" 
                      fontSize={10} 
                      angle={-25} 
                      textAnchor="end"
                      interval={0}
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
                    <Bar dataKey="count" name="Mistakes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
