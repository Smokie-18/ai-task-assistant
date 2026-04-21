// client/src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, CalendarRange, Moon, SunMedium } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { useTheme } from '../context/useTheme.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Meetings', path: '/meetings', icon: CalendarRange },
  ];

  return (
    <nav className="sticky top-0 z-50 px-4 pt-4">
      <div className="page-container">
        <div className="glass-panel flex flex-col gap-4 rounded-[28px] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]">
            <span className="text-lg font-black tracking-tight">TA</span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] muted-text">
              TaskAI
            </p>
            <p className="text-lg font-semibold section-title">
              Focus with style
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`theme-transition flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold
                ${location.pathname === link.path
                  ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]'
                }`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <button
            onClick={toggleTheme}
            className="theme-transition flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--border-strong)]"
          >
            {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <div className="theme-transition flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2.5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
                <span className="text-sm font-semibold text-[var(--accent)]">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{user?.name}</p>
              <p className="text-xs muted-text">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="theme-transition rounded-2xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] hover:border-red-300 hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
