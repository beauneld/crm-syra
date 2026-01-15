import { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '960px',
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const blurOverlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;

      const contentRight = document.querySelector('#contentRight') as HTMLElement;
      if (contentRight) {
        contentRight.style.position = 'relative';

        const blurOverlay = document.createElement('div');
        blurOverlay.className = 'content-blur-overlay';
        blurOverlay.setAttribute('aria-hidden', 'true');
        contentRight.appendChild(blurOverlay);
        blurOverlayRef.current = blurOverlay;

        requestAnimationFrame(() => {
          blurOverlay.style.opacity = '1';
        });
      }

      document.body.style.overflow = 'hidden';

      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }

    return () => {
      if (blurOverlayRef.current) {
        const overlay = blurOverlayRef.current;
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
        }, 150);
        blurOverlayRef.current = null;
      }

      document.body.style.overflow = '';

      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (!isOpen || e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return createPortal(
    <>
      <div
        ref={backdropRef}
        className="modal-backdrop"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modalTitle' : undefined}
        style={{ maxWidth, width: `min(${maxWidth}, 96vw)` }}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modalTitle" className="modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="modal-close-btn"
                aria-label="Fermer"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </>,
    modalRoot
  );
}
