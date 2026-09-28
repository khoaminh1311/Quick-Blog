import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, description, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 bg-black/20"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        role="dialog"
        data-state="open"
        tabIndex={-1}
        aria-modal="true"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-2xl dark:bg-slate-900 focus:outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="lucide-x h-4 w-4" />
        </button>

        {title && (
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">
            {title}
          </h2>
        )}

        {description && (
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.node,
  children: PropTypes.node,
};
