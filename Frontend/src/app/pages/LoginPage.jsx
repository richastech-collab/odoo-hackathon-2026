/**
 * LoginPage — Phase 2 full authentication UI.
 *
 * Features:
 *  - Email + Password form with field-level validation
 *  - "Show/hide password" toggle
 *  - Loading state on submit (spinner in button)
 *  - API error banner (wrong credentials)
 *  - Redirects to `?from=` URL or /app/dashboard after success
 *  - Quick-fill role cards for easy demo access
 *  - Fully responsive, claymorphism-adjacent style consistent with the app
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Background from '../../components/Background';

/* ── Quick-fill demo users ───────────────────────────────────── */
const DEMO_USERS = [
  { role: 'Fleet Manager',    email: 'fm@transitops.com',      password: 'fleet123', icon: '🎛️', color: '#7b9fe8' },
  { role: 'Driver',           email: 'driver@transitops.com',  password: 'drive123', icon: '🚛', color: '#5ec49a' },
  { role: 'Safety Officer',   email: 'safety@transitops.com',  password: 'safe123',  icon: '🛡️', color: '#f5c46b' },
  { role: 'Financial Analyst',email: 'finance@transitops.com', password: 'fin123',   icon: '📊', color: '#9b7ee6' },
];

/* ── Validation ──────────────────────────────────────────────── */
const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters.';
  }
  return errors;
};

const LoginPage = () => {
  const navigate        = useNavigate();
  const [params]        = useSearchParams();
  const { login, user } = useAuth();

  const [form, setForm]           = useState({ email: '', password: '' });
  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [touched, setTouched]     = useState({});

  // If already logged in, skip login page
  useEffect(() => {
    if (user) {
      const dest = params.get('from') || '/app/dashboard';
      navigate(dest, { replace: true });
    }
  }, [user, navigate, params]);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    // Clear field error on type
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
    if (apiError) setApiError('');
  };

  const handleBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate(form);
    setErrors((e) => ({ ...e, [field]: errs[field] || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const errs = validate(form);
    if (Object.values(errs).some(Boolean)) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError('');
    const result = await login(form.email, form.password);
    setLoading(false);

    if (!result.success) {
      setApiError(result.error);
      return;
    }

    const dest = params.get('from') || '/app/dashboard';
    navigate(dest, { replace: true });
  };

  const quickFill = async (demo) => {
    setForm({ email: demo.email, password: demo.password });
    setErrors({});
    setApiError('');
    setTouched({});

    setLoading(true);
    const result = await login(demo.email, demo.password);
    setLoading(false);

    if (!result.success) {
      setApiError(result.error);
      return;
    }

    const dest = params.get('from') || '/app/dashboard';
    navigate(dest, { replace: true });
  };

  return (
    <div
      className="app-root"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shared animated background from landing page */}
      <Background />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Logo & brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60,
            background: 'linear-gradient(135deg, #7b9fe8, #9b7ee6)',
            borderRadius: 20,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
            boxShadow: '8px 8px 20px rgba(107,143,216,0.4), -6px -6px 14px rgba(255,255,255,0.75)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="4" rx="2" fill="white" />
              <circle cx="7" cy="17" r="2.5" fill="white" />
              <circle cx="17" cy="17" r="2.5" fill="white" />
              <path d="M3 13V9a2 2 0 0 1 2-2h10l3 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--d-text)', margin: 0 }}>
            Welcome to TransitOps
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--d-muted)', marginTop: 6 }}>
            Smart Transport Operations Platform
          </p>
        </div>

        {/* Login card */}
        <div className="d-card" style={{ 
          padding: '32px 28px',
          background: 'linear-gradient(135deg, rgba(252,249,246,0.85) 0%, rgba(242,238,252,0.80) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.82)',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--d-text)', marginBottom: 24 }}>
            Sign in to your account
          </h2>

          {/* API error banner */}
          {apiError && (
            <div className="d-alert d-alert-error" role="alert" aria-live="assertive">
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="d-input-wrap" style={{ marginBottom: 16 }}>
              <label htmlFor="login-email" className="d-label d-label-required">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                disabled={loading}
                className={`d-input ${touched.email && errors.email ? 'error' : ''}`}
                aria-describedby={errors.email ? 'email-err' : undefined}
                aria-invalid={!!errors.email}
              />
              {touched.email && errors.email && (
                <span id="email-err" className="d-input-error" role="alert">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="d-input-wrap" style={{ marginBottom: 24 }}>
              <label htmlFor="login-password" className="d-label d-label-required">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  disabled={loading}
                  className={`d-input ${touched.password && errors.password ? 'error' : ''}`}
                  style={{ paddingRight: 44 }}
                  aria-describedby={errors.password ? 'pass-err' : undefined}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  disabled={loading}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '1rem',
                    color: 'var(--d-muted)',
                    padding: 4,
                    lineHeight: 1,
                  }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {touched.password && errors.password && (
                <span id="pass-err" className="d-input-error" role="alert">{errors.password}</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="d-btn d-btn-primary d-btn-lg"
              style={{ width: '100%', justifyContent: 'center', borderRadius: 14 }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.65s linear infinite',
                  }} />
                  Signing in…
                </>
              ) : (
                <>Sign In →</>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1.5px solid var(--d-border)',
          }}>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--d-muted)', marginBottom: 10,
            }}>
              Quick Demo Access
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => quickFill(demo)}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '9px 12px',
                    borderRadius: 12,
                    border: '1.5px solid var(--d-border)',
                    background: 'var(--d-surface-2)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    boxShadow: 'var(--d-shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = demo.color + '66';
                    e.currentTarget.style.background = demo.color + '0d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--d-border)';
                    e.currentTarget.style.background = 'var(--d-surface-2)';
                  }}
                >
                  <span style={{
                    width: 28, height: 28,
                    borderRadius: 8,
                    background: demo.color + '22',
                    border: `1.5px solid ${demo.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', flexShrink: 0,
                  }}>
                    {demo.icon}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-text)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {demo.role}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--d-muted)', lineHeight: 1 }}>
                      Click to login
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back to landing */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link
            to="/"
            style={{
              fontSize: '0.82rem', color: 'var(--d-muted)',
              fontWeight: 600, textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--d-accent)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--d-muted)'}
          >
            ← Back to Landing Page
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.72rem', color: 'var(--d-light)' }}>
          © 2026 TransitOps · All rights reserved
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;
