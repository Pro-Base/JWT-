import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFormValidation, rules } from '../hooks/useFormValidation';
import { Alert, Field, PasswordStrength } from '../components/UI';
import api from '../api/axios';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [saved, setSaved]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [apiError, setApiError]   = useState('');
  const [profile, setProfile]     = useState(null);

  useEffect(() => {
    api.get('/api/profile').then(r => setProfile(r.data.user)).catch(() => {});
  }, []);

  // Parol o'zgartirish forma
  const { values: pwVals, errors: pwErrs, touched: pwTouched,
          handleChange: pwChange, handleBlur: pwBlur, handleSubmit: pwSubmit, reset: pwReset } =
    useFormValidation(
      { currentPassword: '', newPassword: '', confirmNew: '' },
      {
        currentPassword: [rules.required],
        newPassword:     [rules.strongPassword],
        confirmNew:      [rules.match('newPassword', 'Yangi parol')],
      }
    );

  const onPasswordSave = pwSubmit(async (vals) => {
    setSaving(true); setApiError('');
    try {
      await api.patch('/api/profile/password', {
        currentPassword: vals.currentPassword,
        newPassword:     vals.newPassword,
      });
      setSaved(true);
      pwReset();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setApiError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  });

  const tabs = [
    { id: 'info',     label: 'Ma\'lumotlar' },
    { id: 'security', label: 'Xavfsizlik'   },
    { id: 'session',  label: 'Sessiya'      },
  ];

  const data = profile || user || {};

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Profil</h1>
        <p className="page-subtitle">Hisob ma'lumotlari va xavfsizlik sozlamalari</p>
      </div>

      {/* Profil header */}
      <div className="profile-header-card">
        <div className="avatar lg" style={{ width: 60, height: 60, fontSize: 20 }}>
          {data.email?.slice(0,2).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{data.email}</h2>
          <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`badge ${data.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
              {data.role}
            </span>
            <span>·</span>
            <span>
              {data.created_at
                ? `Ro'yxatdan o'tilgan: ${new Date(data.created_at).toLocaleDateString('uz-Latn')}`
                : 'Faol foydalanuvchi'}
            </span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 16px',
              background: 'none', border: 'none', cursor: 'pointer',
              font: 'var(--font-ui)', fontSize: 14, fontWeight: 500,
              color: activeTab === t.id ? 'var(--ink)' : 'var(--ink-3)',
              borderBottom: `2px solid ${activeTab === t.id ? 'var(--ink)' : 'transparent'}`,
              marginBottom: -1, transition: 'color 0.15s',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Ma'lumotlar */}
      {activeTab === 'info' && (
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Asosiy ma'lumotlar</div>
            <span className="badge badge-blue">Faqat o'qish</span>
          </div>
          <div className="kv-list">
            <div className="kv-row">
              <span className="kv-key">ID</span>
              <span className="kv-val mono">{data.id || '—'}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Email</span>
              <span className="kv-val">{data.email || '—'}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Rol</span>
              <span className="kv-val">
                <span className={`badge ${data.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                  {data.role}
                </span>
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Yaratilgan</span>
              <span className="kv-val">
                {data.created_at
                  ? new Date(data.created_at).toLocaleString('uz-Latn')
                  : '—'}
              </span>
            </div>
          </div>
          <p style={{ marginTop: 16, fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.6 }}>
            Email va rol o'zgartirishni backend API orqali amalga oshiriladi. UUID asosidagi ID hech qachon o'zgartirilmaydi.
          </p>
        </div>
      )}

      {/* Tab: Xavfsizlik */}
      {activeTab === 'security' && (
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Parolni o'zgartirish</div>
          </div>

          {saved   && <Alert type="success">Parol muvaffaqiyatli o'zgartirildi!</Alert>}
          {apiError && <Alert type="error">{apiError}</Alert>}

          <form onSubmit={onPasswordSave} noValidate>
            <div className="form-stack">
              <Field label="Joriy parol" error={pwErrs.currentPassword} touched={pwTouched.currentPassword}>
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </span>
                  <input
                    className={`field-input ${pwTouched.currentPassword && pwErrs.currentPassword ? 'error' : ''}`}
                    type="password" name="currentPassword"
                    value={pwVals.currentPassword} onChange={pwChange} onBlur={pwBlur}
                    placeholder="Hozirgi parolingiz"
                  />
                </div>
              </Field>

              <Field
                label="Yangi parol"
                error={pwErrs.newPassword}
                touched={pwTouched.newPassword}
                hint="Kamida 8 belgi, 1 katta harf, 1 raqam"
              >
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1v6M5 4l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="3" y="9" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </span>
                  <input
                    className={`field-input ${pwTouched.newPassword && pwErrs.newPassword ? 'error' : pwTouched.newPassword && !pwErrs.newPassword && pwVals.newPassword ? 'success' : ''}`}
                    type="password" name="newPassword"
                    value={pwVals.newPassword} onChange={pwChange} onBlur={pwBlur}
                    placeholder="Yangi parol"
                  />
                </div>
                <PasswordStrength password={pwVals.newPassword} />
              </Field>

              <Field
                label="Yangi parolni tasdiqlash"
                error={pwErrs.confirmNew}
                touched={pwTouched.confirmNew}
                success={pwTouched.confirmNew && !pwErrs.confirmNew ? 'Mos keldi ✓' : null}
              >
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    className={`field-input ${pwTouched.confirmNew && pwErrs.confirmNew ? 'error' : pwTouched.confirmNew && !pwErrs.confirmNew && pwVals.confirmNew ? 'success' : ''}`}
                    type="password" name="confirmNew"
                    value={pwVals.confirmNew} onChange={pwChange} onBlur={pwBlur}
                    placeholder="Yangi parolni qayta kiriting"
                  />
                </div>
              </Field>

              <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 4 }}>
                {saving ? <><span className="spinner" style={{borderTopColor:'white'}}/> Saqlanmoqda…</> : 'Parolni yangilash'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Sessiya */}
      {activeTab === 'session' && (
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Sessiya ma'lumotlari</div>
          </div>
          <div className="kv-list">
            {[
              ['Access token',  '15 daqiqa',          'Bearer header orqali yuboriladi'],
              ['Refresh token', '7 kun',               'httpOnly cookie da saqlanadi'],
              ['Cookie turi',   'httpOnly; Secure',    'JavaScript orqali o\'qib bo\'lmaydi'],
              ['SameSite',      'Strict',              'CSRF hujumlaridan himoya'],
              ['Silent refresh','Avtomatik',           '401 kelganda token yangilanadi'],
              ['Logout',        'Cookie tozalanadi',   'Refresh token o\'chiriladi'],
            ].map(([key, val, note]) => (
              <div key={key} className="kv-row">
                <span className="kv-key">{key}</span>
                <div>
                  <div className="kv-val">{val}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
