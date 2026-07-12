import React from 'react';

const DashboardMockup = () => {
  const bars = [65, 82, 45, 90, 70, 55, 78, 92, 60, 85, 73, 95];
  const colors = [
    '#b5c8f0', '#a5b8e0', '#9babd4', '#8b9bc8',
    '#c5d8f0', '#aac8e8', '#9fbee0', '#94b4d8',
    '#b8d8c8', '#a8c8b8', '#98b8a8', '#88a898'
  ];

  return (
    <div className="hero-dashboard-frame">
      {/* Window controls */}
      <div className="dashboard-header">
        <span className="dashboard-title">🚌 Fleet Dashboard</span>
        <div className="dashboard-dots">
          <span style={{ background: '#f07a7a' }} />
          <span style={{ background: '#f5c46b' }} />
          <span style={{ background: '#5ec49a' }} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-kpis">
        <div className="kpi-card">
          <div className="kpi-label">Active Vehicles</div>
          <div className="kpi-value">24</div>
          <div className="kpi-sub">↑ 3 from yesterday</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Drivers On Duty</div>
          <div className="kpi-value">18</div>
          <div className="kpi-sub">2 idle, 4 off-duty</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">Trips Today</div>
          <div className="kpi-value">47</div>
          <div className="kpi-sub">↑ 12% vs last week</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Fleet Utilization</div>
          <div className="kpi-value">87%</div>
          <div className="kpi-sub amber">↑ Excellent</div>
        </div>
      </div>

      {/* Mini chart */}
      <div className="chart-bar-container">
        <div className="chart-title">Trip Volume — Last 12 Hours</div>
        <div className="chart-bars">
          {bars.map((h, i) => (
            <div
              key={i}
              className="chart-bar"
              style={{
                height: `${h}%`,
                background: `linear-gradient(180deg, ${colors[i]} 0%, ${colors[i]}99 100%)`,
                minHeight: '4px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Status rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { label: 'TRK-001 · En Route', status: 'On Time', color: 'var(--accent-mint)' },
          { label: 'TRK-004 · Maintenance', status: 'Scheduled', color: 'var(--accent-amber)' },
          { label: 'TRK-007 · Available', status: 'Ready', color: 'var(--accent-blue)' },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--card-bg)',
            borderRadius: '12px', padding: '9px 12px',
            boxShadow: 'var(--shadow-clay-sm)',
            border: '1px solid var(--card-border)',
            transition: 'all 0.3s ease',
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-dark)' }}>{row.label}</span>
            <span style={{
              padding: '3px 10px', borderRadius: '999px',
              background: `color-mix(in srgb, ${row.color} 15%, transparent)`, 
              color: row.color,
              fontSize: '0.65rem', fontWeight: '700',
              border: `1px solid color-mix(in srgb, ${row.color} 30%, transparent)`,
            }}>
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMockup;
