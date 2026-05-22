import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, Award, Activity } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';

const CATEGORIES = [
  { value: 'food', label: 'Food', color: '#f59e0b' },
  { value: 'clothes', label: 'Clothes', color: '#ec4899' },
  { value: 'tech', label: 'Tech', color: '#3b82f6' },
  { value: 'subscriptions', label: 'Subscriptions', color: '#8b5cf6' },
  { value: 'transport', label: 'Transport', color: '#06b6d4' },
  { value: 'entertainment', label: 'Entertainment', color: '#f97316' },
  { value: 'education', label: 'Education', color: '#10b981' },
  { value: 'bills', label: 'Bills', color: '#ef4444' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px' }}>
        {label && <p style={{ color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill, fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>
            {p.name}: {typeof p.value === 'number' ? (p.name?.includes('$') || p.dataKey?.includes('amount') || p.dataKey?.includes('spent') || p.dataKey?.includes('budget') ? '$' : '') : ''}{typeof p.value === 'number' ? p.value.toFixed(0) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { state } = useApp();
  const { expenses, tasks, goals, events } = state;
  const [period, setPeriod] = useState('month');

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((m, i) => ({
      month: m,
      spending: Math.round(400 + Math.sin(i) * 200 + Math.random() * 150),
      income: 2000,
      savings: Math.round(400 + i * 30),
    }));
  }, []);

  const weeklyData = useMemo(() => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      tasks: Math.floor(Math.random() * 8 + 2),
      completed: Math.floor(Math.random() * 6),
      events: Math.floor(Math.random() * 4),
    }));
  }, []);

  const catData = useMemo(() => {
    return CATEGORIES.map(cat => {
      const total = expenses.filter(e => e.category === cat.value).reduce((s, e) => s + e.amount, 0);
      return { name: cat.label, value: Math.round(total), color: cat.color };
    }).filter(d => d.value > 0);
  }, [expenses]);

  const productivityRadar = useMemo(() => {
    const cats = ['university', 'work', 'personal', 'fitness', 'future'];
    return cats.map(cat => {
      const catTasks = tasks.filter(t => t.category === cat);
      const pct = catTasks.length ? Math.round((catTasks.filter(t => t.completed).length / catTasks.length) * 100) : 0;
      return { category: cat.charAt(0).toUpperCase() + cat.slice(1), score: pct };
    });
  }, [tasks]);

  const goalsProgress = useMemo(() => {
    return goals.map(g => ({
      name: g.title,
      saved: g.saved,
      remaining: Math.max(0, g.target - g.saved),
      color: g.color,
    }));
  }, [goals]);

  const insights = useMemo(() => {
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const completedTasks = tasks.filter(t => t.completed).length;
    const taskRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
    const goalsComplete = goals.filter(g => g.saved >= g.target).length;
    const avgExpense = expenses.length ? (totalSpent / expenses.length).toFixed(2) : 0;

    return [
      { label: 'Task completion rate', value: `${taskRate}%`, trend: taskRate > 70 ? 'up' : 'down', icon: Activity, color: 'var(--accent-green)' },
      { label: 'Avg expense per transaction', value: `$${avgExpense}`, trend: 'neutral', icon: TrendingDown, color: 'var(--accent-orange)' },
      { label: 'Goals achieved', value: `${goalsComplete}/${goals.length}`, trend: goalsComplete > 0 ? 'up' : 'neutral', icon: Award, color: 'var(--accent-purple)' },
      { label: 'Events completed', value: `${events.filter(e => e.completed).length}/${events.length}`, trend: 'up', icon: TrendingUp, color: 'var(--accent-cyan)' },
    ];
  }, [expenses, tasks, goals, events]);

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Insights across your productivity & finances</p>
        </div>
        <div className="tab-bar" style={{ marginBottom: 0 }}>
          {['week', 'month', 'year'].map(p => (
            <button key={p} className={`tab-item ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)} style={{ textTransform: 'capitalize', padding: '7px 16px' }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Key insights */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${ins.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={ins.color} />
                </div>
                {ins.trend === 'up' && <TrendingUp size={14} color="var(--accent-green)" />}
                {ins.trend === 'down' && <TrendingDown size={14} color="var(--accent-red)" />}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: ins.color, marginBottom: '4px' }}>{ins.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ins.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main charts row */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Spending vs Income */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">
            <TrendingUp size={16} color="var(--accent-cyan)" />
            Cash Flow Overview
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spendGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="saveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
              <Area type="monotone" dataKey="spending" stroke="#ef4444" fill="url(#spendGrad2)" strokeWidth={2} name="Spending" />
              <Area type="monotone" dataKey="savings" stroke="#00d4ff" fill="url(#saveGrad)" strokeWidth={2} name="Savings" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
            {[{ label: 'Income', color: '#10b981' }, { label: 'Spending', color: '#ef4444' }, { label: 'Savings', color: '#00d4ff' }].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                <div style={{ width: '10px', height: '2px', background: item.color, borderRadius: '1px' }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Productivity radar */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">
            <Activity size={16} color="var(--accent-purple)" />
            Productivity Score
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={productivityRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Radar name="Completion %" dataKey="score" stroke="var(--accent-cyan)" fill="var(--accent-cyan)" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second charts row */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Category spending pie */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">
            <TrendingDown size={16} color="var(--accent-orange)" />
            Expense Distribution
          </div>
          {catData.length > 0 ? (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={3}>
                    {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {catData.slice(0, 5).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>{item.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: item.color }}>${item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state"><p>No expense data yet</p></div>
          )}
        </div>

        {/* Weekly task activity */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">
            <Activity size={16} color="var(--accent-green)" />
            Weekly Activity
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tasks" fill="rgba(0,212,255,0.4)" radius={[4, 4, 0, 0]} name="Tasks" />
              <Bar dataKey="completed" fill="var(--accent-green)" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals progress bars */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div className="section-title">
          <Award size={16} color="var(--accent-purple)" />
          Goals Progress Analytics
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={goalsProgress} layout="vertical" barSize={16}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="saved" stackId="a" fill="var(--accent-cyan)" radius={[0, 0, 0, 0]} name="Saved" />
            <Bar dataKey="remaining" stackId="a" fill="rgba(255,255,255,0.06)" radius={[4, 4, 4, 4]} name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
