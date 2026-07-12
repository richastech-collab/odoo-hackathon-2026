/**
 * Card — flexible surface container.
 * variant: 'default' | 'sm'
 */
import React from 'react';

const Card = ({ children, variant = 'default', className = '', style, id }) => (
  <div
    id={id}
    className={`${variant === 'sm' ? 'd-card-sm' : 'd-card'} ${className}`}
    style={style}
  >
    {children}
  </div>
);

export default Card;
