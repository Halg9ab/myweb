import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  activeSection: 'dashboard',
  sidebarCollapsed: false,
  tasks: [
    { id: 1, title: 'Review lecture notes', category: 'university', priority: 'high', completed: false, deadline: '2025-06-10', description: 'Review Chapter 5 notes' },
    { id: 2, title: 'Gym session', category: 'fitness', priority: 'medium', completed: true, deadline: '2025-06-08', description: '1hr cardio + weights' },
    { id: 3, title: 'Submit assignment', category: 'university', priority: 'high', completed: false, deadline: '2025-06-12', description: 'CS101 assignment' },
  ],
  expenses: [
    { id: 1, amount: 45.5, category: 'food', description: 'Grocery shopping', date: '2025-06-01', notes: '' },
    { id: 2, amount: 12.99, category: 'subscriptions', description: 'Spotify', date: '2025-06-02', notes: 'Monthly' },
    { id: 3, amount: 89.0, category: 'clothes', description: 'New shirt', date: '2025-06-03', notes: '' },
    { id: 4, amount: 200.0, category: 'tech', description: 'USB-C hub', date: '2025-05-28', notes: 'For laptop' },
    { id: 5, amount: 35.0, category: 'transport', description: 'Taxi rides', date: '2025-05-25', notes: '' },
    { id: 6, amount: 60.0, category: 'entertainment', description: 'Cinema + dinner', date: '2025-05-20', notes: '' },
    { id: 7, amount: 150.0, category: 'bills', description: 'Electric bill', date: '2025-05-15', notes: '' },
    { id: 8, amount: 25.0, category: 'education', description: 'Udemy course', date: '2025-06-04', notes: '' },
  ],
  goals: [
    { id: 1, title: 'Trip to Japan', target: 5000, saved: 1850, deadline: '2025-12-01', category: 'travel', color: '#00d4ff', emoji: '✈️' },
    { id: 2, title: 'New MacBook', target: 2000, saved: 900, deadline: '2025-09-01', category: 'tech', color: '#8b5cf6', emoji: '💻' },
    { id: 3, title: 'Emergency Fund', target: 3000, saved: 2100, deadline: '2025-08-01', category: 'savings', color: '#10b981', emoji: '🛡️' },
  ],
  events: [
    { id: 1, title: 'Final Exam - CS101', date: '2025-06-15', time: '09:00', category: 'university', color: '#3b82f6', completed: false, recurring: false, notes: 'Room 204' },
    { id: 2, title: 'Team Meeting', date: '2025-06-10', time: '14:00', category: 'work', color: '#10b981', completed: false, recurring: true, notes: 'Zoom link in email' },
    { id: 3, title: 'Gym', date: '2025-06-09', time: '07:00', category: 'fitness', color: '#f59e0b', completed: false, recurring: true, notes: 'Bring water bottle' },
  ],
  budget: {
    monthly: 2000,
    categories: {
      food: 400, clothes: 150, tech: 100, subscriptions: 50,
      transport: 100, entertainment: 150, education: 100,
      personal: 100, savings: 500, bills: 200, misc: 150
    }
  },
  theme: 'dark',
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_SECTION':
      return { ...state, activeSection: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t) };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, { ...action.payload, id: Date.now() }] };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_GOAL':
      return { ...state, goals: state.goals.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g) };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_EVENT':
      return { ...state, events: state.events.map(e => e.id === action.payload.id ? { ...e, ...action.payload } : e) };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(e => e.id !== action.payload) };
    case 'TOGGLE_EVENT':
      return { ...state, events: state.events.map(e => e.id === action.payload ? { ...e, completed: !e.completed } : e) };
    case 'UPDATE_BUDGET':
      return { ...state, budget: { ...state.budget, ...action.payload } };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('myweb-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed };
      }
    } catch {}
    return init;
  });

  useEffect(() => {
    const toSave = { tasks: state.tasks, expenses: state.expenses, goals: state.goals, events: state.events, budget: state.budget };
    localStorage.setItem('myweb-state', JSON.stringify(toSave));
  }, [state.tasks, state.expenses, state.goals, state.events, state.budget]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
