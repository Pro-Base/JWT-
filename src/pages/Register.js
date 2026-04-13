import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useFormValidation, rules } from '../hooks/useFormValidation';
import { Alert, Field, PasswordStrength } from '../components/UI';

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass]   = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation(
      { email: '', password: '', confirmPassword: '', role: 'user' },
      {
        email:           [rules.email],
        password:        [rules.strongPassword],
        confirmPassword: [rules.required, rules.match('password', 'Parol')],
        role:            [rules.required],
      }
    );

  const onSubmit = handleSubmit(async (vals) => {
    setApiError('');
    setSubmitting(true);
    try {
      await api.post('/auth/register', {
        email:    vals.email,
        password: vals.password,
        role:     vals.role,
      });
      navigate('/login?registered=1');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Ro\'yxatdan o\'tishda xatolik');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="auth-root">
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
          <p className="side-eyebrow">Yangi hisob</p>
          <h1 className="side-title">Bir marta,<br/>xavfsiz</h1>
          <p className="side-desc">
            Parolingiz bcrypt bilan shifrlangan holda saqlanadi. Hech kim asl parolingizni ko'ra olmaydi.
          </p>
        </div>

        <div className="side-tags">
          {['UUID Primary Key', 'bcrypt Hash', '7 kun sessiya', 'Rol tizimi'].map(t => (
            <span key={t} className="side-tag">{t}</span>
          ))}
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-box">
          <div className="auth-box-head">
            <h2>Hisob yaratish</h2>
            <p>Allaqachon hisobingiz bormi? <Link to="/login" className="auth-link">Kiring</Link></p>
          </div>

          {apiError && <Alert type="error">{apiError}</Alert>}

          <form onSubmit={onSubmit} noValidate>
            <div className="form-stack">

              <Field
                label="Email manzil"
                error={errors.email}
                touched={touched.email}
                success={touched.email && !errors.email && values.email ? "Yaxshi ✓" : null}
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
                    value={values.email} onChange={handleChange} onBlur={handleBlur}
                    placeholder="user@example.com"
                    autoComplete="email"
                  />
                </div>
              </Field>

              <Field
                label="Parol"
                error={errors.password}
                touched={touched.password}
                hint="Kamida 8 belgi, 1 katta harf, 1 raqam"
              >
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </span>
                  <input
                    className={`field-input ${touched.password && errors.password ? 'error' : touched.password && !errors.password && values.password ? 'success' : ''}`}
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={values.password} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Kuchli parol kiriting"
                    autoComplete="new-password"
                  />
                  <span className="field-suffix">
                    <button type="button" className="eye-btn" onClick={() => setShowPass(s => !s)}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M1.5 7.5s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/>
                        <circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                    </button>
                  </span>
                </div>
                <PasswordStrength password={values.password} />
              </Field>

              <Field
                label="Parolni tasdiqlash"
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                success={touched.confirmPassword && !errors.confirmPassword ? 'Mos keldi ✓' : null}
              >
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    className={`field-input ${touched.confirmPassword && errors.confirmPassword ? 'error' : touched.confirmPassword && !errors.confirmPassword && values.confirmPassword ? 'success' : ''}`}
                    type="password" name="confirmPassword"
                    value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Parolni qayta kiriting"
                    autoComplete="new-password"
                  />
                </div>
              </Field>

              <Field label="Rol" error={errors.role} touched={touched.role}>
                <select
                  className="field-select" name="role"
                  value={values.role} onChange={handleChange} onBlur={handleBlur}
                >
                  <option value="user">Foydalanuvchi (user)</option>
                  <option value="admin">Administrator (admin)</option>
                </select>
              </Field>

              <button
                type="submit"
                className={`btn btn-primary ${submitting ? 'loading' : ''}`}
                disabled={submitting}
                style={{ marginTop: 4 }}
              >
                {submitting ? (
                  <><span className="spinner" style={{borderTopColor:'white'}}/> Saqlanmoqda…</>
                ) : (
                  <>
                    Hisob yaratish
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
