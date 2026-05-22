import { useMemo, useState } from 'react';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BadgeDollarSign,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  GripVertical,
  LayoutDashboard,
  ListChecks,
  Moon,
  Palette,
  PiggyBank,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Target,
  Trash2,
  WalletCards,
} from 'lucide-react';

const categories = ['Food', 'Clothes', 'Tech', 'Subscriptions', 'Transport', 'Entertainment', 'Education', 'Personal', 'Savings', 'Bills', 'Miscellaneous'];
const taskGroups = ['University', 'Work', 'Personal', 'Fitness', 'Future Plans'];
const palette = ['#22d3ee', '#a78bfa', '#34d399', '#f472b6', '#fbbf24', '#60a5fa', '#fb7185', '#2dd4bf', '#c084fc', '#f97316', '#94a3b8'];

const initialEvents = [
  { id: 1, title: 'AI systems lecture', date: '2026-05-23', time: '10:00', category: 'Education', complete: false, notes: 'Bring project outline', recurring: 'Weekly' },
  { id: 2, title: 'Budget review', date: '2026-05-24', time: '18:30', category: 'Bills', complete: false, notes: 'Check subscriptions', recurring: 'Monthly' },
  { id: 3, title: 'Gym reset', date: '2026-05-25', time: '07:30', category: 'Fitness', complete: true, notes: 'Upper body session', recurring: 'Daily' },
];

const initialExpenses = [
  { id: 1, item: 'Groceries', amount: 46, date: '2026-05-19', category: 'Food', notes: 'Weekly essentials' },
  { id: 2, item: 'Cloud storage', amount: 12, date: '2026-05-20', category: 'Subscriptions', notes: 'Monthly' },
  { id: 3, item: 'Metro card', amount: 28, date: '2026-05-21', category: 'Transport', notes: 'Commute' },
  { id: 4, item: 'Keyboard', amount: 95, date: '2026-05-22', category: 'Tech', notes: 'Workspace upgrade' },
];

const initialTasks = [
  { id: 1, title: 'Finish database assignment', group: 'University', due: '2026-05-27', priority: 'High', complete: false },
  { id: 2, title: 'Plan June reading list', group: 'Personal', due: '2026-05-30', priority: 'Medium', complete: true },
  { id: 3, title: 'Practice presentation', group: 'Work', due: '2026-05-25', priority: 'High', complete: false },
  { id: 4, title: 'Define 5-year goals', group: 'Future Plans', due: '2026-06-05', priority: 'Low', complete: false },
];

const initialGoals = [
  { id: 1, title: 'New phone fund', current: 680, target: 1200, deadline: '2026-08-15', color: '#22d3ee' },
  { id: 2, title: 'Travel fund', current: 1520, target: 3000, deadline: '2026-12-01', color: '#a78bfa' },
  { id: 3, title: 'Emergency savings', current: 4200, target: 6000, deadline: '2026-11-30', color: '#34d399' },
];

const baseWidgets = [
  'Overview',
  'Calendar',
  'Finance',
  'Tasks',
  'Goals',
  'Customize',
];

function uid() {
  return Math.floor(Date.now() + Math.random() * 1000);
}

function App() {
  const [active, setActive] = useState('Overview');
  const [widgets, setWidgets] = useState(baseWidgets);
  const [layout, setLayout] = useState('expanded');
  const [accent, setAccent] = useState('#22d3ee');
  const [events, setEvents] = useState(initialEvents);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [tasks, setTasks] = useState(initialTasks);
  const [goals, setGoals] = useState(initialGoals);
  const [query, setQuery] = useState('');
  const [calendarView, setCalendarView] = useState('weekly');
  const [newExpense, setNewExpense] = useState({ item: '', amount: '', category: 'Food', notes: '' });
  const [newTask, setNewTask] = useState({ title: '', group: 'University', priority: 'Medium' });

  const totalSpend = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const completedTasks = tasks.filter((task) => task.complete).length;
  const productivity = Math.round((completedTasks / Math.max(tasks.length, 1)) * 100);
  const savingsTotal = goals.reduce((sum, goal) => sum + goal.current, 0);
  const goalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);

  const categorySpend = useMemo(() => categories
    .map((category, index) => ({
      name: category,
      value: expenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + Number(expense.amount), 0),
      color: palette[index],
    }))
    .filter((item) => item.value > 0), [expenses]);

  const weeklySpend = useMemo(() => expenses.map((expense) => ({
    name: expense.date.slice(5),
    amount: Number(expense.amount),
  })), [expenses]);

  const filteredExpenses = expenses.filter((expense) => `${expense.item} ${expense.category} ${expense.notes}`.toLowerCase().includes(query.toLowerCase()));

  function addExpense() {
    if (!newExpense.item || !newExpense.amount) return;
    setExpenses([{ id: uid(), date: new Date().toISOString().slice(0, 10), ...newExpense, amount: Number(newExpense.amount) }, ...expenses]);
    setNewExpense({ item: '', amount: '', category: 'Food', notes: '' });
  }

  function addTask() {
    if (!newTask.title) return;
    setTasks([{ id: uid(), due: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10), complete: false, ...newTask }, ...tasks]);
    setNewTask({ title: '', group: 'University', priority: 'Medium' });
  }

  function addEvent() {
    setEvents([{ id: uid(), title: 'Custom focus block', date: new Date().toISOString().slice(0, 10), time: '16:00', category: 'Personal', complete: false, notes: 'New note', recurring: 'None' }, ...events]);
  }

  function addGoal() {
    setGoals([{ id: uid(), title: 'Personal project', current: 250, target: 1000, deadline: '2026-10-01', color: accent }, ...goals]);
  }

  const statCards = [
    { label: 'Today focus', value: `${productivity}%`, detail: `${completedTasks}/${tasks.length} tasks complete`, icon: ListChecks },
    { label: 'Monthly spend', value: `$${totalSpend}`, detail: `${expenses.length} logged expenses`, icon: WalletCards },
    { label: 'Savings', value: `$${savingsTotal}`, detail: `${Math.round((savingsTotal / goalTarget) * 100)}% across goals`, icon: PiggyBank },
    { label: 'Upcoming', value: events.filter((event) => !event.complete).length, detail: 'active reminders', icon: CalendarDays },
  ];

  return (
    <main className="app" style={{ '--accent': accent }}>
      <div className="aurora one" />
      <div className="aurora two" />
      <aside className="sidebar">
        <div className="brand">
          <span className="brandMark"><Sparkles size={20} /></span>
          <div>
            <strong>My Web OS</strong>
            <small>Productivity command center</small>
          </div>
        </div>
        <nav>
          {widgets.map((item) => {
            const Icon = item === 'Overview' ? LayoutDashboard : item === 'Calendar' ? CalendarDays : item === 'Finance' ? CircleDollarSign : item === 'Tasks' ? ListChecks : item === 'Goals' ? Target : Settings2;
            return (
              <button key={item} className={active === item ? 'navItem active' : 'navItem'} onClick={() => setActive(item)}>
                <Icon size={18} />
                <span>{item}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebarPanel">
          <Moon size={17} />
          <span>Dark neural mode</span>
          <b>Live</b>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Friday, May 22, 2026</p>
            <h1>{active === 'Overview' ? 'Personal operating system' : active}</h1>
          </div>
          <div className="actions">
            <button className="iconButton" title="Notifications"><Bell size={18} /></button>
            <button className="iconButton" title="Theme"><Palette size={18} /></button>
            <button className="primaryButton" onClick={() => setActive('Customize')}><Plus size={17} /> Customize</button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={layout === 'compact' ? 'content compact' : 'content'}
          >
            {active === 'Overview' && (
              <>
                <section className="statsGrid">
                  {statCards.map(({ label, value, detail, icon: Icon }) => (
                    <article className="glass stat" key={label}>
                      <span className="iconGlow"><Icon size={21} /></span>
                      <p>{label}</p>
                      <h2>{value}</h2>
                      <small>{detail}</small>
                    </article>
                  ))}
                </section>
                <section className="mainGrid">
                  <FinancePanel categorySpend={categorySpend} weeklySpend={weeklySpend} totalSpend={totalSpend} />
                  <CalendarPanel events={events} setEvents={setEvents} calendarView={calendarView} setCalendarView={setCalendarView} addEvent={addEvent} />
                  <TasksPanel tasks={tasks} setTasks={setTasks} addTask={addTask} newTask={newTask} setNewTask={setNewTask} />
                  <GoalsPanel goals={goals} setGoals={setGoals} addGoal={addGoal} />
                </section>
              </>
            )}
            {active === 'Calendar' && <CalendarPanel events={events} setEvents={setEvents} calendarView={calendarView} setCalendarView={setCalendarView} addEvent={addEvent} full />}
            {active === 'Finance' && (
              <section className="mainGrid financeGrid">
                <FinancePanel categorySpend={categorySpend} weeklySpend={weeklySpend} totalSpend={totalSpend} full />
                <article className="glass panel">
                  <PanelTitle icon={BadgeDollarSign} title="Expense logger" action={<button className="smallButton" onClick={addExpense}><Plus size={15} /> Add</button>} />
                  <div className="formGrid">
                    <input value={newExpense.item} onChange={(event) => setNewExpense({ ...newExpense, item: event.target.value })} placeholder="Purchase name" />
                    <input value={newExpense.amount} onChange={(event) => setNewExpense({ ...newExpense, amount: event.target.value })} placeholder="Amount" type="number" />
                    <select value={newExpense.category} onChange={(event) => setNewExpense({ ...newExpense, category: event.target.value })}>
                      {categories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                    <input value={newExpense.notes} onChange={(event) => setNewExpense({ ...newExpense, notes: event.target.value })} placeholder="Notes" />
                  </div>
                  <div className="searchBox"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search expenses" /></div>
                  <ExpenseTimeline expenses={filteredExpenses} setExpenses={setExpenses} />
                </article>
              </section>
            )}
            {active === 'Tasks' && <TasksPanel tasks={tasks} setTasks={setTasks} addTask={addTask} newTask={newTask} setNewTask={setNewTask} full />}
            {active === 'Goals' && <GoalsPanel goals={goals} setGoals={setGoals} addGoal={addGoal} full />}
            {active === 'Customize' && <CustomizePanel widgets={widgets} setWidgets={setWidgets} layout={layout} setLayout={setLayout} accent={accent} setAccent={setAccent} />}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}

function PanelTitle({ icon: Icon, title, action }) {
  return (
    <div className="panelTitle">
      <div><Icon size={18} /><h3>{title}</h3></div>
      {action}
    </div>
  );
}

function FinancePanel({ categorySpend, weeklySpend, totalSpend, full }) {
  return (
    <article className={full ? 'glass panel wide' : 'glass panel'}>
      <PanelTitle icon={WalletCards} title="Finance intelligence" action={<span className="pill">${totalSpend} total</span>} />
      <div className="chartSplit">
        <ResponsiveContainer width="100%" height={full ? 270 : 210}>
          <BarChart data={weeklySpend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip contentStyle={{ background: '#07111f', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="var(--accent)" />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={full ? 270 : 210}>
          <PieChart>
            <Pie data={categorySpend} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82} paddingAngle={4}>
              {categorySpend.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#07111f', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function CalendarPanel({ events, setEvents, calendarView, setCalendarView, addEvent, full }) {
  return (
    <article className={full ? 'glass panel wide' : 'glass panel'}>
      <PanelTitle icon={CalendarDays} title="Smart calendar" action={<button className="smallButton" onClick={addEvent}><Plus size={15} /> Event</button>} />
      <div className="segmented">
        {['daily', 'weekly', 'monthly'].map((view) => <button key={view} className={calendarView === view ? 'selected' : ''} onClick={() => setCalendarView(view)}>{view}</button>)}
      </div>
      <div className="eventList">
        {events.map((event) => (
          <motion.div layout className={event.complete ? 'event done' : 'event'} key={event.id}>
            <button className="checkButton" onClick={() => setEvents(events.map((item) => item.id === event.id ? { ...item, complete: !item.complete } : item))}>{event.complete && <Check size={14} />}</button>
            <div>
              <strong>{event.title}</strong>
              <small><Clock3 size={13} /> {event.date} at {event.time} · {event.recurring}</small>
              {full && <p>{event.notes}</p>}
            </div>
            <span>{event.category}</span>
          </motion.div>
        ))}
      </div>
    </article>
  );
}

function TasksPanel({ tasks, setTasks, addTask, newTask, setNewTask, full }) {
  const progressData = taskGroups.map((group) => {
    const groupTasks = tasks.filter((task) => task.group === group);
    return { name: group.split(' ')[0], progress: Math.round((groupTasks.filter((task) => task.complete).length / Math.max(groupTasks.length, 1)) * 100) };
  });
  return (
    <article className={full ? 'glass panel wide' : 'glass panel'}>
      <PanelTitle icon={ListChecks} title="Productivity engine" action={<button className="smallButton" onClick={addTask}><Plus size={15} /> Task</button>} />
      {full && (
        <div className="formGrid">
          <input value={newTask.title} onChange={(event) => setNewTask({ ...newTask, title: event.target.value })} placeholder="Task, lesson, exam, goal" />
          <select value={newTask.group} onChange={(event) => setNewTask({ ...newTask, group: event.target.value })}>{taskGroups.map((group) => <option key={group}>{group}</option>)}</select>
          <select value={newTask.priority} onChange={(event) => setNewTask({ ...newTask, priority: event.target.value })}>{['High', 'Medium', 'Low'].map((priority) => <option key={priority}>{priority}</option>)}</select>
        </div>
      )}
      <ResponsiveContainer width="100%" height={full ? 180 : 120}>
        <AreaChart data={progressData}>
          <defs>
            <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.65} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Area type="monotone" dataKey="progress" stroke="var(--accent)" fill="url(#taskGradient)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="taskList">
        {tasks.map((task) => (
          <motion.div layout className={task.complete ? 'task done' : 'task'} key={task.id}>
            <button className="checkButton" onClick={() => setTasks(tasks.map((item) => item.id === task.id ? { ...item, complete: !item.complete } : item))}>{task.complete && <Check size={14} />}</button>
            <div><strong>{task.title}</strong><small>{task.group} · {task.due}</small></div>
            <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
          </motion.div>
        ))}
      </div>
    </article>
  );
}

function GoalsPanel({ goals, setGoals, addGoal, full }) {
  return (
    <article className={full ? 'glass panel wide' : 'glass panel'}>
      <PanelTitle icon={PiggyBank} title="Savings and goals" action={<button className="smallButton" onClick={addGoal}><Plus size={15} /> Goal</button>} />
      <div className="goalList">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <div className="goal" key={goal.id}>
              <div><strong>{goal.title}</strong><small>${goal.current} of ${goal.target} · {goal.deadline}</small></div>
              <div className="progress"><span style={{ width: `${percent}%`, background: goal.color }} /></div>
              <b>{percent}%</b>
              {full && <input type="range" min="0" max={goal.target} value={goal.current} onChange={(event) => setGoals(goals.map((item) => item.id === goal.id ? { ...item, current: Number(event.target.value) } : item))} />}
            </div>
          );
        })}
      </div>
    </article>
  );
}

function ExpenseTimeline({ expenses, setExpenses }) {
  return (
    <div className="timeline">
      {expenses.map((expense) => (
        <div className="expenseRow" key={expense.id}>
          <span>{expense.category}</span>
          <div><strong>{expense.item}</strong><small>{expense.date} · {expense.notes || 'No notes'}</small></div>
          <b>${expense.amount}</b>
          <button className="iconButton mini" onClick={() => setExpenses((items) => items.filter((item) => item.id !== expense.id))} title="Remove"><Trash2 size={15} /></button>
        </div>
      ))}
    </div>
  );
}

function CustomizePanel({ widgets, setWidgets, layout, setLayout, accent, setAccent }) {
  const [customName, setCustomName] = useState('');
  return (
    <section className="mainGrid customizeGrid">
      <article className="glass panel wide">
        <PanelTitle icon={Settings2} title="Customizable command layout" action={<span className="pill">Drag enabled</span>} />
        <Reorder.Group axis="y" values={widgets} onReorder={setWidgets} className="reorderList">
          {widgets.map((item) => (
            <Reorder.Item value={item} key={item} className="reorderItem">
              <GripVertical size={17} />
              <input value={item} onChange={(event) => setWidgets(widgets.map((widget) => widget === item ? event.target.value : widget))} />
              <button className="iconButton mini" onClick={() => setWidgets(widgets.filter((widget) => widget !== item))}><Trash2 size={15} /></button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <div className="formGrid">
          <input value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="New custom section" />
          <button className="primaryButton" onClick={() => { if (customName) { setWidgets([...widgets, customName]); setCustomName(''); } }}><Plus size={16} /> Add section</button>
        </div>
      </article>
      <article className="glass panel">
        <PanelTitle icon={Palette} title="Personalization" action={<ChevronDown size={16} />} />
        <div className="toggleRow">
          {['compact', 'expanded'].map((mode) => <button key={mode} className={layout === mode ? 'selected' : ''} onClick={() => setLayout(mode)}>{mode}</button>)}
        </div>
        <div className="swatches">
          {palette.slice(0, 7).map((color) => <button key={color} className={accent === color ? 'swatch active' : 'swatch'} style={{ background: color }} onClick={() => setAccent(color)} />)}
        </div>
      </article>
    </section>
  );
}

export default App;
