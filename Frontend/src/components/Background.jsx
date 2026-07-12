import React from 'react';

/* ================================================================
   CREATIVE BACKGROUND — TransitOps
   Layers (bottom → top):
   1. Base gradient  — warm lavender-to-mint sweep
   2. Animated aurora blobs — 5 slow-morphing radial blobs
   3. Dot-grid overlay  — subtle moving grid
   4. Shimmer streak — periodic diagonal light sweep
   5. Sparkle stars — 12 tiny twinkling stars
   ================================================================ */

const sparkles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  top: `${8 + Math.floor(((i * 73) % 84))}%`,
  left: `${5 + Math.floor(((i * 59) % 90))}%`,
  size: 4 + (i % 4),
  delay: (i * 0.7).toFixed(1),
  duration: (3 + (i % 4)).toFixed(1),
  color: ['#9b7ee6', '#6b9bdf', '#5ec49a', '#f5c46b', '#f07a7a'][i % 5],
}));

const Background = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}
  >
    {/* ── Layer 1: Warm gradient base ─────────────────────────── */}
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        linear-gradient(
          145deg,
          var(--bg-lavender) 0%,
          var(--bg-sky) 25%,
          var(--bg-mint) 50%,
          var(--bg-cream) 75%,
          var(--bg-lavender) 100%
        )`,
      transition: 'background 0.3s ease',
    }} />

    {/* ── Layer 2a: Aurora blob — purple top-left ─────────────── */}
    <div style={{
      position: 'absolute',
      width: '680px', height: '680px',
      top: '-180px', left: '-180px',
      background: 'radial-gradient(circle at 40% 40%, rgba(155,126,230,0.28) 0%, rgba(107,155,223,0.14) 45%, transparent 75%)',
      filter: 'blur(60px)',
      animation: 'blob-morph-1 18s ease-in-out infinite',
    }} />

    {/* ── Layer 2b: Aurora blob — sky blue top-right ──────────── */}
    <div style={{
      position: 'absolute',
      width: '600px', height: '600px',
      top: '-100px', right: '-150px',
      background: 'radial-gradient(circle at 55% 45%, rgba(107,155,223,0.24) 0%, rgba(94,196,154,0.12) 50%, transparent 75%)',
      filter: 'blur(55px)',
      animation: 'blob-morph-2 22s ease-in-out infinite 3s',
    }} />

    {/* ── Layer 2c: Aurora blob — mint bottom-left ────────────── */}
    <div style={{
      position: 'absolute',
      width: '520px', height: '520px',
      bottom: '5%', left: '-100px',
      background: 'radial-gradient(circle at 40% 60%, rgba(94,196,154,0.22) 0%, rgba(155,126,230,0.10) 50%, transparent 75%)',
      filter: 'blur(50px)',
      animation: 'blob-morph-3 20s ease-in-out infinite 6s',
    }} />

    {/* ── Layer 2d: Aurora blob — amber center-right ──────────── */}
    <div style={{
      position: 'absolute',
      width: '400px', height: '400px',
      top: '35%', right: '8%',
      background: 'radial-gradient(circle at 50% 50%, rgba(245,196,107,0.18) 0%, rgba(240,122,122,0.08) 55%, transparent 78%)',
      filter: 'blur(48px)',
      animation: 'blob-morph-1 25s ease-in-out infinite 9s',
    }} />

    {/* ── Layer 2e: Aurora blob — coral bottom-right ──────────── */}
    <div style={{
      position: 'absolute',
      width: '360px', height: '360px',
      bottom: '12%', right: '-80px',
      background: 'radial-gradient(circle at 50% 50%, rgba(240,122,122,0.16) 0%, rgba(245,196,107,0.08) 55%, transparent 78%)',
      filter: 'blur(44px)',
      animation: 'blob-morph-2 28s ease-in-out infinite 12s',
    }} />

    {/* ── Layer 3: Moving dot grid ─────────────────────────────── */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(circle, rgba(130,100,200,0.13) 1.2px, transparent 1.2px)',
      backgroundSize: '48px 48px',
      animation: 'grid-pan 8s linear infinite',
    }} />

    {/* ── Layer 4: Diagonal shimmer streak ────────────────────── */}
    <div style={{
      position: 'absolute',
      top: 0, left: 0,
      width: '160px', height: '100vh',
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 60%, transparent 100%)',
      filter: 'blur(6px)',
      animation: 'shimmer-streak 9s ease-in-out infinite',
    }} />

    {/* ── Layer 5: Sparkle stars ───────────────────────────────── */}
    {sparkles.map((s) => (
      <div
        key={s.id}
        style={{
          position: 'absolute',
          top: s.top, left: s.left,
          width: `${s.size}px`, height: `${s.size}px`,
          background: s.color,
          borderRadius: '50%',
          boxShadow: `0 0 ${s.size * 3}px ${s.color}, 0 0 ${s.size * 6}px ${s.color}55`,
          animation: `sparkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
        }}
      />
    ))}

    {/* ── Decorative ring — top center ────────────────────────── */}
    <div style={{
      position: 'absolute',
      width: '280px', height: '280px',
      top: '8%', left: '50%',
      transform: 'translateX(-50%)',
      border: '1.5px solid rgba(155,126,230,0.15)',
      borderRadius: '50%',
      animation: 'breathe 7s ease-in-out infinite 1s',
    }} />
    <div style={{
      position: 'absolute',
      width: '440px', height: '440px',
      top: '4%', left: '50%',
      transform: 'translateX(-50%)',
      border: '1px solid rgba(107,155,223,0.1)',
      borderRadius: '50%',
      animation: 'breathe 9s ease-in-out infinite 3s',
    }} />
  </div>
);

export default Background;
