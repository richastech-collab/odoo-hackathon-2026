import React from 'react';

const STEPS = [
  {
    num: '01',
    icon: '📝',
    color: '#7b9fe8',
    bg: 'linear-gradient(135deg, #e8f0fb 0%, #d8e8f8 100%)',
    title: 'Sign Up & Set Your Role',
    desc: 'Create your account in seconds and choose your role — Fleet Manager, Driver, Safety Officer, or Financial Analyst. Each role gets a tailored dashboard.',
  },
  {
    num: '02',
    icon: '🚘',
    color: '#5ec49a',
    bg: 'linear-gradient(135deg, #e8f7f1 0%, #d8f0e8 100%)',
    title: 'Add Your Vehicles & Drivers',
    desc: 'Register your fleet vehicles and drivers in one place. Set statuses, assign licenses, track safety scores — all from a single clean interface.',
  },
  {
    num: '03',
    icon: '🗺️',
    color: '#9b7ee6',
    bg: 'linear-gradient(135deg, #f2eefb 0%, #e9e4f6 100%)',
    title: 'Plan & Dispatch Trips',
    desc: 'Create a trip, assign a vehicle and driver, and dispatch with one click. TransitOps automatically updates vehicle and driver statuses in real time.',
  },
  {
    num: '04',
    icon: '🔧',
    color: '#f5a623',
    bg: 'linear-gradient(135deg, #fef9ee 0%, #fdf0d5 100%)',
    title: 'Track Maintenance & Costs',
    desc: 'Log maintenance requests, fuel expenses, and tolls on the go. The system auto-calculates your operational cost per trip so you\'re always in control.',
  },
  {
    num: '05',
    icon: '📊',
    color: '#e8567c',
    bg: 'linear-gradient(135deg, #fdeef0 0%, #fce0e3 100%)',
    title: 'Analyze & Improve',
    desc: 'Get instant insights on fleet utilization, driver performance, and profitability — right on your dashboard. Export reports anytime with a click.',
  },
];

const HowItWorks = () => (
  <section className="hiw-section" id="how-it-works">
    {/* Header */}
    <div className="hiw-header" style={{ marginBottom: '56px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <div className="section-label">✨ Simple 5-Step Process</div>
      </div>
      <h2 className="section-heading" style={{ textAlign: 'center' }}>
        Up and running in{' '}
        <span className="gradient-text">minutes</span>
      </h2>
      <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto', maxWidth: 520 }}>
        No training needed. From signup to full fleet visibility in 5 easy steps.
      </p>
    </div>

    {/* Steps */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      maxWidth: '780px',
      margin: '0 auto',
      padding: '0 16px',
      position: 'relative',
    }}>
      {/* Vertical connector line */}
      <div style={{
        position: 'absolute',
        left: '52px',
        top: '60px',
        bottom: '60px',
        width: '2px',
        background: 'linear-gradient(to bottom, #7b9fe8, #5ec49a, #9b7ee6, #f5a623, #e8567c)',
        opacity: 0.25,
        borderRadius: '2px',
      }} />

      {STEPS.map((step, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            padding: '20px 0',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Step badge */}
          <div style={{
            flexShrink: 0,
            width: '68px',
            height: '68px',
            borderRadius: '22px',
            background: step.bg,
            border: `2px solid ${step.color}33`,
            boxShadow: `6px 6px 16px ${step.color}22, -4px -4px 12px rgba(255,255,255,0.8)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
          }}>
            <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>{step.icon}</div>
            <div style={{
              fontSize: '0.55rem',
              fontWeight: 800,
              color: step.color,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {step.num}
            </div>
          </div>

          {/* Content card */}
          <div
            className="clay-card"
            style={{
              flex: 1,
              padding: '20px 24px',
              background: 'linear-gradient(135deg, rgba(252,249,246,0.9) 0%, rgba(242,238,252,0.75) 100%)',
              border: `1.5px solid ${step.color}22`,
              borderLeft: `3px solid ${step.color}66`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(6px)';
              e.currentTarget.style.boxShadow = `8px 8px 24px ${step.color}20, -4px -4px 14px rgba(255,255,255,0.8)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '8px',
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--text-primary, #2d2640)',
                lineHeight: 1.2,
              }}>
                {step.title}
              </h3>
              <div style={{
                flexShrink: 0,
                padding: '2px 10px',
                borderRadius: '999px',
                background: step.color + '18',
                border: `1px solid ${step.color}44`,
                fontSize: '0.65rem',
                fontWeight: 700,
                color: step.color,
                letterSpacing: '0.05em',
              }}>
                Step {step.num}
              </div>
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.88rem',
              color: 'var(--text-muted, #7b718e)',
              lineHeight: 1.65,
            }}>
              {step.desc}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom CTA hint */}
    <div style={{
      textAlign: 'center',
      marginTop: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    }}>
      {['🚀 Free to start', '⚡ No setup fees', '📞 24/7 support'].map((item, i) => (
        <div key={i} style={{
          padding: '8px 18px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.6)',
          border: '1.5px solid rgba(255,255,255,0.8)',
          boxShadow: '4px 4px 12px rgba(163,145,175,0.15), -3px -3px 10px rgba(255,255,255,0.7)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#2d2640',
        }}>
          {item}
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
