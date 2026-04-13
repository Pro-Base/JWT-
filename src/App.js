import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import Topbar from './components/Topbar';

import Login    from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile  from './pages/Profile';
import Settings from './pages/Settings';
import Users    from './pages/Users';

import './index.css';

// ── Loading screen ──
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'var(--ink)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M4 8a4 4 0 018 0" stroke="var(--bg-page)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="8" cy="11" r="2" fill="var(--bg-page)"/>
        </svg>
      </div>
      <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>Yuklanmoqda…</span>
    </div>
  );
}

// ── Private route ──
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

// ── Public route (login bo'lsa dashboard ga yuvor) ──
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !user ? children : <Navigate to="/dashboard" replace />;
}

// ── Authenticated layout ──
function AppLayout({ children, isDark, onToggleTheme }) {
  return (
    <div className="app-shell">
      <Topbar isDark={isDark} onToggleTheme={onToggleTheme} />
      {children}
    </div>
  );
}

// ── Main app ──
function AppRoutes() {
  const { isDark, toggle } = useTheme();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Private */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <AppLayout isDark={isDark} onToggleTheme={toggle}>
            <Dashboard />
          </AppLayout>
        </PrivateRoute>
      }/>
      <Route path="/profile" element={
        <PrivateRoute>
          <AppLayout isDark={isDark} onToggleTheme={toggle}>
            <Profile />
          </AppLayout>
        </PrivateRoute>
      }/>
      <Route path="/settings" element={
        <PrivateRoute>
          <AppLayout isDark={isDark} onToggleTheme={toggle}>
            <Settings isDark={isDark} onToggleTheme={toggle} />
          </AppLayout>
        </PrivateRoute>
      }/>
      <Route path="/users" element={
        <PrivateRoute>
          <AppLayout isDark={isDark} onToggleTheme={toggle}>
            <Users />
          </AppLayout>
        </PrivateRoute>
      }/>

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
