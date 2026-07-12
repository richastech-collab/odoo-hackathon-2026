import React from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import BonusStrip from './components/BonusStrip';
import HowItWorks from './components/HowItWorks';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';

function App() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      {/* Creative animated background — renders behind everything */}
      <Background />

      {/* Page content — sits above background via z-index */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Hero />
        <Features />
        <BonusStrip />
        <HowItWorks />
        <CTABanner />
        <Footer />
      </div>
    </div>
  );
}

export default App;
