import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Skeleton, Alert } from '../components/UI';
import api from '../api/axios';

export default function Users() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');

  // Faqat admin kirishi mumkin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    api.get('/api/users')
      .then(r => setUsers(r.data.users || []))
      .catch(err => setError(err.response?.data?.error || 'Foydalanuvchilarni yuklab bo\'lmadi'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Foydalanuvchilar</h1>
        <p className="page-subtitle">Tizimga ro'yxatdan o'tgan barcha foydalanuvchilar</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Toolbar */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="field-wrap" style={{ flex: 1 }}>
            <span className="field-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              className="field-input"
              style={{ paddingLeft: 36, height: 38 }}
              placeholder="Email yoki rol bo'yicha qidirish…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="badge badge-blue" style={{ height: 30, padding: '0 14px', fontSize: 12 }}>
            {loading ? '…' : `${filtered.length} ta`}
          </div>
        </div>
      </div>

      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: 20 }}>Foydalanuvchi</th>
              <th>Rol</th>
              <th>ID</th>
              <th>Yaratilgan</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length: 4}).map((_, i) => (
                <tr key={i}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Skeleton width={32} height={32} style={{ borderRadius:'50%' }}/>
                      <Skeleton width={160} height={14}/>
                    </div>
                  </td>
                  <td><Skeleton width={60} height={20} style={{borderRadius:20}}/></td>
                  <td><Skeleton width={100} height={12}/></td>
                  <td><Skeleton width={80} height={12}/></td>
                  <td><Skeleton width={50} height={20} style={{borderRadius:20}}/></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="11" r="5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {search ? `"${search}" bo'yicha natija topilmadi` : 'Hali foydalanuvchilar yo\'q'}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((u, i) => (
                <tr key={u.id || i}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                      <div className="avatar" style={{ flexShrink: 0 }}>
                        {u.email?.slice(0,2).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{u.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily:'monospace', fontSize: 11, color:'var(--ink-3)' }}>
                      {u.id?.slice(0,8)}…
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color:'var(--ink-2)' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('uz-Latn') : '—'}
                  </td>
                  <td>
                    <span className="badge badge-green">Faol</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 12 }}>
        Bu sahifa faqat <strong>admin</strong> rolidagi foydalanuvchilarga ko'rinadi.
        Backend: <code style={{fontSize:11, background:'var(--bg-subtle)', padding:'2px 6px', borderRadius:4}}>GET /api/users → authenticate() → authorize('admin')</code>
      </p>
    </div>
  );
}
