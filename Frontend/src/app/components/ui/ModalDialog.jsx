/**
 * ModalDialog — fully accessible modal with backdrop, animation, header, body, footer.
 *
 * Props:
 *   open      {boolean}    — controls visibility
 *   onClose   {function}   — called when overlay or × is clicked
 *   title     {string}     — modal heading
 *   size      {string}     — 'sm' | 'default' | 'lg' | 'xl'
 *   children  {ReactNode}  — modal body content
 *   footer    {ReactNode}  — optional footer content (overrides default close btn)
 *   hideClose {boolean}    — hides the × button when true
 */
import React, { useEffect, useCallback } from 'react';

const sizeClass = {
  sm:      'd-modal-sm',
  default: '',
  lg:      'd-modal-lg',
  xl:      'd-modal-xl',
};

const ModalDialog = ({
  open,
  onClose,
  title,
  size = 'default',
  children,
  footer,
  hideClose = false,
}) => {
  // Close on Escape key
  const handleKey = useCallback(
    (e) => { if (e.key === 'Escape' && open) onClose(); },
    [open, onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    // Lock body scroll when modal is open
    if (open) document.body.style.overflow = 'hidden';
    else       document.body.style.overflow = '';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div
      className="d-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`d-modal ${sizeClass[size]}`}>
        {/* Header */}
        <div className="d-modal-header">
          <h2 id="modal-title" className="d-modal-title">{title}</h2>
          {!hideClose && (
            <button
              className="d-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="d-modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="d-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default ModalDialog;
