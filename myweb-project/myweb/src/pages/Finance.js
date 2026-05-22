import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Trash2, X, Filter, TrendingDown, DollarSign } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line
} from 'recharts';

const CATEGORIES = [
  { value: 'food', label: 'Food', color: '#f59e0b', emoji: '🍔' },
  { value: 'clothes', label: 'Clothes', color: '#ec4899', emoji: '👗' },
  { value: 'tech', label: 'Tech', color: '#3b82f6', emoji: '💻' },
  { value: 'subscriptions', label: 'Subscriptions', color: '#8b5cf6', emoji: '📱' },
  { value: 'transport', label: 'Transport', color: '#06b6d4', emoji: '🚗' },
  { value: 'entertainment', label: 'Entertainment', color: '#f97316', emoji: '🎬' },
  { value: 'education', label: 'Education', color: '#10b981', emoji: '📚' },
  { value: 'personal', label: 'Personal', color: '#a78bfa', emoji: '✨' },
  { value: 'savings', label: 'Savings', color: '#34d399', emoji: '💰' },
  { value: 'bills', label: 'Bills', color: '#ef4444', emoji: '🧾' },
  { value: 'misc', label: 'Miscellaneous', color: '#94a3b8', emoji: '📦' },
];

const blank = () => ({ amount: '', category: 'food', description: '', date: new Date().toISOString().split('T')[0], notes: '' });

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(10,15,30,0.95)', border: '1px solid var(--border-accent)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{payload[0].name}</p>
        <p style={{ color: payload[0].fill || payload[0].color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${Number(payload[0].value).toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function Finance() {
  const { state, dispatch } = useApp();
  const { expenses, budget } = state;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blank());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [activeChart, setActiveChart] = useState('pie');

  const saveExpense = () => {
    if (!form.amount || !form.description) return;
    dispatch({ type: 'ADD_EXPENSE', payload: { ...form, amount: parseFloat(form.amount) } });
    setForm(blank());
    setShowModal(false);
  };

  const filtered = useMemo(() => {
    let result = [...expenses];
    if (searchTerm) result = result.filter(e => e.description.toLowerCase().includes(searchTerm.toLowerCase()) || e.category.includes(searchTerm.toLowerCase()));
    if (filterCat !== 'all') result = result.filter(e => e.category === filterCat);
    if (filterPeriod !== 'all') {
      const now = new Date();
      result = result.filter(e => {
        const d = new Date(e.date);
        if (filterPeriod === 'week') return (now - d) / (1000 * 60 * 60 * 24) <= 7;
        if (filterPeriod === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (filterPeriod === 'year') return d.getFullYear() === now.getFullYear();
        return true;
      });
    }
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, searchTerm, filterCat, filterPeriod]);

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const pieData = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).map(([key, value]) => ({
      name: CATEGORIES.find(c => c.value === key)?.label || key,
      value: Math.round(value * 100) / 100,
      color: CATEGORIES.find(c => c.value === key)?.color || '#94a3b8',
    })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const barData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.slice(0, 6).map((m, i) => ({
      month: m,
      spent: Math.round(300 + (i * 40) + Math.random() * 200),
      budget: budget.monthly,
    }));
  }, [budget]);

  const catColors = Object.fromEntries(CATEGORIES.map(c => [c.value, c.color]));

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Finance Tracker</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{expenses.length} transactions · Total: ${total.toFixed(2)}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Log Expense
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Spent', value: `$${expenses.reduce((s,e)=>s+e.amount,0).toFixed(0)}`, color: 'var(--accent-red)', icon: TrendingDown },
          { label: 'Monthly Budget', value: `$${budget.monthly}`, color: 'var(--accent-blue)', icon: DollarSign },
          { label: 'Largest Category', value: pieData[0]?.name || '-', color: 'var(--accent-orange)', icon: Filter },
          { label: 'Transactions', value: expenses.length, color: 'var(--accent-cyan)', icon: Filter },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '18px', borderTop: `2px solid ${s.color}` }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: s.color, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Pie chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">Spending by Category</div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.slice(0, 6).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>{item.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: item.color }}>${item.value.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="section-title">Monthly Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="spent" fill="var(--accent-cyan)" radius={[4,4,0,0]} opacity={0.9} name="Spent" />
              <Bar dataKey="budget" fill="rgba(139,92,246,0.4)" radius={[4,4,0,0]} name="Budget" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input-field" placeholder="Search expenses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '32px' }} />
          </div>
          <select className="input-field" value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ width: 'auto', minWidth: '150px' }}>
            <option value="all">All categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
          </select>
          <select className="input-field" value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} style={{ width: 'auto', minWidth: '140px' }}>
            <option value="all">All time</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
          </select>
        </div>

        {/* Expense list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <DollarSign size={32} />
              <h3>No expenses found</h3>
              <p>Try adjusting your filters or log a new expense</p>
            </div>
          ) : filtered.map(exp => {
            const cat = CATEGORIES.find(c => c.value === exp.category);
            return (
              <div key={exp.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 14px', background: 'rgba(255,255,255,0.02)',
                borderRadius: '10px', border: '1px solid var(--border)',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: `${cat?.color || '#94a3b8'}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', flexShrink: 0,
                }}>
                  {cat?.emoji || '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span style={{ color: cat?.color || 'var(--text-muted)', textTransform: 'capitalize' }}>{cat?.label}</span>
                    {' · '}{exp.date}
                    {exp.notes && ` · ${exp.notes}`}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, color: 'var(--accent-red)', flexShrink: 0 }}>
                  -${exp.amount.toFixed(2)}
                </span>
                <button onClick={() => dispatch({ type: 'DELETE_EXPENSE', payload: exp.id })} style={{
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px',
                  borderRadius: '6px', transition: 'color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget tracker */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div className="section-title">Budget by Category</div>
        <div className="grid-3">
          {CATEGORIES.slice(0, 9).map(cat => {
            const spent = expenses.filter(e => e.category === cat.value).reduce((s, e) => s + e.amount, 0);
            const budgeted = budget.categories[cat.value] || 0;
            const pct = budgeted ? Math.min(100, Math.round((spent / budgeted) * 100)) : 0;
            const over = spent > budgeted && budgeted > 0;
            return (
              <div key={cat.value} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '16px' }}>{cat.emoji}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{cat.label}</span>
                  {over && <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--accent-red)', background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '4px' }}>OVER</span>}
                </div>
                <div className="progress-bar" style={{ marginBottom: '6px' }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: over ? 'var(--accent-red)' : cat.color }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <span style={{ color: over ? 'var(--accent-red)' : cat.color }}>${spent.toFixed(0)}</span>
                  <span>${budgeted}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Log Expense</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Amount *</label>
                <input className="input-field" type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ fontFamily: 'var(--font-mono)', fontSize: '20px' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Description *</label>
                <input className="input-field" placeholder="What did you spend on?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid-2">
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Date</label>
                  <input className="input-field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Notes</label>
                <input className="input-field" placeholder="Optional notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <button className="btn btn-primary" onClick={saveExpense} style={{ marginTop: '8px' }}>
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
