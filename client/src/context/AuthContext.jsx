import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import AuthContext from './auth-context.js';

export const AuthProvider = ({ children }) => {
  const hasStoredToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(hasStoredToken);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasStoredToken) {
      return;
    }

    const bootstrapTimer = window.setTimeout(() => {
      void fetchUser();
    }, 0);

    return () => {
      window.clearTimeout(bootstrapTimer);
    };
  }, [hasStoredToken]);

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  // Google OAuth success pe token save 
  const handleOAuthSuccess = (token) => {
    localStorage.setItem('accessToken', token);
    fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, handleOAuthSuccess }}
    >
      {children}
    </AuthContext.Provider>
  );
};
