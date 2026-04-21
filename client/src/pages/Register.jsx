// client/src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Layers3, Sparkles, WandSparkles } from 'lucide-react';
import { API_ORIGIN } from '../api/axios.js';
import { useAuth } from '../context/useAuth.js';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_ORIGIN}/api/auth/google`;
  };

  return (
    <div className="app-shell flex min-h-screen items-center py-10">
      <div className="page-container grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel-strong rounded-[32px] p-8 md:p-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            <WandSparkles size={14} />
            New workspace
          </div>
          <h1 className="section-title text-4xl font-black tracking-[-0.05em]">
            Build a calmer system for your tasks, notes, and meetings.
          </h1>
          <p className="muted-text mt-4 text-base leading-7">
            Start with a polished dashboard, shift between dark and light mode, and let AI turn messy meeting notes into clean next steps.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: Sparkles, title: 'Meeting intelligence', text: 'Summaries and action items extracted from your notes in seconds.' },
              { icon: Layers3, title: 'Structured work', text: 'Tasks, priorities, due dates, and status all designed to feel easy to scan.' },
              { icon: ArrowRight, title: 'Momentum built in', text: 'A workspace that nudges you toward clarity instead of overwhelm.' },
            ].map((item) => (
              <div key={item.title} className="theme-transition flex gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <item.icon size={18} />
                </div>
                <div>
                  <h2 className="section-title text-lg font-semibold">{item.title}</h2>
                  <p className="muted-text mt-2 text-sm leading-6">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel-strong rounded-[32px] p-8 md:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Create your account
            </p>
            <h2 className="section-title mt-3 text-3xl font-bold tracking-[-0.04em]">
              Launch your workspace
            </h2>
            <p className="muted-text mt-3 text-sm leading-6">
              Set up your account once and keep your daily workflow sharp from the very first login.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="theme-transition w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="theme-transition w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="theme-transition w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="theme-transition w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="theme-transition flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowRight size={16} />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs uppercase tracking-[0.22em] muted-text">or continue with</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="theme-transition flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm muted-text">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[var(--accent)] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
