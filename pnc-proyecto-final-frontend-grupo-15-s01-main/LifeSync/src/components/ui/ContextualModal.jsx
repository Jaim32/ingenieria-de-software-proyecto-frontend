import React, { useEffect, useRef } from 'react';
import Icon from '../AppIcon';

const ContextualModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true 
}) => {
  const modalRef = useRef(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Focus management
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleBackdropClick = (event) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      // Trap focus within modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabIndex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop transition-modal"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="modal-content transition-modal">
        <div 
          ref={modalRef}
          className={`
            relative w-full ${sizeClasses[size]} bg-surface rounded-lg shadow-xl 
            transform transition-all duration-300 max-h-[90vh] overflow-hidden
            sm:rounded-lg
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border">
              {title && (
                <h2 
                  id="modal-title" 
                  className="text-xl font-semibold text-text-primary"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-all duration-150"
                  aria-label="Close modal"
                >
                  <Icon name="X" size={20} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

// Confirmation Modal Component
export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary" // primary, warning, error
}) => {
  const variantClasses = {
    primary: 'btn-primary',
    warning: 'bg-warning text-white hover:bg-warning-700',
    error: 'bg-error text-white hover:bg-error-700'
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <ContextualModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnBackdrop={false}
      showCloseButton={false}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${variant === 'error' ? 'bg-error-100' : variant === 'warning' ? 'bg-warning-100' : 'bg-primary-100'}
          `}>
            <Icon 
              name={variant === 'error' ? 'AlertTriangle' : variant === 'warning' ? 'AlertCircle' : 'HelpCircle'} 
              size={20} 
              color={variant === 'error' ? '#DC2626' : variant === 'warning' ? '#D97706' : '#2563EB'}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-primary">{title}</h3>
          </div>
        </div>
        
        <p className="text-text-secondary mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ContextualModal>
  );
};

export default ContextualModal;