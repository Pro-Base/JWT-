import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/UI';

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle" style={{ cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className="toggle-track" />
      <div className="toggle-thumb" />
    </label>
  );
}

export default function Settings({ isDark, onToggleTheme }) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Sozlamalar</h1>
        <p className="page-subtitle">Ilova va xavfsizlik sozlamalari</p>
      </div>

      {saved && <Alert type="success">Sozlamalar saqlandi!</Alert>}

      {/* Ko'rinish */}
      <div className="settings-section">
        <div className="settings-section-title">Ko'rinish</div>

        <div className="settings-row">
          <div className="settings-row-info">
            <h4>Qorong'i rejim</h4>
            <p>Tun uchun qulay, ko'z charchamasligini kamaytiradi</p>
          </div>
          <Toggle checked={isDark} onChange={onToggleTheme} />
        </div>
      </div>

      {/* Bildirishnomalar */}
      <div className="settings-section">
        <div className="settings-section-title">Bildirishnomalar</div>

        <div className="settings-row">
          <div className="settings-row-info">
            <h4>Sessiya eslatmasi</h4>
            <p>Token muddati tugashidan 2 daqiqa oldin xabardor qiling</p>
          </div>
          <Toggle
            checked={notifications}
            onChange={() => setNotifications(v => !v)}
          />
        </div>
      </div>

      {/* Hisob */}
      <div className="settings-section">
        <div className="settings-section-title">Hisob</div>

        <div className="settings-row">
          <div className="settings-row-info">
            <h4>Email</h4>
            <p>{user?.email}</p>
          </div>
          <span className="badge badge-blue">O'zgartirib bo'lmaydi</span>
        </div>

        <div className="settings-row">
          <div className="settings-row-info">
            <h4>Rol</h4>
            <p>Tizim tomonidan boshqariladi</p>
          </div>
          <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Xavfsizlik */}
      <div className="settings-section">
        <div className="settings-section-title">Xavfsizlik</div>

        <div className="settings-row">
          <div className="settings-row-info">
            <h4>Parolni o'zgartirish</h4>
            <p>Profildan parol bo'limiga o'ting</p>
          </div>
          <a href="/profile" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
            Profil →
          </a>
        </div>

        <div className="settings-row" style={{ borderColor: 'rgba(185,48,48,0.2)' }}>
          <div className="settings-row-info">
            <h4 style={{ color: 'var(--red)' }}>Hisobdan chiqish</h4>
            <p>Refresh token o'chiriladi, sessiya tugaydi</p>
          </div>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Rostdan ham chiqmoqchimisiz?')) logout();
            }}
          >
            Chiqish
          </button>
        </div>
      </div>

      {/* Stack info */}
      <div className="settings-section">
        <div className="settings-section-title">Loyiha haqida</div>
        <div className="panel">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              ['Backend',   'Node.js + Express'],
              ['Database',  'PostgreSQL'],
              ['Cache',     'Redis'],
              ['Auth',      'JWT (HS256)'],
              ['Frontend',  'React + Axios'],
              ['Deploy',    'Docker Compose'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn btn-primary" onClick={handleSave}>
          Sozlamalarni saqlash
        </button>
      </div>
    </div>
  );
}
