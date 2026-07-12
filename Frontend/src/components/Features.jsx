import React from 'react';

const features = [
  {
    icon: '🔐',
    title: 'Secure Auth & RBAC',
    desc: 'Role-based login for Fleet Manager, Driver, Safety Officer & Financial Analyst. JWT-secured with granular permissions.',
    color: 'var(--accent-purple)',
  },
  {
    icon: '📊',
    title: 'Live Dashboard',
    desc: 'Real-time KPIs: active & available vehicles, ongoing trips, drivers on duty, and fleet utilization percentage.',
    color: 'var(--accent-blue)',
  },
  {
    icon: '🚛',
    title: 'Vehicle Registry',
    desc: 'Manage the full vehicle lifecycle — load capacity, odometer readings, maintenance status, and registration docs.',
    color: 'var(--accent-mint)',
  },
  {
    icon: '👤',
    title: 'Driver Management',
    desc: 'Track licenses, expiry dates, safety scores, certifications, and real-time duty status for every driver.',
    color: 'var(--accent-amber)',
  },
  {
    icon: '🗺️',
    title: 'Trip Management',
    desc: 'Dispatch trips with automatic validation — vehicle availability, driver assignment, and route conflict checks.',
    color: 'var(--accent-coral)',
  },
  {
    icon: '🔧',
    title: 'Maintenance Workflow',
    desc: 'Automatic vehicle status switching, scheduled service tracking, and zero-manual maintenance log management.',
    color: 'var(--accent-mint)',
  },
  {
    icon: '⛽',
    title: 'Fuel & Expense Tracking',
    desc: 'Log fuel fills, operational costs, and expenses per trip. Automatic cost-per-km and ROI computation.',
    color: 'var(--accent-purple)',
  },
  {
    icon: '📈',
    title: 'Reports & Analytics',
    desc: 'Fuel efficiency, utilization trends, ROI metrics, driver performance scores, and one-click CSV export.',
    color: 'var(--accent-blue)',
  },
];

const Features = () => (
  <section className="features-section" id="features">
    <div className="features-header">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="section-label">✨ Core Features</div>
      </div>
      <h2 className="section-heading" style={{ textAlign: 'center' }}>
        Everything your fleet operations need
      </h2>
      <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
        Eight powerful modules, all in one cohesive platform. No more juggling
        between spreadsheets, WhatsApp groups, and paper logbooks.
      </p>
    </div>

    <div className="features-grid">
      {features.map((f, i) => (
        <div
          key={i}
          className="feature-card"
          style={{ background: `color-mix(in srgb, ${f.color} 8%, var(--card-bg))` }}
          id={`feature-card-${i}`}
        >
          <div
            className="feature-icon-wrap"
            style={{ background: f.color }}
          >
            <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
          </div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;
