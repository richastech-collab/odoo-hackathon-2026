/**
 * TruckIllustration — Hero visual using the generated 3D clay truck image.
 * Faded on the left side to blend seamlessly into the background.
 */
import React from 'react';

const TruckIllustration = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      /* Make it bleed to the right side if needed */
      marginRight: '-5%',
    }}
  >
    <div
      style={{
        position: 'relative',
        width: '120%',
        maxWidth: 700,
        aspectRatio: '1 / 1',
        /* Apply a linear gradient mask to fade out the left side, blending with background */
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%)',
        animation: 'truckFloat 6s ease-in-out infinite',
      }}
    >
      <img
        src="/hero-truck.png"
        alt="TransitOps fleet truck on the road"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          /* Slightly round corners on the right if needed, though bleeding usually means hiding them */
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
        }}
        draggable={false}
      />
    </div>

    {/* Styles */}
    <style>{`
      @keyframes truckFloat {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-12px); }
      }
    `}</style>
  </div>
);

export default TruckIllustration;
