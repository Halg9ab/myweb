import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Check, Trash2, Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  { value: 'university', label: 'University', color: '#3b82f6', emoji: '🎓' },
  { value: 'work', label: 'Work', color: '#10b981', emoji: '💼' },
  { value: 'personal', label: 'Personal', color: '#ec4899', emoji: '✨' },
  { value: 'fitness', label: 'Fitness', color: '#f59e0b', emoji: '💪' },
  { value: 'future', label: 'Future Plans', color: '#8b5cf6', emoji: '🚀' },
];

const PRIORITIES = [
  { value: 'high', label: 'High', color: 'var(--accent-red)' },
  { value: 'medium', label: 'Medium', color: 'var(--accent-orange)' },
  { value: 'low', label: 'Low', color: 'var(--accent-green)' },
];

const blank = () => ({
  title: '', category: 'personal', priority: 'medium',
  deadline: '', description: '', completed: false,
});

export default function Tasks() {
  const { state, dispatch } = useApp();
  const { tasks } = state;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blank());
  const [editId, setEditId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [expandedId, setExpandedId] = useState(null);

  const save = () => {
    if (!form.title.trim()) return;
    if (editId) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...form, id: editId } });
    } else {
      dispatch({ type: 'ADD_TASK', payload: form });
    }
    setShowModal(false);
    setForm(blank());
    setEditId(null);
  };

  const openEdit = (task) => {
    setForm({ ...task });
    setEditId(task.id);
    setShowModal(true);
  };

  const filtered = useMemo(() => {
    let result = activeCategory === 'all' ? [...tasks] : tasks.filter(t => t.category === activeCategory);
    if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === 'deadline') {
      result.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (sortBy === 'status') {
      result.sort((a, b) => a.completed - b.completed);
    }
    return result;
  }, [tasks, activeCategory, sortBy]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [tasks]);

  const priorityColor = (p) => PRIORITIES.find(x => x.value === p)?.color || 'var(--text-muted)';
  const catColor = (c) => CATEGORIES.find(x => x.value === c)?.color || 'var(--text-muted)';
  const catEmoji = (c) => CATEGORIES.find(x => x.value === c)?.emoji || '•';

  const isOverdue = (task) => task.deadline && !task.completed && new Date(task.deadline) < new Date();

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Tasks & Productivity</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{stats.done}/{stats.total} tasks done · {stats.pct}% complete</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="input-field" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto' }}>
            <option value="deadline">Sort by deadline</option>
            <option value="priority">Sort by priority</option>
            <option value="status">Sort by status</option>
          </select>
          <button className="btn btn-primary" onClick={() => { setForm(blank()); setEditId(null); setShowModal(true); }}>
            <Plus size={15} /> Add Task
          </button>
        </div>
      </div>

      {/* Category overview */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[{ value: 'all', label: 'All Tasks', emoji: '📋', color: 'var(--accent-cyan)' }, ...CATEGORIES].map(cat => {
          const catTasks = cat.value === 'all' ? tasks : tasks.filter(t => t.category === cat.value);
          const done = catTasks.filter(t => t.completed).length;
          const pct = catTasks.length ? Math.round((done / catTasks.length) * 100) : 0;
          const isActive = activeCategory === cat.value;
          return (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)} style={{
              padding: '16px', borderRadius: 'var(--radius-lg)', border: `1px solid ${isActive ? (cat.color || 'var(--accent-cyan)') : 'var(--border)'}`,
              background: isActive ? `${cat.color || 'var(--accent-cyan)'}12` : 'rgba(255,255,255,0.02)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'var(--font-main)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '18px' }}>{cat.emoji}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: isActive ? cat.color : 'var(--text-secondary)' }}>{cat.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: isActive ? (cat.color || 'var(--accent-cyan)') : 'var(--text-primary)', marginBottom: '6px' }}>
                {done}/{catTasks.length}
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: cat.color || 'var(--accent-cyan)' }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <Check size={32} />
              <h3>No tasks here</h3>
              <p>Add a new task to get started</p>
            </div>
          ) : filtered.map(task => {
            const overdue = isOverdue(task);
            const isExpanded = expandedId === task.id;
            return (
              <div key={task.id} style={{
                borderRadius: '10px', border: `1px solid ${overdue ? 'rgba(239,68,68,0.3)' : task.completed ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                background: task.completed ? 'rgba(16,185,129,0.04)' : overdue ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)',
                overflow: 'hidden', transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px' }}>
                  {/* Checkbox */}
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                    style={{
                      width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, cursor: 'pointer',
                      border: `1.5px solid ${task.completed ? 'var(--accent-green)' : 'var(--border)'}`,
                      background: task.completed ? 'var(--accent-green)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                  >
                    {task.completed && <Check size={11} color="#fff" strokeWidth={3} />}
                  </button>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '14px', fontWeight: 500,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{task.title}</span>
                      <span style={{
                        fontSize: '10px', padding: '2px 8px', borderRadius: '100px',
                        background: `${catColor(task.category)}18`, color: catColor(task.category),
                        fontWeight: 600, letterSpacing: '0.3px', flexShrink: 0,
                      }}>{catEmoji(task.category)} {task.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                      {task.deadline && (
                        <span style={{ fontSize: '11px', color: overdue ? 'var(--accent-red)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={10} /> {task.deadline} {overdue && '· OVERDUE'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Priority */}
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: priorityColor(task.priority), boxShadow: `0 0 6px ${priorityColor(task.priority)}` }} />

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => setExpandedId(isExpanded ? null : task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button onClick={() => openEdit(task)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Tag size={14} />
                    </button>
                    <button onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ padding: '0 14px 14px 46px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    {task.description ? (
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{task.description}</p>
                    ) : (
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No description added</p>
                    )}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>Priority: <span style={{ color: priorityColor(task.priority) }}>{task.priority}</span></span>
                      <span>Status: <span style={{ color: task.completed ? 'var(--accent-green)' : overdue ? 'var(--accent-red)' : 'var(--accent-orange)' }}>
                        {task.completed ? 'Completed' : overdue ? 'Overdue' : 'Pending'}
                      </span></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editId ? 'Edit Task' : 'Add Task'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input className="input-field" placeholder="Task title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea className="input-field" placeholder="Description (optional)" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
              <div className="grid-2">
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Priority</label>
                  <select className="input-field" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Deadline</label>
                <input className="input-field" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>{editId ? 'Update' : 'Add Task'}</button>
                {editId && <button className="btn btn-danger" onClick={() => { dispatch({ type: 'DELETE_TASK', payload: editId }); setShowModal(false); }}>Delete</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
