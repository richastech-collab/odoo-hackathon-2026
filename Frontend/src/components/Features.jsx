import React from 'react';

const features = [
  {
    icon: '🔐',
    title: 'Secure Auth & RBAC',
    desc: 'Role-based login for Fleet Manager, Driver, Safety Officer & Financial Analyst. JWT-secured with granular permissions.',
    gradient: 'linear-gradient(135deg, #f2eefb 0%, #e9e4f6 100%)',
    iconBg: 'linear-gradient(135deg, #9b7ee6 0%, #7b6ed6 100%)',
  },
  {
    icon: '📊',
    title: 'Live Dashboard',
    desc: 'Real-time KPIs: active & available vehicles, ongoing trips, drivers on duty, and fleet utilization percentage.',
    gradient: 'linear-gradient(135deg, #e8f0fb 0%, #d8e8f8 100%)',
    iconBg: 'linear-gradient(135deg, #6b9bdf 0%, #5b8bcf 100%)',
  },
  {
    icon: '🚛',
    title: 'Vehicle Registry',
    desc: 'Manage the full vehicle lifecycle — load capacity, odometer readings, maintenance status, and registration docs.',
    gradient: 'linear-gradient(135deg, #e8f7f1 0%, #d8f0e8 100%)',
    iconBg: 'linear-gradient(135deg, #5ec49a 0%, #4eb48a 100%)',
  },
  {
    icon: '👤',
    title: 'Driver Management',
    desc: 'Track licenses, expiry dates, safety scores, certifications, and real-time duty status for every driver.',
    gradient: 'linear-gradient(135deg, #fef9ee 0%, #fdf0d5 100%)',
    iconBg: 'linear-gradient(135deg, #f5c46b 0%, #e5b45b 100%)',
  },
  {
    icon: '🗺️',
    title: 'Trip Management',
    desc: 'Dispatch trips with automatic validation — vehicle availability, driver assignment, and route conflict checks.',
    gradient: 'linear-gradient(135deg, #fdeef0 0%, #fce0e3 100%)',
    iconBg: 'linear-gradient(135deg, #f07a7a 0%, #e06a6a 100%)',
  },
  {
    icon: '🔧',
    title: 'Maintenance Workflow',
    desc: 'Automatic vehicle status switching, scheduled service tracking, and zero-manual maintenance log management.',
    gradient: 'linear-gradient(135deg, #eef8f2 0%, #ddf0e8 100%)',
    iconBg: 'linear-gradient(135deg, #5ec49a 0%, #3ab480 100%)',
  },
  {
    icon: '⛽',
    title: 'Fuel & Expense Tracking',
    desc: 'Log fuel fills, operational costs, and expenses per trip. Automatic cost-per-km and ROI computation.',
    gradient: 'linear-gradient(135deg, #f0eef8 0%, #e4dff0 100%)',
    iconBg: 'linear-gradient(135deg, #9b7ee6 0%, #8b6ed6 100%)',
  },
  {
    icon: '📈',
    title: 'Reports & Analytics',
    desc: 'Fuel efficiency, utilization trends, ROI metrics, driver performance scores, and one-click CSV export.',
    gradient: 'linear-gradient(135deg, #e8f4fb 0%, #d8ecf8 100%)',
    iconBg: 'linear-gradient(135deg, #6b9bdf 0%, #4b7bbf 100%)',
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
          style={{ background: f.gradient }}
          id={`feature-card-${i}`}
        >
          <div
            className="feature-icon-wrap"
            style={{ background: f.iconBg }}
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
