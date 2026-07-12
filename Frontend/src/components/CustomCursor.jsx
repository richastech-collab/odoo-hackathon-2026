import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [angle, setAngle] = useState(0);
  const [isPointer, setIsPointer] = useState(false);
  const requestRef = useRef();
  const previousPos = useRef({ x: -100, y: -100 });
  
  // Smooth out the rotation
  const currentAngle = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Calculate angle based on movement direction
      const dx = clientX - previousPos.current.x;
      const dy = clientY - previousPos.current.y;
      
      // Only update angle if moved a significant amount to prevent jitter
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        // atan2 gives angle in radians, 0 is right (East). 
        // Our SVG car points UP by default, so we need to add 90 degrees offset.
        let targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        
        // Handle 360 degree wrap-around for smooth shortest-path rotation
        let delta = targetAngle - currentAngle.current;
        delta = ((delta + 180) % 360) - 180;
        if (delta < -180) delta += 360;
        
        currentAngle.current += delta;
        setAngle(currentAngle.current);
      }

      previousPos.current = { x: clientX, y: clientY };
      setPosition({ x: clientX, y: clientY });

      // Check if hovering over a clickable element
      const target = e.target;
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a');
        
      setIsPointer(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const isVisible = position.x !== -100 && position.y !== -100;

  return (
    <>
      <style>{`
        /* Hide default cursor on desktop, keep it on inputs */
        @media (pointer: fine) {
          body, a, button, h1, h2, h3, p, div {
            cursor: none !important;
          }
          input, textarea {
            cursor: text !important;
          }
        }
      `}</style>
      
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0,
            pointerEvents: 'none',
            zIndex: 99999,
            // Translate the container to mouse position
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          {/* Glowing ring under the car when hovering a button */}
          <div
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 0})`,
              width: 48, height: 48,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(155, 126, 230, 0.4) 0%, rgba(155, 126, 230, 0) 70%)',
              boxShadow: isPointer ? '0 0 20px rgba(155, 126, 230, 0.6)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              opacity: isPointer ? 1 : 0,
            }}
          />

          {/* The Claymorphism Car SVG */}
          <div
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              // Center the car and apply the driving rotation
              transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${isPointer ? 1.15 : 1})`,
              transition: 'transform 0.15s linear',
              width: 32, height: 48,
              filter: 'drop-shadow(3px 8px 6px rgba(155, 126, 230, 0.35)) drop-shadow(-2px -2px 4px rgba(255, 255, 255, 0.8))',
            }}
          >
            <svg viewBox="0 0 64 96" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bba8ef" />
                  <stop offset="100%" stopColor="#8b72d4" />
                </linearGradient>
                <linearGradient id="carRoof" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d8cce8" />
                  <stop offset="100%" stopColor="#a690e6" />
                </linearGradient>
                <linearGradient id="windshield" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8ebff" />
                  <stop offset="100%" stopColor="#80c8f5" />
                </linearGradient>
              </defs>

              {/* Wheels */}
              <rect x="4" y="16" width="8" height="20" rx="4" fill="#2d2640" />
              <rect x="52" y="16" width="8" height="20" rx="4" fill="#2d2640" />
              <rect x="4" y="60" width="8" height="20" rx="4" fill="#2d2640" />
              <rect x="52" y="60" width="8" height="20" rx="4" fill="#2d2640" />

              {/* Main Body */}
              <rect x="10" y="4" width="44" height="88" rx="16" fill="url(#carBody)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
              
              {/* Hood highlight */}
              <rect x="14" y="6" width="36" height="12" rx="6" fill="rgba(255,255,255,0.3)" />

              {/* Windshield */}
              <path d="M 16 28 Q 32 20 48 28 L 50 36 L 14 36 Z" fill="url(#windshield)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <rect x="18" y="26" width="12" height="4" rx="2" fill="rgba(255,255,255,0.6)" transform="rotate(-10 18 26)" />

              {/* Roof (Clay inflated look) */}
              <rect x="16" y="38" width="32" height="44" rx="8" fill="url(#carRoof)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              
              {/* Rear Window */}
              <rect x="20" y="80" width="24" height="6" rx="2" fill="url(#windshield)" opacity="0.8" />

              {/* Headlights */}
              <circle cx="20" cy="10" r="4" fill="#fffbe6" filter="drop-shadow(0 -4px 8px rgba(255,230,120,0.8))" />
              <circle cx="44" cy="10" r="4" fill="#fffbe6" filter="drop-shadow(0 -4px 8px rgba(255,230,120,0.8))" />
              
              {/* Tail lights */}
              <rect x="16" y="88" width="8" height="3" rx="1.5" fill="#ff5a5a" filter="drop-shadow(0 4px 6px rgba(255,90,90,0.6))" />
              <rect x="40" y="88" width="8" height="3" rx="1.5" fill="#ff5a5a" filter="drop-shadow(0 4px 6px rgba(255,90,90,0.6))" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomCursor;
