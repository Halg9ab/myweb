import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Trash2, Edit2, TrendingUp } from 'lucide-react';

const EMOJIS = ['✈️','💻','🛡️','🏠','🎓','🚗','📱','⌚','🎮','🏖️','💰','🌍','🎯','🏋️','📸'];
const COLORS = ['#00d4ff','#8b5cf6','#10b981','#f59e0b','#ec4899','#3b82f6','#f97316','#06b6d4'];

const blank = () => ({
  title: '', target: '', saved: '', deadline: '', category: 'savings',
  color: '#00d4ff', emoji: '💰', milestones: [],
});

export default function Goals() {
  const { state, dispatch } = useApp();
  const { goals } = state;
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(blank());
  const [depositModal, setDepositModal] = useState(null);
  const [depositAmt, setDepositAmt] = useState('');

  const save = () => {
    if (!form.title || !form.target) return;
    const payload = { ...form, target: parseFloat(form.target), saved: parseFloat(form.saved) || 0 };
    if (editId) {
      dispatch({ type: 'UPDATE_GOAL', payload: { ...payload, id: editId } });
    } else {
      dispatch({ type: 'ADD_GOAL', payload });
    }
    setShowModal(false);
    setForm(blank());
    setEditId(null);
  };

  const deposit = () => {
    if (!depositAmt || !depositModal) return;
    const goal = goals.find(g => g.id === depositModal);
    if (!goal) return;
    const newSaved = Math.min(goal.target, goal.saved + parseFloat(depositAmt));
    dispatch({ type: 'UPDATE_GOAL', payload: { ...goal, saved: newSaved } });
    setDepositModal(null);
    setDepositAmt('');
  };

  const openEdit = (goal) => {
    setForm({ ...goal, target: goal.target.toString(), saved: goal.saved.toString() });
    setEditId(goal.id);
    setShowModal(true);
  };

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const overallPct = totalTarget ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const daysUntil = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Savings & Goals</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{goals.length} active goals · ${totalSaved.toLocaleString()} saved</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(blank()); setEditId(null); setShowModal(true); }}>
          <Plus size={15} /> New Goal
        </button>
      </div>

      {/* Overall progress */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(139,92,246,0.06))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="url(#overallGrad)" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - overallPct / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <defs>
                <linearGradient id="overallGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700 }} className="gradient-text">{overallPct}%</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>OVERALL</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Total Progress</h2>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: 'var(--accent-cyan)' }}>${totalSaved.toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total saved</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: 'var(--accent-purple)' }}>${(totalTarget - totalSaved).toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Remaining</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: 'var(--accent-green)' }}>{goals.filter(g => g.saved >= g.target).length}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Goals achieved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals grid */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
          const remaining = goal.target - goal.saved;
          const days = daysUntil(goal.deadline);
          const achieved = goal.saved >= goal.target;

          return (
            <div key={goal.id} className="glass-card" style={{
              padding: '24px',
              borderTop: `3px solid ${goal.color}`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Background glow */}
              <div style={{
                position: 'absolute', top: '-30px', right: '-30px',
                width: '120px', height: '120px',
                background: `radial-gradient(circle, ${goal.color}15, transparent)`,
                borderRadius: '50%', pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: `${goal.color}18`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                  }}>{goal.emoji}</div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '2px' }}>{goal.title}</h3>
                    {days !== null && (
                      <span style={{
                        fontSize: '11px',
                        color: days < 0 ? 'var(--accent-red)' : days < 30 ? 'var(--accent-orange)' : 'var(--text-muted)',
                      }}>
                        {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d remaining`}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => openEdit(goal)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  ><Edit2 size={14} /></button>
                  <button onClick={() => dispatch({ type: 'DELETE_GOAL', payload: goal.id })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  ><Trash2 size={14} /></button>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: goal.color }}>
                    ${goal.saved.toLocaleString()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-muted)', alignSelf: 'flex-end' }}>
                    / ${goal.target.toLocaleString()}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: '8px', marginBottom: '6px' }}>
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: achieved
                      ? 'linear-gradient(90deg, var(--accent-green), #34d399)'
                      : `linear-gradient(90deg, ${goal.color}, ${goal.color}cc)`,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {pct > 30 && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 2s infinite',
                        backgroundSize: '200% 100%',
                      }} />
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{pct}% complete</span>
                  <span>{achieved ? '🎉 Goal reached!' : `$${remaining.toLocaleString()} left`}</span>
                </div>
              </div>

              {/* Deposit button */}
              {!achieved && (
                <button
                  onClick={() => setDepositModal(goal.id)}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', borderColor: `${goal.color}30`, color: goal.color }}
                >
                  <TrendingUp size={14} /> Add to Savings
                </button>
              )}
              {achieved && (
                <div style={{
                  padding: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: 'var(--accent-green)',
                }}>
                  🎉 Goal achieved! Congratulations!
                </div>
              )}
            </div>
          );
        })}

        {/* Add goal card */}
        <button
          onClick={() => { setForm(blank()); setEditId(null); setShowModal(true); }}
          style={{
            padding: '24px', borderRadius: 'var(--radius-lg)',
            border: '2px dashed rgba(255,255,255,0.08)', background: 'transparent',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '12px',
            transition: 'all 0.2s', minHeight: '200px',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.background = 'rgba(0,212,255,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,212,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={22} color="var(--accent-cyan)" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>Create New Goal</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Track your savings journey</div>
          </div>
        </button>
      </div>

      {/* Add/Edit Goal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editId ? 'Edit Goal' : 'New Goal'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Emoji picker */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Choose Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {EMOJIS.map(em => (
                    <button key={em} onClick={() => setForm({ ...form, emoji: em })} style={{
                      width: '36px', height: '36px', borderRadius: '8px', border: `1px solid ${form.emoji === em ? 'var(--accent-cyan)' : 'var(--border)'}`,
                      background: form.emoji === em ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer', fontSize: '18px',
                    }}>{em}</button>
                  ))}
                </div>
              </div>
              <input className="input-field" placeholder="Goal name *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <div className="grid-2">
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Target Amount *</label>
                  <input className="input-field" type="number" placeholder="0.00" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Already Saved</label>
                  <input className="input-field" type="number" placeholder="0.00" value={form.saved} onChange={e => setForm({ ...form, saved: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Deadline</label>
                <input className="input-field" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })} style={{
                      width: '28px', height: '28px', borderRadius: '50%', background: c, border: `2px solid ${form.color === c ? '#fff' : 'transparent'}`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>{editId ? 'Update Goal' : 'Create Goal'}</button>
                {editId && <button className="btn btn-danger" onClick={() => { dispatch({ type: 'DELETE_GOAL', payload: editId }); setShowModal(false); }}>Delete</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setDepositModal(null); }}>
          <div className="modal-content" style={{ maxWidth: '360px' }}>
            <div className="modal-header">
              <h2>Add to Savings</h2>
              <button onClick={() => setDepositModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Adding to: <strong>{goals.find(g => g.id === depositModal)?.title}</strong>
              </p>
              <input className="input-field" type="number" placeholder="Amount to add" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: '20px' }} autoFocus />
              <button className="btn btn-primary" onClick={deposit}>Confirm Deposit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
