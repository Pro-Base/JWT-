import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFormValidation, rules } from '../hooks/useFormValidation';
import { Alert, Field } from '../components/UI';

export default function Login() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [params]     = useSearchParams();
  const [apiError, setApiError]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass]   = useState(false);

  const expired    = params.get('expired');
  const registered = params.get('registered');

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation(
      { email: '', password: '' },
      {
        email:    [rules.email],
        password: [rules.required],
      }
    );

  const onSubmit = handleSubmit(async (vals) => {
    setApiError('');
    setSubmitting(true);
    try {
      await login(vals.email, vals.password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="auth-root">
      {/* Chap panel */}
      <aside className="auth-side">
        <div className="side-logo">
          <div className="logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8a4 4 0 018 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="11" r="2" fill="white"/>
            </svg>
          </div>
          SecureAuth
        </div>

        <div className="side-hero">
          <p className="side-eyebrow">Xavfsiz kirish</p>
          <h1 className="side-title">Himoyalangan<br/>sessiya</h1>
          <p className="side-desc">
            JWT tokenlar, httpOnly cookie va silent refresh — sanoat darajasidagi autentifikatsiya.
          </p>
        </div>

        <div className="side-tags">
          {['JWT Bearer', 'bcrypt × 12', 'httpOnly Cookie', 'Silent Refresh', 'Rate Limit'].map(t => (
            <span key={t} className="side-tag">{t}</span>
          ))}
        </div>
      </aside>

      {/* O'ng panel */}
      <main className="auth-main">
        <div className="auth-box">
          <div className="auth-box-head">
            <h2>Xush kelibsiz</h2>
            <p>Hisobingiz yo'qmi? <Link to="/register" className="auth-link">Ro'yxatdan o'ting</Link></p>
          </div>

          {expired && (
            <Alert type="warning">Sessiya muddati o'tdi. Qayta kiring.</Alert>
          )}
          {registered && (
            <Alert type="success">Hisob yaratildi! Kiring.</Alert>
          )}
          {apiError && <Alert type="error">{apiError}</Alert>}

          <form onSubmit={onSubmit} noValidate>
            <div className="form-stack">
              <Field
                label="Email manzil"
                error={errors.email}
                touched={touched.email}
                success={touched.email && !errors.email && values.email ? "To'g'ri format" : null}
              >
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M1.5 6l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </span>
                  <input
                    className={`field-input ${touched.email && errors.email ? 'error' : touched.email && !errors.email && values.email ? 'success' : ''}`}
                    type="email" name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="user@example.com"
                    autoComplete="email"
                  />
                </div>
              </Field>

              <Field
                label="Parol"
                error={errors.password}
                touched={touched.password}
              >
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </span>
                  <input
                    className={`field-input ${touched.password && errors.password ? 'error' : ''}`}
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Parolingiz"
                    autoComplete="current-password"
                  />
                  <span className="field-suffix">
                    <button type="button" className="eye-btn" onClick={() => setShowPass(s => !s)}>
                      {showPass ? (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M1.5 7.5s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/>
                          <circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M2 2l11 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M1.5 7.5s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/>
                          <circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                      )}
                    </button>
                  </span>
                </div>
              </Field>

              <button
                type="submit"
                className={`btn btn-primary ${submitting ? 'loading' : ''}`}
                disabled={submitting}
                style={{ marginTop: 4 }}
              >
                {submitting ? (
                  <><span className="spinner" style={{borderTopColor:'white'}}/> Tekshirilmoqda…</>
                ) : (
                  <>
                    Kirish
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
