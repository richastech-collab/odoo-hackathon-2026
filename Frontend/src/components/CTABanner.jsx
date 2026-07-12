import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section" id="cta">
    <div className="cta-banner">
      {/* Floating decorative orbs */}
      <div style={{
        position: 'absolute', width: '120px', height: '120px',
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-purple) 20%, transparent), color-mix(in srgb, var(--accent-blue) 15%, transparent))',
        borderRadius: '50%',
        top: '20px', right: '15%',
        border: '1.5px solid var(--card-border)',
        boxShadow: 'var(--shadow-clay-sm)',
        animation: 'float 5s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '72px', height: '72px',
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-mint) 25%, transparent), color-mix(in srgb, var(--accent-mint) 10%, transparent))',
        borderRadius: '50%',
        bottom: '30px', left: '12%',
        border: '1.5px solid var(--card-border)',
        boxShadow: 'var(--shadow-clay-sm)',
        animation: 'float 4s ease-in-out infinite 1s',
        pointerEvents: 'none',
      }} />

      <h2>Ready to digitize your fleet operations?</h2>
      <p>
        Join hundreds of logistics companies who've replaced their spreadsheets
        with TransitOps. Start free — no credit card required.
      </p>
      <div className="cta-buttons">
        <button 
          className="clay-btn-primary" 
          id="cta-signup-btn" 
          onClick={() => navigate('/signup')}
          style={{ fontSize: '1rem', padding: '16px 36px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Sign Up Free
        </button>
        <button 
          className="clay-btn-secondary" 
          id="cta-signin-btn" 
          onClick={() => navigate('/login')}
          style={{ fontSize: '1rem', padding: '16px 36px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Sign In
        </button>
      </div>

      {/* Trust badges */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '24px',
        marginTop: '36px', flexWrap: 'wrap',
      }}>
        {[
          { icon: '🔒', label: 'Enterprise Security' },
          { icon: '⚡', label: '99.8% Uptime' },
          { icon: '🆓', label: 'Free 30-Day Trial' },
          { icon: '📞', label: '24/7 Support' },
        ].map((badge, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 16px',
            background: 'var(--card-bg)',
            borderRadius: '999px',
            border: '1.5px solid var(--card-border)',
            boxShadow: 'var(--shadow-clay-sm)',
            fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dark)',
          }}>
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default CTABanner;
