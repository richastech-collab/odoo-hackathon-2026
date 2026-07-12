/**
 * Badge — coloured status pill.
 * variant: 'success'|'warning'|'danger'|'info'|'purple'|'neutral'
 */
import React from 'react';

const Badge = ({ children, variant = 'neutral', className = '', style }) => (
  <span
    className={`d-badge d-badge-${variant} ${className}`}
    style={style}
  >
    {children}
  </span>
);

export default Badge;
