import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle, Avatar } from './UI';

export default function Topbar({ isDark, onToggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard', label: 'Bosh sahifa',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    },
    {
      to: '/profile', label: 'Profil',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1.5 12.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    },
    {
      to: '/settings', label: 'Sozlamalar',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.4 2.4l1.06 1.06M10.54 10.54l1.06 1.06M2.4 11.6l1.06-1.06M10.54 3.46l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    },
    ...(user?.role === 'admin' ? [{
      to: '/users', label: 'Foydalanuvchilar',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 12c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M10 6.5c.83 0 1.5.67 1.5 1.5S10.83 9.5 10 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M12 12c0-1.1-.63-2.06-1.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    }] : []),
  ];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <a className="topbar-brand" href="/dashboard">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <rect width="16" height="16" rx="4" fill="currentColor"/>
            <path d="M4 8a4 4 0 018 0" stroke="var(--bg-page)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="8" cy="11" r="2" fill="var(--bg-page)"/>
          </svg>
          SecureAuth
        </a>

        <div className="topbar-sep" />

        <nav className="topbar-nav">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {icon}{label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="topbar-right">
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

        <div className="topbar-sep" />

        <div className="user-chip">
          <Avatar email={user?.email} />
          <span className="avatar-name">{user?.email?.split('@')[0]}</span>
          <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
            {user?.role}
          </span>
        </div>

        <button className="btn btn-ghost" style={{height:34, padding:'0 12px', fontSize:12}} onClick={handleLogout}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M5 1.5H2.5A1.5 1.5 0 001 3v7A1.5 1.5 0 002.5 11.5H5M8.5 9l3-2.5L8.5 4M12 6.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Chiqish
        </button>
      </div>
    </header>
  );
}
