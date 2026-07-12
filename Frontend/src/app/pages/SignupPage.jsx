/**
 * SignupPage — Registration UI with claymorphism style.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Background from '../../components/Background';

const ROLES = [
  { id: 'Fleet Manager',    label: 'Fleet Manager',    icon: '🎛️', color: '#7b9fe8' },
  { id: 'Driver',           label: 'Driver',           icon: '🚛', color: '#5ec49a' },
  { id: 'Safety Officer',   label: 'Safety Officer',   icon: '🛡️', color: '#f5c46b' },
  { id: 'Financial Analyst',label: 'Financial Analyst',icon: '📊', color: '#9b7ee6' },
];

const validate = ({ role, name, company, email, password }) => {
  const errors = {};
  if (!role) errors.role = 'Please select your role.';
  if (!name.trim()) errors.name = 'Full name is required.';
  if (!company.trim()) errors.company = 'Company name is required.';
  
  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return errors;
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth(); // In a real app we'd also have a `signup` function from useAuth

  const [form, setForm] = useState({ role: '', name: '', company: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user) {
      const dest = params.get('from') || '/app/dashboard';
      navigate(dest, { replace: true });
    }
  }, [user, navigate, params]);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
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
    setTouched({ role: true, name: true, company: true, email: true, password: true });

    const errs = validate(form);
    if (Object.values(errs).some(Boolean)) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError('');
    
    // MOCK SIGNUP DELAY
    await new Promise(res => setTimeout(res, 1200));
    setLoading(false);

    // In a real app, we'd log them in or send an email. For now, redirect to login with a success param.
    navigate('/login?signup=success');
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
            Create an Account
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--d-muted)', marginTop: 6 }}>
            Start digitizing your fleet today
          </p>
        </div>

        {/* Signup card */}
        <div className="d-card" style={{ 
          padding: '32px 28px',
          background: 'linear-gradient(135deg, rgba(252,249,246,0.85) 0%, rgba(242,238,252,0.80) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.82)',
        }}>
          {apiError && (
            <div className="d-alert d-alert-error" role="alert" aria-live="assertive">
              ⚠️ {apiError}
            </div>
          )}

          {/* Role Selection */}
          <div style={{ marginBottom: 20 }}>
            <label className="d-label d-label-required" style={{ marginBottom: 12, display: 'block' }}>Select your Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {ROLES.map((r) => {
                const isSelected = form.role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, role: r.id })); setErrors(e => ({ ...e, role: '' })); setTouched(t => ({...t, role: true})); }}
                    disabled={loading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 12px',
                      borderRadius: 12,
                      border: `1.5px solid ${isSelected ? r.color : 'var(--d-border)'}`,
                      background: isSelected ? `${r.color}15` : 'var(--d-surface-2)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      boxShadow: isSelected ? `0 0 0 2px ${r.color}33` : 'var(--d-shadow-sm)',
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: r.color + '22',
                      border: `1.5px solid ${r.color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', flexShrink: 0,
                    }}>
                      {r.icon}
                    </span>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-text)', lineHeight: 1.2 }}>
                      {r.label}
                    </div>
                  </button>
                );
              })}
            </div>
            {touched.role && errors.role && <span className="d-input-error" style={{ marginTop: 6, display: 'block' }}>{errors.role}</span>}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Name */}
              <div className="d-input-wrap">
                <label htmlFor="signup-name" className="d-label d-label-required">Full Name</label>
                <input
                  id="signup-name" type="text" placeholder="John Doe"
                  value={form.name} onChange={handleChange('name')} onBlur={handleBlur('name')} disabled={loading}
                  className={`d-input ${touched.name && errors.name ? 'error' : ''}`}
                />
                {touched.name && errors.name && <span className="d-input-error">{errors.name}</span>}
              </div>
              
              {/* Company */}
              <div className="d-input-wrap">
                <label htmlFor="signup-company" className="d-label d-label-required">Company</label>
                <input
                  id="signup-company" type="text" placeholder="Logistics Inc"
                  value={form.company} onChange={handleChange('company')} onBlur={handleBlur('company')} disabled={loading}
                  className={`d-input ${touched.company && errors.company ? 'error' : ''}`}
                />
                {touched.company && errors.company && <span className="d-input-error">{errors.company}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="d-input-wrap" style={{ marginBottom: 16 }}>
              <label htmlFor="signup-email" className="d-label d-label-required">Work Email</label>
              <input
                id="signup-email" type="email" placeholder="you@company.com"
                value={form.email} onChange={handleChange('email')} onBlur={handleBlur('email')} disabled={loading}
                className={`d-input ${touched.email && errors.email ? 'error' : ''}`}
              />
              {touched.email && errors.email && <span className="d-input-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="d-input-wrap" style={{ marginBottom: 24 }}>
              <label htmlFor="signup-password" className="d-label d-label-required">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password" type={showPass ? 'text' : 'password'} placeholder="Create a password (min 6 chars)"
                  value={form.password} onChange={handleChange('password')} onBlur={handleBlur('password')} disabled={loading}
                  className={`d-input ${touched.password && errors.password ? 'error' : ''}`}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button" onClick={() => setShowPass(s => !s)} disabled={loading}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem',
                    color: 'var(--d-muted)', padding: 4, lineHeight: 1,
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {touched.password && errors.password && <span className="d-input-error">{errors.password}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="d-btn d-btn-primary d-btn-lg"
              style={{ width: '100%', justifyContent: 'center', borderRadius: 14 }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff',
                    borderRadius: '50%', display: 'inline-block', animation: 'spin 0.65s linear infinite',
                  }} />
                  Creating account…
                </>
              ) : (
                <>Sign Up Free →</>
              )}
            </button>
          </form>

          {/* Switch to login */}
          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: 'var(--d-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--d-accent)', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Back to landing */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link
            to="/"
            style={{ fontSize: '0.82rem', color: 'var(--d-muted)', fontWeight: 600, textDecoration: 'none' }}
          >
            ← Back to Landing Page
          </Link>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default SignupPage;
