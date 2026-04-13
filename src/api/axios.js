import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jwt-lhdq.onrender.com/api',
  withCredentials: true,
});

let accessToken = null;
let isRefreshing = false;
let refreshQueue = [];

export const setToken   = (t) => { accessToken = t; window.__accessToken = t; };
export const clearToken = () => { accessToken = null; window.__accessToken = null; };
export const getToken   = ()  => accessToken;

// ── Request interceptor ──
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Response interceptor: 401 → silent refresh ──
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh',  // ← TO'G'RILANDI
          {},
          { withCredentials: true }
        );
        const newToken = res.data.accessToken;
        setToken(newToken);
        refreshQueue.forEach(({ resolve }) => resolve(newToken));
        refreshQueue = [];
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshErr) {
        refreshQueue.forEach(({ reject }) => reject(refreshErr));
        refreshQueue = [];
        clearToken();
        // Login yoki register sahifasida redirect qilma
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register') {
          window.location.href = '/login?expired=1';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;