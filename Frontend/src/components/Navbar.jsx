import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} style={{ opacity: scrolled ? 0.97 : 1 }}>
      {/* Logo */}
      <div className="navbar-logo">
        <div className="navbar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="4" rx="2" fill="white" />
            <circle cx="7" cy="17" r="2.5" fill="white" />
            <circle cx="17" cy="17" r="2.5" fill="white" />
            <path d="M3 13V9a2 2 0 0 1 2-2h10l3 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span>TransitOps</span>
      </div>

      {/* Nav links */}
      <div className="navbar-links">
        <button className="navbar-link" onClick={() => scrollTo('features')}>Features</button>
        <button className="navbar-link" onClick={() => scrollTo('how-it-works')}>How it Works</button>
        <button className="navbar-link" onClick={() => scrollTo('about')}>About</button>
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        <button className="navbar-signin" id="nav-signin-btn" onClick={() => scrollTo('cta')}>Sign In</button>
        <button className="navbar-get-started" id="nav-get-started-btn" onClick={() => scrollTo('cta')}>Get Started</button>
        {/* Hamburger for mobile */}
        <button
          className="navbar-hamburger"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          left: 0, right: 0,
          background: 'linear-gradient(135deg, rgba(249,246,242,0.97) 0%, rgba(237,232,227,0.97) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1.5px solid rgba(255,255,255,0.75)',
          boxShadow: 'var(--shadow-clay-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {['Features', 'How it Works', 'About'].map((item, i) => (
            <button
              key={i}
              className="navbar-link"
              style={{ textAlign: 'left', width: '100%', borderRadius: '14px' }}
              onClick={() => scrollTo(['features', 'how-it-works', 'about'][i])}
            >
              {item}
            </button>
          ))}
          <div style={{ height: '1px', background: 'rgba(163,145,175,0.2)', margin: '8px 0' }} />
          <button className="clay-btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '14px' }} onClick={() => scrollTo('cta')}>
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
