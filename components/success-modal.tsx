'use client';

import { useEffect } from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  message?: string;
  duration?: number;
}

export function SuccessModal({ isOpen, message = 'Prayer Request Submitted!', duration = 3000 }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        // Component will be removed by parent when isOpen becomes false
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 duration-300 w-full max-w-sm">
        <div className="bg-white/90 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-sm border border-white/80">
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Icon Container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CAEFD7' }}>
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-in bounce-in-75 duration-500" strokeWidth={3} />
            </div>

            {/* Message Content */}
            <div className="text-center space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 text-balance">{message}</h3>
              <p className="text-xs sm:text-sm text-gray-600">Our community is praying for you</p>
            </div>

            {/* Progress Indicator */}
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full animate-in" 
                style={{ 
                  backgroundColor: '#6c7d36',
                  animation: `shrink ${duration}ms linear forwards`
                }}
              />
            </div>
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
