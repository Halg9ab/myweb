import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp, TrendingDown, CheckSquare, Calendar,
  Target, DollarSign, Zap, Clock, ArrowRight, Star
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10,15,30,0.95)',
        border: '1px solid var(--border-accent)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px',
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontFamily: 'var(--font-mono)' }}>
            ${p.value?.toFixed(0)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const { tasks, expenses, goals, events } = state;

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskProgress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  const spendingData = useMemo(() => {
    return MONTHS.slice(0, 6).map((month, i) => ({
      month,
      spending: Math.round(300 + Math.random() * 500 + (i * 30)),
      budget: 600,
    }));
  }, []);

  const upcomingEvents = events.filter(e => !e.completed).slice(0, 4);
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 5);

  const statCards = [
    {
      label: 'Total Spent', value: `$${totalExpenses.toFixed(0)}`,
      sub: 'This month', icon: DollarSign, color: 'cyan',
      accent: 'var(--accent-cyan)',
    },
    {
      label: 'Tasks Done', value: `${completedTasks}/${tasks.length}`,
      sub: `${taskProgress}% complete`, icon: CheckSquare, color: 'green',
      accent: 'var(--accent-green)',
    },
    {
      label: 'Saved Total', value: `$${totalSaved.toLocaleString()}`,
      sub: `of $${totalTarget.toLocaleString()} goal`, icon: Target, color: 'purple',
      accent: 'var(--accent-purple)',
    },
    {
      label: 'Events Soon', value: upcomingEvents.length,
      sub: 'Upcoming', icon: Calendar, color: 'orange',
      accent: 'var(--accent-orange)',
    },
  ];

  const catColors = {
    food: '#f59e0b', clothes: '#ec4899', tech: '#3b82f6',
    subscriptions: '#8b5cf6', transport: '#06b6d4',
    entertainment: '#f97316', education: '#10b981',
    personal: '#a78bfa', savings: '#34d399', bills: '#ef4444', misc: '#94a3b8'
  };

  const motivationalQuotes = [
    "Small steps every day lead to massive results.",
    "Discipline is choosing between what you want now and what you want most.",
    "Track it, analyze it, improve it.",
  ];
  const quote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <div className="page-container animate-fade-in">
      {/* Quote banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(139,92,246,0.08))',
        border: '1px solid rgba(0,212,255,0.12)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <Star size={16} color="var(--accent-cyan)" />
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{quote}</p>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          DAILY INSIGHT
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`glass-card stat-card ${card.color}`} style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: `${card.accent}18`,
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={card.accent} />
                </div>
                <TrendingUp size={14} color="var(--accent-green)" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, marginBottom: '4px', color: card.accent }}>
                {card.value}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>{card.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Spending chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">
            <TrendingUp size={16} color="var(--accent-cyan)" />
            Spending Overview
            <span style={{ marginLeft: 'auto' }}>6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="spending" stroke="#00d4ff" strokeWidth={2} fill="url(#spendGrad)" />
              <Area type="monotone" dataKey="budget" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#budgetGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              <div style={{ width: '12px', height: '2px', background: 'var(--accent-cyan)', borderRadius: '1px' }} />
              Actual Spending
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              <div style={{ width: '12px', height: '2px', background: 'var(--accent-purple)', borderRadius: '1px', borderTop: '2px dashed' }} />
              Budget
            </div>
          </div>
        </div>

        {/* Task progress */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">
            <CheckSquare size={16} color="var(--accent-green)" />
            Task Progress
            <span style={{ marginLeft: 'auto' }}>{taskProgress}% done</span>
          </div>
          {/* Circular progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="var(--accent-green)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - taskProgress / 100)}`}
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)',
                color: 'var(--accent-green)',
              }}>
                {taskProgress}%
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {['university', 'work', 'personal', 'fitness'].map(cat => {
                const catTasks = tasks.filter(t => t.category === cat);
                const done = catTasks.filter(t => t.completed).length;
                const pct = catTasks.length ? Math.round((done / catTasks.length) * 100) : 0;
                return (
                  <div key={cat} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{cat}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '11px' }}>{done}/{catTasks.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, var(--accent-green), var(--accent-cyan))',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {/* Pending tasks */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">
            <Clock size={16} color="var(--accent-orange)" />
            Pending Tasks
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pendingTasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px' }}>All tasks done! 🎉</p>
            ) : pendingTasks.map(task => (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
              }}>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                  className="checkbox-custom"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{task.category}</div>
                </div>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  background: task.priority === 'high' ? 'var(--accent-red)' : task.priority === 'medium' ? 'var(--accent-orange)' : 'var(--accent-green)',
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">
            <Calendar size={16} color="var(--accent-blue)" />
            Upcoming Events
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcomingEvents.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px' }}>No upcoming events</p>
            ) : upcomingEvents.map(event => (
              <div key={event.id} style={{
                display: 'flex', gap: '12px', padding: '10px 12px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px', border: '1px solid var(--border)',
                borderLeft: `3px solid ${event.color}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{event.date} · {event.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent expenses */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">
            <DollarSign size={16} color="var(--accent-cyan)" />
            Recent Expenses
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentExpenses.map(exp => (
              <div key={exp.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  background: catColors[exp.category] || 'var(--text-muted)',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{exp.category}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-cyan)', flexShrink: 0 }}>
                  -${exp.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals overview */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div className="section-title">
          <Target size={16} color="var(--accent-purple)" />
          Goals Overview
        </div>
        <div className="grid-3">
          {goals.map(goal => {
            const pct = Math.round((goal.saved / goal.target) * 100);
            return (
              <div key={goal.id} style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{goal.emoji}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{goal.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due {goal.deadline}</div>
                  </div>
                  <span style={{
                    marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '13px',
                    color: goal.color,
                  }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: goal.color }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>${goal.saved.toLocaleString()}</span>
                  <span>${goal.target.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
