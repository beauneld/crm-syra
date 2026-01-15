import { useEffect } from 'react';
import { X, Undo2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onUndo?: () => void;
  onClose: () => void;
  autoCloseDelay?: number;
}

export default function Toast({
  message,
  isVisible,
  onUndo,
  onClose,
  autoCloseDelay = 5000
}: ToastProps) {
  useEffect(() => {
    if (isVisible && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[200] animate-slide-up">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4 min-w-[320px] max-w-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {onUndo && (
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <button
              onClick={onUndo}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Undo2 className="w-4 h-4" />
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
