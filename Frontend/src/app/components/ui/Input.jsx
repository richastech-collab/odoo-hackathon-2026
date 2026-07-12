/**
 * Input — labeled text input with validation states.
 * Wraps <label>, <input>, error and hint text.
 */
import React from 'react';

const Input = React.forwardRef(({
  label,
  required = false,
  error,
  hint,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  className = '',
  style,
  min,
  max,
  step,
  autoComplete,
}, ref) => {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={`d-input-wrap ${className}`} style={style}>
      {label && (
        <label
          htmlFor={inputId}
          className={`d-label ${required ? 'd-label-required' : ''}`}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        className={`d-input ${error ? 'error' : ''}`}
      />
      {error && <span className="d-input-error">{error}</span>}
      {!error && hint && <span className="d-input-hint">{hint}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
