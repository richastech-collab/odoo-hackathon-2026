/**
 * SelectDropdown — labeled <select> with validation states.
 * options: Array<{ value: string, label: string, disabled?: boolean }>
 */
import React from 'react';

const SelectDropdown = React.forwardRef(({
  label,
  required = false,
  error,
  hint,
  id,
  options = [],
  placeholder = 'Select an option',
  value,
  onChange,
  onBlur,
  disabled = false,
  className = '',
  style,
}, ref) => {
  const selectId = id || `select-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={`d-input-wrap ${className}`} style={style}>
      {label && (
        <label
          htmlFor={selectId}
          className={`d-label ${required ? 'd-label-required' : ''}`}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`d-select ${error ? 'error' : ''}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <span style={{
          position: 'absolute', right: 12, top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none', fontSize: '0.75rem',
          color: 'var(--d-muted)',
        }}>▼</span>
      </div>
      {error && <span className="d-input-error">{error}</span>}
      {!error && hint && <span className="d-input-hint">{hint}</span>}
    </div>
  );
});

SelectDropdown.displayName = 'SelectDropdown';
export default SelectDropdown;
