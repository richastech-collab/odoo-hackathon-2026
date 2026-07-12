import React from 'react';

const Footer = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="about">
      <div className="footer-inner">
        {/* Logo */}
        <div className="footer-logo">
          <div className="footer-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="4" rx="2" fill="white" />
              <circle cx="7" cy="17" r="2.5" fill="white" />
              <circle cx="17" cy="17" r="2.5" fill="white" />
              <path d="M3 13V9a2 2 0 0 1 2-2h10l3 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span>TransitOps</span>
        </div>

        {/* Links */}
        <div className="footer-links">
          <button className="footer-link" onClick={() => scrollTo('features')}>Features</button>
          <button className="footer-link" onClick={() => scrollTo('how-it-works')}>How it Works</button>
          <button className="footer-link" onClick={() => scrollTo('cta')}>Get Started</button>
          <button className="footer-link" onClick={() => scrollTo('cta')}>Sign In</button>
          <button className="footer-link">Privacy Policy</button>
        </div>

        {/* Copyright */}
        <span className="footer-copy">
          © 2026 TransitOps · All rights reserved
        </span>
      </div>

      {/* Tagline */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <span style={{
          fontSize: '0.78rem', color: '#b5afc7', fontWeight: '500',
        }}>
          Built for logistics teams who demand clarity, speed, and control 🚌
        </span>
      </div>
    </footer>
  );
};

export default Footer;
