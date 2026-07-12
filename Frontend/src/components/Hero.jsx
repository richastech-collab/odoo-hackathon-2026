import TruckIllustration from './TruckIllustration';

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

      </div>

      {/* Right Visual */}
      <div className="hero-visual">
        <TruckIllustration />
      </div>

      {/* Stats (Full width at bottom) */}
      <div className="hero-stats">
        {[
          { icon: '🚛', num: '650+', label: 'Vehicles' },
          { icon: '👤', num: '120+', label: 'Drivers' },
          { icon: '🗺️', num: '1,250+', label: 'Trips' },
          { icon: '⏱️', num: '99.8%', label: 'Uptime' },
        ].map((stat, i) => (
          <div key={i} className="hero-stat animate-slide-up" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
            <div className="hero-stat-icon">{stat.icon}</div>
            <div className="hero-stat-content">
              <span className="hero-stat-num">{stat.num}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
