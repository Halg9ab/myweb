import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, ChevronLeft, ChevronRight, X, Check, Repeat } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';

const CATEGORIES = [
  { value: 'university', label: 'University', color: '#3b82f6' },
  { value: 'work', label: 'Work', color: '#10b981' },
  { value: 'personal', label: 'Personal', color: '#ec4899' },
  { value: 'fitness', label: 'Fitness', color: '#f59e0b' },
  { value: 'social', label: 'Social', color: '#8b5cf6' },
  { value: 'other', label: 'Other', color: '#94a3b8' },
];

const blank = () => ({
  title: '', date: format(new Date(), 'yyyy-MM-dd'), time: '09:00',
  category: 'personal', color: '#ec4899', recurring: false, notes: '', completed: false,
});

export default function CalendarPage() {
  const { state, dispatch } = useApp();
  const { events } = state;
  const [view, setView] = useState('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState(blank());
  const [selectedDay, setSelectedDay] = useState(null);

  const openAdd = (date) => {
    setForm({ ...blank(), date: date || format(new Date(), 'yyyy-MM-dd') });
    setEditEvent(null);
    setShowModal(true);
  };

  const openEdit = (ev) => {
    setForm({ ...ev });
    setEditEvent(ev.id);
    setShowModal(true);
  };

  const saveEvent = () => {
    if (!form.title.trim()) return;
    if (editEvent) {
      dispatch({ type: 'UPDATE_EVENT', payload: { ...form, id: editEvent } });
    } else {
      dispatch({ type: 'ADD_EVENT', payload: form });
    }
    setShowModal(false);
  };

  const deleteEvent = (id) => dispatch({ type: 'DELETE_EVENT', payload: id });
  const toggleEvent = (id) => dispatch({ type: 'TOGGLE_EVENT', payload: id });

  // Monthly grid
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const eventsOnDay = (day) =>
    events.filter(e => isSameDay(new Date(e.date), day));

  const navigate = (dir) => {
    if (view === 'monthly') setCurrentDate(dir > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    else setCurrentDate(dir > 0 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
  };

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const completedPct = events.length ? Math.round((events.filter(e => e.completed).length / events.length) * 100) : 0;

  return (
    <div className="page-container animate-fade-in">
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Smart Calendar</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{events.length} events · {completedPct}% completed</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="tab-bar" style={{ marginBottom: 0 }}>
            {['monthly', 'weekly', 'daily'].map(v => (
              <button key={v} className={`tab-item ${view === v ? 'active' : ''}`} onClick={() => setView(v)}
                style={{ textTransform: 'capitalize', padding: '7px 14px' }}>
                {v}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => openAdd()}>
            <Plus size={15} /> Add Event
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Calendar main */}
        <div className="glass-card" style={{ padding: '20px' }}>
          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button className="btn btn-ghost" style={{ padding: '8px 12px' }} onClick={() => navigate(-1)}>
              <ChevronLeft size={16} />
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>
              {view === 'monthly' ? format(currentDate, 'MMMM yyyy') :
               view === 'weekly' ? `Week of ${format(weekDays[0], 'MMM d')}` :
               format(currentDate, 'EEEE, MMM d yyyy')}
            </h2>
            <button className="btn btn-ghost" style={{ padding: '8px 12px' }} onClick={() => navigate(1)}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Monthly view */}
          {view === 'monthly' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', padding: '6px 0', letterSpacing: '0.5px' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {monthDays.map((day, i) => {
                  const dayEvents = eventsOnDay(day);
                  const isToday = isSameDay(day, new Date());
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  return (
                    <div key={i}
                      onClick={() => { setSelectedDay(day); openAdd(format(day, 'yyyy-MM-dd')); }}
                      style={{
                        minHeight: '80px', padding: '8px 6px',
                        borderRadius: '8px',
                        border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'transparent'}`,
                        background: isToday ? 'rgba(0,212,255,0.07)' : isSelected ? 'rgba(0,212,255,0.04)' : 'rgba(255,255,255,0.01)',
                        cursor: 'pointer',
                        opacity: isCurrentMonth ? 1 : 0.35,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isToday ? 'rgba(0,212,255,0.07)' : 'rgba(255,255,255,0.01)'; }}
                    >
                      <div style={{
                        fontSize: '13px', fontWeight: isToday ? 700 : 400, marginBottom: '4px',
                        color: isToday ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        width: '22px', height: '22px',
                        background: isToday ? 'rgba(0,212,255,0.15)' : 'transparent',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {format(day, 'd')}
                      </div>
                      {dayEvents.slice(0, 2).map(ev => (
                        <div key={ev.id} onClick={e => { e.stopPropagation(); openEdit(ev); }}
                          style={{
                            fontSize: '10px', padding: '2px 5px', borderRadius: '4px',
                            background: `${ev.color}22`, border: `1px solid ${ev.color}44`,
                            color: ev.color, marginBottom: '2px',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            textDecoration: ev.completed ? 'line-through' : 'none',
                          }}>
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+{dayEvents.length - 2}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Weekly view */}
          {view === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {weekDays.map((day, i) => {
                const dayEvents = eventsOnDay(day);
                const isToday = isSameDay(day, new Date());
                return (
                  <div key={i} style={{
                    minHeight: '300px', padding: '12px 8px',
                    background: isToday ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                    borderRadius: '10px',
                    border: `1px solid ${isToday ? 'rgba(0,212,255,0.2)' : 'var(--border)'}`,
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{format(day, 'EEE')}</div>
                      <div style={{
                        fontSize: '18px', fontWeight: 700, marginTop: '2px',
                        color: isToday ? 'var(--accent-cyan)' : 'var(--text-primary)',
                      }}>{format(day, 'd')}</div>
                    </div>
                    {dayEvents.map(ev => (
                      <div key={ev.id} onClick={() => openEdit(ev)} style={{
                        padding: '6px 8px', borderRadius: '6px', marginBottom: '6px',
                        background: `${ev.color}15`, border: `1px solid ${ev.color}30`,
                        cursor: 'pointer', fontSize: '11px',
                      }}>
                        <div style={{ color: ev.color, fontWeight: 600, marginBottom: '2px' }}>{ev.time}</div>
                        <div style={{ color: 'var(--text-secondary)', textDecoration: ev.completed ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                      </div>
                    ))}
                    <button onClick={() => openAdd(format(day, 'yyyy-MM-dd'))} style={{
                      width: '100%', padding: '4px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)',
                      borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px',
                    }}>+</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Daily view */}
          {view === 'daily' && (
            <div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(); d.setDate(d.getDate() + i - 3);
                  const isToday = isSameDay(d, currentDate);
                  return (
                    <button key={i} onClick={() => setCurrentDate(new Date(d))} style={{
                      flexShrink: 0, padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
                      background: isToday ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(59,130,246,0.2))' : 'rgba(255,255,255,0.04)',
                      color: isToday ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-main)', fontSize: '13px',
                      border: `1px solid ${isToday ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                    }}>
                      <div style={{ fontWeight: 600 }}>{format(d, 'EEE')}</div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>{format(d, 'd')}</div>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: 24 }, (_, h) => {
                  const timeStr = `${h.toString().padStart(2, '0')}:00`;
                  const hourEvents = events.filter(e => isSameDay(new Date(e.date), currentDate) && e.time.startsWith(h.toString().padStart(2, '0')));
                  if (hourEvents.length === 0 && h < 7) return null;
                  return (
                    <div key={h} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', width: '40px', flexShrink: 0, paddingTop: '2px', fontFamily: 'var(--font-mono)' }}>
                        {timeStr}
                      </div>
                      <div style={{ flex: 1, borderTop: '1px solid var(--border)', paddingTop: '6px', minHeight: '30px', position: 'relative' }}>
                        {hourEvents.map(ev => (
                          <div key={ev.id} onClick={() => openEdit(ev)} style={{
                            padding: '8px 12px', borderRadius: '8px', marginBottom: '4px',
                            background: `${ev.color}15`, border: `1px solid ${ev.color}30`, cursor: 'pointer',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 600, fontSize: '13px' }}>{ev.title}</span>
                              {ev.recurring && <Repeat size={12} color="var(--text-muted)" />}
                              {ev.completed && <Check size={12} color="var(--accent-green)" />}
                            </div>
                            {ev.notes && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{ev.notes}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: upcoming + category legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category legend */}
          <div className="glass-card" style={{ padding: '18px' }}>
            <div className="section-title" style={{ marginBottom: '12px', fontSize: '13px' }}>Categories</div>
            {CATEGORIES.map(cat => (
              <div key={cat.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: cat.color, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{cat.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {events.filter(e => e.category === cat.value).length}
                </span>
              </div>
            ))}
          </div>

          {/* Upcoming events */}
          <div className="glass-card" style={{ padding: '18px', flex: 1 }}>
            <div className="section-title" style={{ fontSize: '13px' }}>
              Upcoming
              <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '12px', marginLeft: 'auto' }} onClick={() => openAdd()}>
                <Plus size={12} /> Add
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {events.filter(e => !e.completed).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8).map(ev => (
                <div key={ev.id} style={{
                  display: 'flex', gap: '10px', padding: '10px 12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px', border: '1px solid var(--border)',
                  borderLeft: `3px solid ${ev.color}`,
                  cursor: 'pointer',
                }} onClick={() => openEdit(ev)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{ev.date} · {ev.time}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleEvent(ev.id); }} style={{
                    background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0,
                  }}>
                    <Check size={14} />
                  </button>
                </div>
              ))}
              {events.filter(e => !e.completed).length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editEvent ? 'Edit Event' : 'Add Event'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input className="input-field" placeholder="Event title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <div className="grid-2">
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Date</label>
                  <input className="input-field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Time</label>
                  <input className="input-field" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Category</label>
                <select className="input-field" value={form.category} onChange={e => {
                  const cat = CATEGORIES.find(c => c.value === e.target.value);
                  setForm({ ...form, category: e.target.value, color: cat?.color || form.color });
                }}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <textarea className="input-field" placeholder="Notes (optional)" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <div className={`checkbox-custom ${form.recurring ? 'checked' : ''}`} onClick={() => setForm({ ...form, recurring: !form.recurring })}>
                  {form.recurring && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                Recurring event
              </label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveEvent}>
                  {editEvent ? 'Update Event' : 'Add Event'}
                </button>
                {editEvent && (
                  <button className="btn btn-danger" onClick={() => { deleteEvent(editEvent); setShowModal(false); }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
