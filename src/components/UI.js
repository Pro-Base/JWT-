// ── Alert ──────────────────────────────
export function Alert({ type = 'error', children }) {
  const icons = {
    error: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    success: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 8l2.5 2.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    warning: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 6v3.5M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 7.5v4M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  };
  return (
    <div className={`alert ${type}`}>
      {icons[type]}
      <span>{children}</span>
    </div>
  );
}

// ── Field ──────────────────────────────
export function Field({ label, error, touched, hint, success, children }) {
  const showError   = touched && error;
  const showSuccess = touched && !error && success;

  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
      {showError && (
        <span className="field-msg error">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 3.5v3M6 8.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {error}
        </span>
      )}
      {showSuccess && (
        <span className="field-msg success">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {success}
        </span>
      )}
      {!showError && !showSuccess && hint && (
        <span className="field-msg hint">{hint}</span>
      )}
    </div>
  );
}

// ── Password Strength ──────────────────
export function PasswordStrength({ password }) {
  const score = getScore(password);
  const labels = ['', 'Juda zaif', 'Zaif', "O'rtacha", 'Yaxshi', 'Kuchli'];
  const cls    = ['', 'weak', 'weak', 'medium', 'strong', 'strong'];

  function getScore(p) {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)  s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 5);
  }

  if (!password) return null;

  return (
    <div>
      <div className="strength-bar">
        {[1,2,3,4,5].map(i => (
          <div
            key={i}
            className={`strength-seg ${i <= score ? cls[score] : ''}`}
          />
        ))}
      </div>
      {score > 0 && (
        <span className={`field-msg ${score < 3 ? 'error' : score < 4 ? 'hint' : 'success'}`} style={{marginTop: 4}}>
          {labels[score]}
        </span>
      )}
    </div>
  );
}

// ── Spinner ────────────────────────────
export function Spinner({ size = 16 }) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size }}
    />
  );
}

// ── Skeleton ───────────────────────────
export function Skeleton({ width, height = 16, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, ...style }}
    />
  );
}

// ── Avatar ─────────────────────────────
export function Avatar({ email, size = 'sm' }) {
  const initials = email ? email.slice(0, 2).toUpperCase() : 'U';
  return (
    <div className={`avatar ${size === 'lg' ? 'lg' : ''}`}>
      {initials}
    </div>
  );
}

// ── ThemeToggle ────────────────────────
export function ThemeToggle({ isDark, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} title={isDark ? "Yorug' rejim" : "Qorong'i rejim"}>
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M14 9.5A6 6 0 016.5 2a6 6 0 100 12 6 6 0 007.5-4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}
