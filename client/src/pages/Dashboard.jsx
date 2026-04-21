// client/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BrainCircuit, CalendarClock, CheckCheck, CircleDashed, Sparkles } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import api from '../api/axios.js';

const StatCard = ({ icon: Icon, label, value, tone, detail }) => (
  <div className="glass-panel rounded-[28px] p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium muted-text">{label}</p>
        <p className="section-title mt-3 text-4xl font-black tracking-[-0.05em]">{value}</p>
        <p className="mt-3 text-sm muted-text">{detail}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
        {Icon ? <Icon size={20} /> : null}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [tasksRes, meetingsRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/meetings'),
        ]);

        if (!isMounted) {
          return;
        }

        setTasks(tasksRes.data);
        setMeetings(meetingsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const pendingMeetings = meetings.filter(m => !m.isSummarized).length;

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

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="glass-panel rounded-[28px] px-8 py-6">
          <p className="text-sm muted-text">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell pb-10">
      <div className="page-container space-y-6 px-1 pb-8 pt-6">
        <section className="glass-panel-strong overflow-hidden rounded-[32px] p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                <Sparkles size={14} />
                Workspace snapshot
              </div>
              <h1 className="section-title mt-6 text-5xl font-black leading-[0.95] tracking-[-0.06em]">
                Good to see you, {user?.name?.split(' ')[0]}.
              </h1>
              <p className="muted-text mt-5 max-w-2xl text-base leading-7">
                Today’s command center is tuned for focus. Triage your tasks, summarize meetings, and move work forward with less friction.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/tasks')}
                  className="theme-transition flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] hover:translate-y-[-1px]"
                >
                  Open tasks
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/meetings')}
                  className="theme-transition rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-muted)]"
                >
                  Review meetings
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] muted-text">Completion</p>
                <p className="section-title mt-4 text-4xl font-black">{tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0}%</p>
                <p className="mt-3 text-sm muted-text">of all tasks are already done</p>
              </div>
              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] muted-text">Pending meetings</p>
                <p className="section-title mt-4 text-4xl font-black">{pendingMeetings}</p>
                <p className="mt-3 text-sm muted-text">need a summary or follow-up</p>
              </div>
              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] muted-text">Rhythm today</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
                    <p className="text-xs muted-text">To do</p>
                    <p className="section-title mt-2 text-2xl font-bold">{todoCount}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
                    <p className="text-xs muted-text">In progress</p>
                    <p className="section-title mt-2 text-2xl font-bold">{inProgressCount}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
                    <p className="text-xs muted-text">Done</p>
                    <p className="section-title mt-2 text-2xl font-bold">{doneCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={CircleDashed}
            label="Todo"
            value={todoCount}
            detail="Fresh tasks waiting to be started."
            tone="bg-slate-500/10 text-slate-500"
          />
          <StatCard
            icon={BrainCircuit}
            label="In Progress"
            value={inProgressCount}
            detail="Workstreams with active momentum."
            tone="bg-sky-500/10 text-sky-500"
          />
          <StatCard
            icon={CheckCheck}
            label="Done"
            value={doneCount}
            detail="Completed work you can stop carrying."
            tone="bg-emerald-500/10 text-emerald-500"
          />
          <StatCard
            icon={CalendarClock}
            label="Meetings to summarize"
            value={pendingMeetings}
            detail="Conversations that still need clean outputs."
            tone="bg-[var(--accent-soft)] text-[var(--accent)]"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-[30px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Recent tasks</p>
                <h2 className="section-title mt-2 text-2xl font-bold tracking-[-0.04em]">What needs attention</h2>
              </div>
              <button
                onClick={() => navigate('/tasks')}
                className="text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                View all
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="rounded-[26px] border border-dashed border-[var(--border)] px-6 py-10 text-center">
                <p className="text-sm muted-text">No tasks yet</p>
                <button
                  onClick={() => navigate('/tasks')}
                  className="mt-3 text-sm font-semibold text-[var(--accent)] hover:underline"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map(task => (
                  <div
                    key={task._id}
                    className="theme-transition rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--text)]">
                        {task.title}
                      </p>
                      {task.meetingRef && (
                        <p className="mt-1 text-xs text-[var(--accent)]">
                          AI generated
                        </p>
                      )}
                      </div>
                      <div className="ml-3 flex shrink-0 items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel rounded-[30px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Recent meetings</p>
                <h2 className="section-title mt-2 text-2xl font-bold tracking-[-0.04em]">Conversations in motion</h2>
              </div>
              <button
                onClick={() => navigate('/meetings')}
                className="text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                View all
              </button>
            </div>

            {meetings.length === 0 ? (
              <div className="rounded-[26px] border border-dashed border-[var(--border)] px-6 py-10 text-center">
                <p className="text-sm muted-text">No meetings yet</p>
                <button
                  onClick={() => navigate('/meetings')}
                  className="mt-3 text-sm font-semibold text-[var(--accent)] hover:underline"
                >
                  Log your first meeting
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {meetings.slice(0, 5).map(meeting => (
                  <div
                    key={meeting._id}
                    className="theme-transition rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--text)]">
                        {meeting.title}
                      </p>
                      <p className="mt-1 text-xs muted-text">
                        {new Date(meeting.createdAt).toLocaleDateString()}
                      </p>
                      </div>
                    <span className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      meeting.isSummarized
                        ? 'bg-green-100 text-green-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      {meeting.isSummarized ? 'Summarized' : 'Pending'}
                    </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
