/* ── DATA STORE ── */
const CAT_COLORS = {
  food:'#f59e0b', transport:'#06b6d4', entertainment:'#f97316',
  clothes:'#ec4899', tech:'#3b82f6', subscriptions:'#8b5cf6',
  education:'#10b981', bills:'#ef4444', personal:'#a78bfa',
  savings:'#34d399', misc:'#94a3b8'
};
const CAT_EMOJI = {
  food:'🍔', transport:'🚗', entertainment:'🎬', clothes:'👗',
  tech:'💻', subscriptions:'📱', education:'📚', bills:'🧾',
  personal:'✨', savings:'💰', misc:'📦'
};
const EVT_COLORS = {
  university:'#3b82f6', work:'#10b981', personal:'#ec4899',
  fitness:'#f59e0b', social:'#8b5cf6', other:'#94a3b8'
};
const GOAL_COLORS = ['#00d4ff','#8b5cf6','#10b981','#f59e0b','#ec4899','#3b82f6','#f97316'];

const DEFAULT_STATE = {
  tasks: [
    {id:1, title:'Review lecture notes', cat:'university', priority:'high', done:false, deadline:'2025-06-20', notes:''},
    {id:2, title:'Morning workout', cat:'fitness', priority:'medium', done:true, deadline:'', notes:''},
    {id:3, title:'Submit CS101 assignment', cat:'university', priority:'high', done:false, deadline:'2025-06-15', notes:'Upload to portal'},
    {id:4, title:'Call doctor', cat:'personal', priority:'low', done:false, deadline:'2025-06-18', notes:''},
  ],
  expenses: [
    {id:1, amount:45.50, cat:'food', desc:'Weekly groceries', date:'2025-06-01', notes:''},
    {id:2, amount:12.99, cat:'subscriptions', desc:'Spotify Premium', date:'2025-06-02', notes:'Monthly'},
    {id:3, amount:89.00, cat:'clothes', desc:'New shirt', date:'2025-06-03', notes:''},
    {id:4, amount:35.00, cat:'transport', desc:'Taxi rides', date:'2025-06-04', notes:''},
    {id:5, amount:150.00, cat:'bills', desc:'Electric bill', date:'2025-05-15', notes:''},
    {id:6, amount:25.00, cat:'education', desc:'Udemy course', date:'2025-05-20', notes:''},
  ],
  events: [
    {id:1, title:'Final Exam – CS101', date:'2025-06-20', time:'09:00', cat:'university', done:false, notes:'Room 204'},
    {id:2, title:'Team standup', date:'2025-06-11', time:'10:00', cat:'work', done:false, notes:'Zoom link in email'},
    {id:3, title:'Gym session', date:'2025-06-10', time:'07:00', cat:'fitness', done:false, notes:''},
  ],
  goals: [
    {id:1, title:'Trip to Japan', target:5000, saved:1850, deadline:'2025-12-01', emoji:'✈️', color:'#00d4ff'},
    {id:2, title:'New Laptop', target:2000, saved:900, deadline:'2025-09-01', emoji:'💻', color:'#8b5cf6'},
    {id:3, title:'Emergency Fund', target:3000, saved:2100, deadline:'2025-08-01', emoji:'🛡️', color:'#10b981'},
  ],
  nextId: 200
};

function loadState() {
  try {
    const raw = localStorage.getItem('myweb_v3');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
function saveState() {
  localStorage.setItem('myweb_v3', JSON.stringify(window.APP));
}
window.APP = loadState();

/* ── UTILITIES ── */
function uid() { return ++window.APP.nextId; }

function today() { return new Date().toISOString().split('T')[0]; }

function fmt(amount) { return '$' + parseFloat(amount).toFixed(2); }

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  return diff;
}

function el(id) { return document.getElementById(id); }

function openModal(id) {
  const m = el(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = el(id);
  if (m) m.classList.remove('open');
}

/* ── CLOCK ── */
function startClock() {
  const clockEl = el('clock');
  if (!clockEl) return;
  function tick() {
    const n = new Date();
    const h = String(n.getHours()).padStart(2,'0');
    const m = String(n.getMinutes()).padStart(2,'0');
    const s = String(n.getSeconds()).padStart(2,'0');
    clockEl.textContent = h + ':' + m + ':' + s;
  }
  tick();
  setInterval(tick, 1000);
}

/* ── SIDEBAR MOBILE ── */
function initSidebar() {
  const hamburger = el('hamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = el('sidebar-overlay');
  if (!hamburger || !sidebar) return;
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  if (overlay) overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
}

/* ── ACTIVE NAV LINK ── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === page);
  });
}

/* ── MODAL CLICK-OUTSIDE ── */
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) m.classList.remove('open');
    });
  });
}

/* ── SHARED INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  initSidebar();
  setActiveNav();
  initModals();
});
