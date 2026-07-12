import React from 'react';
import DashboardMockup from './DashboardMockup';

const Hero = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      {/* Left Content */}
      <div>
        <div className="hero-badge animate-slide-up">
          <span className="hero-badge-dot" />
          Smart Transport Platform · Version 2.0
        </div>

        <h1>
          Run your entire{' '}
          <span className="gradient-text">fleet</span>{' '}
          from one dashboard
        </h1>

        <p className="hero-sub">
          TransitOps digitizes vehicle registry, driver management, dispatch,
          maintenance workflows, and expense tracking — replacing scattered
          spreadsheets and manual logbooks with a single intelligent platform.
        </p>

        <div className="hero-ctas">
          <button
            className="clay-btn-primary"
            id="hero-get-started-btn"
            onClick={() => scrollTo('cta')}
            style={{ fontSize: '1rem', padding: '16px 32px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Get Started Free
          </button>
          <button
            className="clay-btn-secondary"
            id="hero-demo-btn"
            onClick={() => scrollTo('how-it-works')}
            style={{ fontSize: '1rem', padding: '16px 32px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            See how it works
          </button>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {[
            { num: '500+', label: 'Fleets Managed' },
            { num: '12K+', label: 'Trips Dispatched' },
            { num: '98%', label: 'Uptime SLA' },
            { num: '4.9★', label: 'User Rating' },
          ].map((stat, i) => (
            <div key={i} className="hero-stat">
              <span className="hero-stat-num">{stat.num}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Visual */}
      <div className="hero-visual">
        <div className="hero-bubble hero-bubble-1" />
        <div className="hero-bubble hero-bubble-2" />
        <div className="hero-bubble hero-bubble-3" />
        <DashboardMockup />
      </div>
    </section>
  );
};

export default Hero;
