'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function ErrorModal({ isOpen, message, duration = 4000, onClose }: ErrorModalProps) {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="animate-in fade-in zoom-in-95 duration-300 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/90 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-sm border border-white/80 space-y-6 relative">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-red-100">
              <AlertCircle
                className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 animate-in bounce-in-75 duration-500"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              Validation Error
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 text-balance leading-relaxed">
              {message}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: '#FF6B6B',
                animation: `shrink ${duration}ms linear forwards`,
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}