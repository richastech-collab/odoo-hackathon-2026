/**
 * Button — reusable button with variants, sizes, loading & icon support.
 * Variants: 'primary' | 'secondary' | 'danger' | 'ghost'
 * Sizes:    'sm' | 'md' | 'lg' | 'icon'
 */
import React from 'react';

const variantClass = {
  primary:   'd-btn-primary',
  secondary: 'd-btn-secondary',
  danger:    'd-btn-danger',
  ghost:     'd-btn-ghost',
};

const sizeClass = {
  sm:   'd-btn-sm',
  md:   '',
  lg:   'd-btn-lg',
  icon: 'd-btn-icon',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  onClick,
  className = '',
  style,
  id,
}) => (
  <button
    id={id}
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`d-btn ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    style={style}
  >
    {loading ? (
      <span style={{
        width: 14, height: 14,
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.65s linear infinite',
        flexShrink: 0,
      }} />
    ) : leftIcon}
    {children && <span>{children}</span>}
    {!loading && rightIcon}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </button>
);

export default Button;
