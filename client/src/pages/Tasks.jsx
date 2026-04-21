// client/src/pages/Tasks.jsx
import { useState, useEffect } from 'react';
import { CalendarDays, CircleCheckBig, Funnel, Plus, Sparkles, Timer } from 'lucide-react';
import api from '../api/axios.js';

const priorityColors = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low: 'bg-green-100 text-green-600',
};

const statusColors = {
  'todo': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-600',
  'done': 'bg-green-100 text-green-600',
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');

        if (isMounted) {
          setTasks(res.data);
        }
      } catch {
        if (isMounted) {
          setError('Failed to fetch tasks');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);
    try {
      const res = await api.post('/tasks', form);
      setTasks((currentTasks) => [res.data, ...currentTasks]);
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
    } catch {
      setError('Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const existingTask = tasks.find((task) => task._id === taskId);

      if (!existingTask) {
        return;
      }

      const res = await api.put(`/tasks/${taskId}`, {
        ...existingTask,
        status: newStatus,
      });
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === taskId ? res.data : task))
      );
    } catch {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));
    } catch {
      setError('Failed to delete task');
    }
  };

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="glass-panel rounded-[28px] px-8 py-6">
          <p className="text-sm muted-text">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell pb-10">
      <div className="page-container space-y-6 px-1 pb-8 pt-6">
        <section className="glass-panel-strong rounded-[32px] p-8 md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                <Sparkles size={14} />
                Task cockpit
              </div>
              <h1 className="section-title mt-5 text-5xl font-black tracking-[-0.06em]">Keep the whole list moving.</h1>
              <p className="muted-text mt-4 max-w-2xl text-base leading-7">
                Capture new work quickly, sort by status, and keep AI-generated follow-ups visible without losing the human context.
              </p>
            </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="theme-transition inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] hover:translate-y-[-1px]"
          >
            <Plus size={16} />
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-[0.2em] muted-text">All tasks</p>
            <p className="section-title mt-3 text-3xl font-black">{tasks.length}</p>
          </div>
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-[0.2em] muted-text">Todo</p>
            <p className="section-title mt-3 text-3xl font-black">{tasks.filter((task) => task.status === 'todo').length}</p>
          </div>
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-[0.2em] muted-text">In progress</p>
            <p className="section-title mt-3 text-3xl font-black">{tasks.filter((task) => task.status === 'in-progress').length}</p>
          </div>
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-[0.2em] muted-text">Done</p>
            <p className="section-title mt-3 text-3xl font-black">{tasks.filter((task) => task.status === 'done').length}</p>
          </div>
        </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {showForm && (
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="section-title mb-4 text-2xl font-bold tracking-[-0.04em]">New Task</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium muted-text">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Task title"
                  required
                  className="theme-transition w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium muted-text">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Optional description"
                  rows={3}
                  className="theme-transition w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium muted-text">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="theme-transition w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium muted-text">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="theme-transition w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="theme-transition rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] disabled:opacity-50"
                >
                  {formLoading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
            <Funnel size={16} className="text-[var(--accent)]" />
            Filter by status
          </div>
          <div className="flex flex-wrap gap-2">
          {['all', 'todo', 'in-progress', 'done'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`theme-transition rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                filter === f
                  ? 'bg-[var(--accent)] text-white'
                  : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {f}
            </button>
          ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="glass-panel rounded-[30px] p-12 text-center">
            <p className="text-sm muted-text">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div
                key={task._id}
                className="glass-panel rounded-[28px] p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {task.title}
                    </p>
                    {task.meetingRef && (
                      <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                        AI generated
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="mt-2 text-sm muted-text">
                      {task.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1 text-xs muted-text">
                        <CalendarDays size={14} />
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.status === 'done' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                        <CircleCheckBig size={14} />
                        Completed
                      </span>
                    )}
                    {task.status === 'in-progress' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-500">
                        <Timer size={14} />
                        Active
                      </span>
                    )}
                  </div>
                  </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className={`cursor-pointer rounded-2xl border-0 px-3 py-2 text-xs font-semibold focus:outline-none ${statusColors[task.status]}`}
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="theme-transition rounded-2xl p-2 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
