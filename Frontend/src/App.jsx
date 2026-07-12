import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Landing page (Phase 0 — complete)
import Background  from './components/Background';
import Navbar      from './components/Navbar';
import Hero        from './components/Hero';
import Features    from './components/Features';
import BonusStrip  from './components/BonusStrip';
import HowItWorks  from './components/HowItWorks';
import CTABanner   from './components/CTABanner';
import Footer      from './components/Footer';

// Auth (Phase 2)
import { AuthProvider } from './app/context/AuthContext';

// Dashboard app (Phase 1+)
import AppRouter from './app/router/AppRouter';

import CustomCursor from './components/CustomCursor';

// Dashboard CSS
import './app.css';

/* ── Landing Page ───────────────────────────────────────────── */
const LandingPage = ({ darkMode, toggleDarkMode }) => (
  <div style={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
    <Background />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <Hero />
      <Features />
      <BonusStrip />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </div>
  </div>
);

/* ── Root ───────────────────────────────────────────────────── */
function App() {
  const [darkMode, setDarkMode] = React.useState(() => {
    return localStorage.getItem('transitops-dark') === 'true';
  });

  React.useEffect(() => {
    localStorage.setItem('transitops-dark', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(d => !d);

  return (
    <BrowserRouter>
      <CustomCursor />
      {/*
        AuthProvider wraps the entire tree so both the landing-page CTA buttons
        ("Get Started" → /login) and the internal app share the same auth state.
      */}
      <AuthProvider>
        <Routes>
          {/* Landing page — public */}
          <Route path="/" element={<LandingPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />

          {/* All /login and /app/* routes */}
          <Route path="/*" element={<AppRouter darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
