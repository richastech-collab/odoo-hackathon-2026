import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="app-root" style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem' }}>🚧</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--d-text)' }}>404</div>
      <div style={{ fontSize: '1rem', color: 'var(--d-muted)', maxWidth: 360 }}>
        The page you're looking for doesn't exist or has been moved.
      </div>
      <Button onClick={() => navigate('/app/dashboard')}>← Back to Dashboard</Button>
    </div>
  );
};

export default NotFoundPage;
