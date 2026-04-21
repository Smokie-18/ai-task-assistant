// client/src/pages/Meetings.jsx
import { useState, useEffect } from 'react';
import { Brain, CalendarFold, ChevronDown, Plus, Sparkles, Trash2 } from 'lucide-react';
import api from '../api/axios.js';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summarizingId, setSummarizingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    notes: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchMeetings = async () => {
      try {
        const res = await api.get('/meetings');

        if (isMounted) {
          setMeetings(res.data);
        }
      } catch {
        if (isMounted) {
          setError('Failed to fetch meetings');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchMeetings();

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
      const res = await api.post('/meetings', form);
      setMeetings((currentMeetings) => [res.data, ...currentMeetings]);
      setForm({ title: '', notes: '' });
      setShowForm(false);
    } catch {
      setError('Failed to create meeting');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSummarize = async (meetingId) => {
    setError('');
    setSummarizingId(meetingId);
    try {
      const res = await api.post(`/meetings/${meetingId}/summarize`);
      setMeetings((currentMeetings) =>
        currentMeetings.map((meeting) => (meeting._id === meetingId ? res.data : meeting))
      );
      setExpandedId(meetingId);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to summarize meeting');
    } finally {
      setSummarizingId(null);
    }
  };

  const handleAddTask = async (meetingId, taskIndex) => {
    try {
      await api.post(`/meetings/${meetingId}/tasks/${taskIndex}`);
      setMeetings((currentMeetings) =>
        currentMeetings.map((meeting) => {
          if (meeting._id !== meetingId) {
            return meeting;
          }

          const updatedAiTasks = (meeting.aiTasks || []).map((task, index) =>
            index === taskIndex ? { ...task, isAdded: true } : task
          );

          return { ...meeting, aiTasks: updatedAiTasks };
        })
      );
    } catch {
      setError('Failed to add task');
    }
  };

  const handleDelete = async (meetingId) => {
    try {
      await api.delete(`/meetings/${meetingId}`);
      setMeetings((currentMeetings) =>
        currentMeetings.filter((meeting) => meeting._id !== meetingId)
      );
    } catch {
      setError('Failed to delete meeting');
    }
  };

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="glass-panel rounded-[28px] px-8 py-6">
          <p className="text-sm muted-text">Loading meetings...</p>
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
                Meeting intelligence
              </div>
              <h1 className="section-title mt-5 text-5xl font-black tracking-[-0.06em]">
                Turn conversations into clear action.
              </h1>
              <p className="muted-text mt-4 max-w-2xl text-base leading-7">
                Capture notes, summarize them with AI, and push important follow-ups straight into your task system without losing the source context.
              </p>
            </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="theme-transition inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] hover:translate-y-[-1px]"
          >
            <Plus size={16} />
            {showForm ? 'Cancel' : 'New Meeting'}
          </button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-[0.2em] muted-text">Total meetings</p>
            <p className="section-title mt-3 text-3xl font-black">{meetings.length}</p>
          </div>
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-[0.2em] muted-text">Summarized</p>
            <p className="section-title mt-3 text-3xl font-black">{meetings.filter((meeting) => meeting.isSummarized).length}</p>
          </div>
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-[0.2em] muted-text">Pending</p>
            <p className="section-title mt-3 text-3xl font-black">{meetings.filter((meeting) => !meeting.isSummarized).length}</p>
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
            <h2 className="section-title mb-4 text-2xl font-bold tracking-[-0.04em]">New Meeting</h2>
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
                  placeholder="e.g. Q3 Planning Meeting"
                  required
                  className="theme-transition w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium muted-text">
                  Meeting Notes / Transcript
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Paste your meeting notes or transcript here. AI will summarize it and extract action items..."
                  rows={6}
                  required
                  className="theme-transition w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="theme-transition rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] disabled:opacity-50"
                >
                  {formLoading ? 'Creating...' : 'Create Meeting'}
                </button>
              </div>
            </form>
          </div>
        )}

        {meetings.length === 0 ? (
          <div className="glass-panel rounded-[30px] p-12 text-center">
            <p className="text-sm muted-text">No meetings yet</p>
            <p className="mt-1 text-xs muted-text">
              Create a meeting and let AI summarize it
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map(meeting => (
              <div
                key={meeting._id}
                className="glass-panel overflow-hidden rounded-[30px]"
              >
                <div className="flex items-start justify-between gap-4 p-5">
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => setExpandedId(
                      expandedId === meeting._id ? null : meeting._id
                    )}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-[var(--text)]">
                        {meeting.title}
                      </h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        meeting.isSummarized
                          ? 'bg-green-100 text-green-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {meeting.isSummarized ? 'Summarized' : 'Pending'}
                      </span>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs muted-text">
                      <CalendarFold size={14} />
                      {new Date(meeting.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm muted-text">
                      {meeting.notes}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!meeting.isSummarized && (
                      <button
                        onClick={() => handleSummarize(meeting._id)}
                        disabled={summarizingId === meeting._id}
                        className="theme-transition flex items-center gap-1.5 rounded-2xl bg-[var(--accent)] px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[var(--accent-soft)] disabled:opacity-50"
                      >
                        {summarizingId === meeting._id ? (
                          <>
                            <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 12a9 9 0 11-6.219-8.56"/>
                            </svg>
                            Summarizing...
                          </>
                        ) : (
                          <>
                            <Brain size={14} />
                            Summarize with AI
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(expandedId === meeting._id ? null : meeting._id)}
                      className="theme-transition rounded-2xl border border-[var(--border)] p-2.5 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                    >
                      <ChevronDown size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(meeting._id)}
                      className="theme-transition rounded-2xl p-2.5 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {expandedId === meeting._id && meeting.isSummarized && (
                  <div className="space-y-4 border-t border-[var(--border)] p-5">
                    <div className="rounded-[24px] bg-[var(--accent-soft)] p-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                        AI Summary
                      </p>
                      <p className="text-sm leading-relaxed text-[var(--text)]">
                        {meeting.summary}
                      </p>
                    </div>

                    {(meeting.aiTasks || []).length > 0 && (
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide muted-text">
                          Suggested Tasks
                        </p>
                        <div className="space-y-2">
                          {(meeting.aiTasks || []).map((task, index) => (
                            <div
                              key={index}
                              className={`theme-transition flex items-center justify-between rounded-[24px] border p-4 ${
                                task.isAdded
                                  ? 'bg-[var(--surface-muted)] border-[var(--border)]'
                                  : 'bg-[var(--surface)] border-[var(--border)]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {task.isAdded && (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                )}
                                <div>
                                  <p className={`text-sm font-semibold ${task.isAdded ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'}`}>
                                    {task.title}
                                  </p>
                                  <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    task.priority === 'high'
                                      ? 'bg-red-100 text-red-600'
                                      : task.priority === 'medium'
                                      ? 'bg-amber-100 text-amber-600'
                                      : 'bg-green-100 text-green-600'
                                  }`}>
                                    {task.priority}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddTask(meeting._id, index)}
                                disabled={task.isAdded}
                                className={`theme-transition rounded-2xl px-3.5 py-2 text-xs font-semibold ${
                                  task.isAdded
                                    ? 'cursor-not-allowed text-[var(--text-muted)]'
                                    : 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]'
                                }`}
                              >
                                {task.isAdded ? 'Added' : 'Add to Tasks'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
