'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 duration-300 w-full max-w-sm">
        <div className="bg-white/90 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-sm border border-white/80 space-y-6">
          {/* Icon Container */}
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5BFD7' }}>
              <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 animate-in bounce-in-75 duration-500" strokeWidth={2} />
            </div>
          </div>

          {/* Message Content */}
          <div className="text-center space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Delete Prayer Request?</h3>
            <p className="text-xs sm:text-sm text-gray-600 text-balance leading-relaxed">
              This prayer request will be permanently removed and cannot be recovered.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent rounded-lg font-medium text-xs sm:text-sm transition-colors disabled:opacity-50"
            >
              Keep
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-xs sm:text-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
