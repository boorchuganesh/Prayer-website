'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
  isDangerous = true,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const confirmColor = isDangerous ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600';
  const confirmBgColor = isDangerous ? '#FF6B6B' : '#3B82F6';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 duration-300 w-full max-w-sm relative">
        <div className="bg-white/95 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm border border-white/80 space-y-6">
          {/* Icon Container */}
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: isDangerous ? '#FEE2E2' : '#E0E7FF' }}>
              <AlertCircle
                className="w-8 h-8 sm:w-10 sm:h-10 animate-in bounce-in-75 duration-500"
                strokeWidth={2}
                style={{ color: isDangerous ? '#DC2626' : '#2563EB' }}
              />
            </div>
          </div>

          {/* Message Content */}
          <div className="text-center space-y-2 sm:space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 text-balance leading-relaxed">{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 text-gray-700 border-gray-300 font-medium text-sm sm:text-base min-h-11 touch-manipulation bg-transparent"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 text-white font-medium text-sm sm:text-base min-h-11 touch-manipulation ${confirmColor}`}
            >
              {isLoading ? 'Deleting...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
