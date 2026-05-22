import React, { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

const sectionTitles = {
  dashboard: { title: 'Dashboard', sub: 'Your personal command center' },
  calendar: { title: 'Calendar', sub: 'Schedule & events' },
  finance: { title: 'Finance', sub: 'Expense & budget tracking' },
  tasks: { title: 'Tasks', sub: 'Productivity & study management' },
  goals: { title: 'Goals', sub: 'Savings & personal goals' },
  analytics: { title: 'Analytics', sub: 'Insights & reports' },
};

export default function Header() {
  const { state } = useApp();
  const [time, setTime] = useState(new Date());
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const section = sectionTitles[state.activeSection] || { title: 'MyWeb', sub: '' };

  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d) => d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header style={{
      height: '64px',
      background: 'rgba(10,15,30,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: '20px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Title */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{section.sub}</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Quick search..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '8px 14px 8px 32px',
            fontSize: '13px',
            color: 'var(--text-primary)',
            outline: 'none',
            width: '220px',
            fontFamily: 'var(--font-main)',
            transition: 'all 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(0,212,255,0.4)';
            e.target.style.width = '280px';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.width = '220px';
          }}
        />
      </div>

      {/* Time */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
          {formatTime(time)}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(time)}</span>
      </div>

      {/* Bell */}
      <button style={{
        width: '38px', height: '38px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.2s',
        position: 'relative',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.color = 'var(--accent-cyan)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        <Bell size={16} />
        <div style={{
          position: 'absolute', top: '6px', right: '6px',
          width: '7px', height: '7px',
          background: 'var(--accent-red)',
          borderRadius: '50%',
          border: '1.5px solid var(--bg-primary)',
        }} />
      </button>

      {/* Avatar */}
      <div style={{
        width: '36px', height: '36px',
        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 0 12px rgba(0,212,255,0.2)',
      }}>
        U
      </div>
    </header>
  );
}
