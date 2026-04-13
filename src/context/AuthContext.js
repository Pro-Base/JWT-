import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { setToken, clearToken } from '../api/axios';
import api from '../api/axios';
import axios from 'axios';

const BACKEND = 'https://jwt-lhdq.onrender.com';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const res = await axios.post(
          `${BACKEND}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setToken(res.data.accessToken);
        const profile = await api.get('/profile');
        setUser(profile.data.user);
      } catch {
        // Cookie yo'q — normal holat
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${BACKEND}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {}
    clearToken();
    setUser(null);
    window.location.href = '/login';
  }, []);

  const updateUser = useCallback((data) => {
    setUser(prev => ({ ...prev, ...data }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);