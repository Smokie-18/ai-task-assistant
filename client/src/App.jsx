// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './context/useAuth.js';
import { ThemeProvider } from './context/ThemeContext.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Meetings from './pages/Meetings.jsx';
import OAuthSuccess from './pages/OAuthSuccess.jsx';
import Navbar from './components/Navbar.jsx';

// agar logged in nahi hai toh login pe bhejo
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

// agar logged in hai toh login/register pe mat jaane do
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" />;

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute><Register /></PublicRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute><Tasks /></ProtectedRoute>
        } />

        <Route path="/meetings" element={
          <ProtectedRoute><Meetings /></ProtectedRoute>
        } />

        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
