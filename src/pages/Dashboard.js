import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getToken } from '../api/axios';
import api from '../api/axios';
import { Alert, Skeleton } from '../components/UI';

export default function Dashboard() {
  const { user } = useAuth();
  const [timerSecs, setTimerSecs] = useState(900);
  const [adminRes, setAdminRes]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    setLoading(false);
    timerRef.current = setInterval(() => {
      setTimerSecs(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const mins = Math.floor(timerSecs / 60);
  const secs = timerSecs % 60;
  const pct  = Math.round((timerSecs / 900) * 100);
  const fillCls = pct < 20 ? 'danger' : pct < 40 ? 'warn' : '';

  const token = getToken() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWlkIiwicm9sZSI6InVzZXIifQ.signature';
  const [header, payload, sig] = token.split('.');

  const testAdmin = async () => {
    try {
      const res = await api.get('/api/admin');
      setAdminRes({ ok: true, msg: res.data.secret });
    } catch (err) {
      setAdminRes({ ok: false, msg: err.response?.data?.error || 'Ruxsat yo\'q' });
    }
  };

  const today = new Date().toLocaleDateString('uz-Latn', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">
          Salom, {user?.email?.split('@')[0]} 👋
        </h1>
        <p className="page-subtitle">{today}</p>
      </div>

      {/* Admin banner */}
      {user?.role === 'admin' && (
        <div className="panel" style={{
          background: 'var(--ink)', color: 'var(--accent-fg)',
          marginBottom: 20, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              Admin paneliga xush kelibsiz
            </div>
            <div style={{ fontSize: 13, opacity: 0.55 }}>
              Foydalanuvchilar ro'yxatiga kirishingiz mumkin
            </div>
          </div>
          <a href="/users" className="btn" style={{
            background: 'rgba(255,255,255,0.12)',
            color: 'white', border: '1px solid rgba(255,255,255,0.15)',
            textDecoration: 'none', height: 36, padding: '0 16px', fontSize: 13
          }}>
            Foydalanuvchilar →
          </a>
        </div>
      )}

      {/* Metrikalar */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="mc-label">Holat</div>
          <div className="mc-value" style={{ fontSize: 20, color: 'var(--green)' }}>● Faol</div>
          <div className="mc-sub">Sessiya ishlayapti</div>
        </div>
        <div className="metric-card">
          <div className="mc-label">Token muddati</div>
          <div className="mc-value" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {loading ? <Skeleton width={80} height={26}/> : `${mins}:${String(secs).padStart(2,'0')}`}
          </div>
          <div className="mc-sub">15 daqiqadan</div>
        </div>
        <div className="metric-card">
          <div className="mc-label">Rol</div>
          <div className="mc-value" style={{ textTransform: 'capitalize', fontSize: 20 }}>
            {user?.role || 'user'}
          </div>
          <div className="mc-sub">JWT payload · req.user.role</div>
        </div>
        <div className="metric-card">
          <div className="mc-label">Sessiya turi</div>
          <div className="mc-value" style={{ fontSize: 16, marginTop: 4 }}>httpOnly</div>
          <div className="mc-sub">Cookie, JS ko'ra olmaydi</div>
        </div>
      </div>

      {/* Asosiy content */}
      <div className="two-col">
        {/* Chap: Token + Admin test */}
        <div>
          <div className="panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">Access Token (JWT)</div>
                <div className="panel-sub">Authorization: Bearer …</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="token-chip tc-header">Header</span>
                <span className="token-chip tc-payload">Payload</span>
                <span className="token-chip tc-sig">Sig</span>
              </div>
            </div>

            <div className="token-block">
              <span style={{ color: 'var(--blue)' }}>{header}</span>
              <span style={{ color: 'var(--ink-3)' }}>.</span>
              <span style={{ color: 'var(--amber)' }}>{payload}</span>
              <span style={{ color: 'var(--ink-3)' }}>.</span>
              <span style={{ color: 'var(--green)' }}>{sig}</span>
            </div>

            <div className="timer-bar-wrap">
              <div className="timer-row">
                <span>Token yangilanishiga</span>
                <strong>{mins}:{String(secs).padStart(2,'0')} qoldi</strong>
              </div>
              <div className="timer-track">
                <div className={`timer-fill ${fillCls}`} style={{ width: pct + '%' }} />
              </div>
            </div>
          </div>

          {/* Admin test */}
          <div className="panel" style={{ marginTop: 16 }}>
            <div className="panel-head">
              <div>
                <div className="panel-title">Rol himoyasi testi</div>
                <div className="panel-sub">GET /api/admin → faqat admin ko'radi</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 14, lineHeight: 1.65 }}>
              Middleware zanjiri: <code style={{fontSize:11, background:'var(--bg-subtle)', padding:'2px 6px', borderRadius:4}}>authenticate()</code> → <code style={{fontSize:11, background:'var(--bg-subtle)', padding:'2px 6px', borderRadius:4}}>authorize('admin')</code>
            </p>
            <button className="btn btn-ghost" onClick={testAdmin}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7 4.5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sinab ko'rish
            </button>
            {adminRes && (
              <div style={{ marginTop: 12 }}>
                <Alert type={adminRes.ok ? 'success' : 'error'}>
                  {adminRes.ok ? `200 OK — ${adminRes.msg}` : `403 Forbidden — ${adminRes.msg}`}
                </Alert>
              </div>
            )}
          </div>
        </div>

        {/* O'ng: Profil xulosa */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Hisob ma'lumotlari</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div className="avatar lg">
              {user?.email?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{user?.email}</div>
              <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="kv-list">
            <div className="kv-row">
              <span className="kv-key">ID</span>
              <span className="kv-val mono">{user?.id || '—'}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Email</span>
              <span className="kv-val">{user?.email}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Rol</span>
              <span className="kv-val">{user?.role}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Cookie</span>
              <span className="kv-val" style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--ink-2)' }}>httpOnly; Secure; SameSite=Strict</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Refresh</span>
              <span className="kv-val">7 kun</span>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <a href="/profile" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
              Profilni tahrirlash →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
