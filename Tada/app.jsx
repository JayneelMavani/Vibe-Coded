// ── app.jsx ─────────────────────────────────────────────────────────────────
// React 18 + Babel standalone (no build step needed)

const { useState, useEffect, useRef } = React;

// ── Demo accounts ────────────────────────────────────────────────────────────
// In a real app you'd verify against a backend. Here we use a simple map.
const DEMO_USERS = {
  'sahil':  { password: 'tada123',  name: 'Sahil',   color: '#f77f52', emoji: '🦊' },
  'priya':  { password: 'hello123', name: 'Priya',   color: '#c77dff', emoji: '🌸' },
  'arjun':  { password: 'tasks456', name: 'Arjun',   color: '#4cc9f0', emoji: '🚀' },
};

// ── Accent colours per task ──────────────────────────────────────────────────
const ACCENTS = ['#f77f52', '#f9c74f', '#90be6d', '#a8dadc', '#c77dff', '#ff8fab'];

// ── Unique ID helper ─────────────────────────────────────────────────────────
let _id = Date.now();
const uid = () => (++_id).toString(36);

// ── Storage helpers (per user) ───────────────────────────────────────────────
const storageKey = (username) => `tada-tasks-${username}`;

const loadTasks = (username) => {
  try { return JSON.parse(localStorage.getItem(storageKey(username)) || '[]'); }
  catch { return []; }
};

const saveTasks = (username, tasks) =>
  localStorage.setItem(storageKey(username), JSON.stringify(tasks));

// ── LoginScreen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const usernameRef               = useRef(null);

  useEffect(() => { usernameRef.current?.focus(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const key  = username.trim().toLowerCase();
    const user = DEMO_USERS[key];

    if (!key || !password) {
      setError('Please enter both username and password.');
      return;
    }
    if (!user || user.password !== password) {
      setError('Incorrect username or password. Try a demo account below!');
      return;
    }

    // Fake brief loading feel
    setLoading(true);
    setTimeout(() => {
      onLogin({ username: key, ...user });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <span className="login-emoji" role="img" aria-label="target">🎯</span>
          <h1>Tada!</h1>
          <p>Sign in to manage your tasks</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="field">
            <label htmlFor="login-username">Username</label>
            <div className="field-wrap">
              <span className="field-icon" aria-hidden="true">👤</span>
              <input
                id="login-username"
                ref={usernameRef}
                type="text"
                placeholder="e.g. sahil"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <div className="field-wrap">
              <span className="field-icon" aria-hidden="true">🔑</span>
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                title={showPw ? 'Hide' : 'Show'}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error" role="alert" key={error}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            id="login-submit"
          >
            {loading ? '⏳ Signing in…' : '→ Sign In'}
          </button>
        </form>

        {/* Demo hint */}
        <div className="demo-hint">
          <strong>🧪 Demo accounts (username / password)</strong>
          sahil / tada123 &nbsp;·&nbsp; priya / hello123 &nbsp;·&nbsp; arjun / tasks456
        </div>
      </div>
    </div>
  );
}

// ── TaskItem ─────────────────────────────────────────────────────────────────
function TaskItem({ task, onToggle, onDelete }) {
  const [removing, setRemoving] = useState(false);
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 300);
    return () => clearTimeout(t);
  }, []);

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(task.id), 260);
  };

  const cls = ['task-item', task.done ? 'done' : '', removing ? 'removing' : '', entering ? 'entering' : '']
    .filter(Boolean).join(' ');

  return (
    <li className={cls} style={{ '--item-accent': task.accent }}>
      <label className="checkbox-wrap" aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}>
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
        <span className="checkbox-visual" aria-hidden="true">
          <svg viewBox="0 0 12 10"><polyline points="1,5 4.5,9 11,1" /></svg>
        </span>
      </label>
      <span className="task-text">{task.text}</span>
      <button className="delete-btn" onClick={handleDelete} aria-label={`Delete: ${task.text}`} title="Delete task">✕</button>
    </li>
  );
}

// ── TodoApp (shown after login) ──────────────────────────────────────────────
function TodoApp({ user, onLogout }) {
  const [tasks, setTasks]   = useState(() => loadTasks(user.username));
  const [input, setInput]   = useState('');
  const [filter, setFilter] = useState('all');
  const inputRef            = useRef(null);

  // Persist whenever tasks change
  useEffect(() => {
    saveTasks(user.username, tasks);
  }, [tasks, user.username]);

  const addTask = () => {
    const text = input.trim();
    if (!text) { inputRef.current?.focus(); return; }
    const accent = ACCENTS[tasks.length % ACCENTS.length];
    setTasks(prev => [{ id: uid(), text, done: false, accent }, ...prev]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKey = (e) => { if (e.key === 'Enter') addTask(); };
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const clearDone  = ()   => setTasks(prev => prev.filter(t => !t.done));

  const total       = tasks.length;
  const doneCount   = tasks.filter(t => t.done).length;
  const activeCount = total - doneCount;

  const visible = tasks.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done')   return t.done;
    return true;
  });

  const emptyMsgs = {
    all:    { icon: '🌿', text: 'No tasks yet — add one above!' },
    active: { icon: '✨', text: 'Nothing left to do. Nice work!' },
    done:   { icon: '🎉', text: 'Nothing completed yet.' },
  };

  return (
    <div className="app">
      {/* ── User chip + logout ── */}
      <div className="user-chip">
        <div
          className="user-avatar"
          style={{ background: user.color }}
          aria-label={`Logged in as ${user.name}`}
          title={user.name}
        >
          {user.emoji}
        </div>
        <span className="user-name">Hey, {user.name}! 👋</span>
        <button className="logout-btn" onClick={onLogout} id="logout-btn">
          ← Sign out
        </button>
      </div>

      {/* ── Header ── */}
      <header className="header">
        <span className="header__emoji" role="img" aria-label="tada">🎯</span>
        <h1 className="header__title">Tada!</h1>
        <p className="header__subtitle">Your simple, cheerful task list</p>
      </header>

      {/* ── Stats ── */}
      {total > 0 && (
        <div className="stats" role="status" aria-live="polite">
          <div className="stat-pill"><span className="num">{total}</span> total</div>
          <div className="stat-pill"><span className="num" style={{ color: '#f77f52' }}>{activeCount}</span> to‑do</div>
          <div className="stat-pill"><span className="num" style={{ color: '#90be6d' }}>{doneCount}</span> done</div>
        </div>
      )}

      {/* ── Input Card ── */}
      <div className="input-card">
        <input
          id="task-input"
          ref={inputRef}
          type="text"
          placeholder="What needs doing…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          maxLength={200}
          autoComplete="off"
          aria-label="New task"
        />
        <button className="add-btn" onClick={addTask} aria-label="Add task" title="Add task (Enter)">+</button>
      </div>

      {/* ── Filter Bar ── */}
      {total > 0 && (
        <nav className="filter-bar" aria-label="Filter tasks">
          {['all', 'active', 'done'].map(f => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </nav>
      )}

      {/* ── Task List ── */}
      <ul className="task-list" aria-label="Task list">
        {visible.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" role="img" aria-hidden="true">{emptyMsgs[filter].icon}</span>
            <p>{emptyMsgs[filter].text}</p>
          </div>
        ) : (
          visible.map(task => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))
        )}
      </ul>

      {/* ── Clear Done ── */}
      {doneCount > 0 && (
        <button className="clear-done-btn" onClick={clearDone}>
          🗑 Clear {doneCount} completed
        </button>
      )}
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
function Root() {
  // Try to restore session from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tada-session') || 'null'); }
    catch { return null; }
  });

  const handleLogin = (user) => {
    localStorage.setItem('tada-session', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('tada-session');
    setCurrentUser(null);
  };

  return currentUser
    ? <TodoApp user={currentUser} onLogout={handleLogout} />
    : <LoginScreen onLogin={handleLogin} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
