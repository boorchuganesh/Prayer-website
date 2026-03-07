'use client';

import { useState } from 'react';
import { SongsList } from '@/components/songs-list';
import { SongUploadForm } from '@/components/song-upload-form';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export function SongsContent() {
  const [showUpload, setShowUpload] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSongUploaded = () => {
    setShowUpload(false);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3" style={{ color: '#6c7d36' }}>
                Worship Songs
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                Listen to worship songs and spiritual music shared by our community.
              </p>
            </div>
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 text-white font-medium text-xs sm:text-sm rounded-lg min-h-10 sm:min-h-11 touch-manipulation px-3 sm:px-4"
              style={{ backgroundColor: '#6c7d36' }}
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{showUpload ? 'Cancel' : 'Upload New'}</span>
              <span className="sm:hidden">{showUpload ? <X className="w-4 h-4" /> : 'Add'}</span>
            </Button>
          </div>
        </div>

        {/* ✅ Songs List FIRST — always visible at top */}
        <SongsList refreshTrigger={refreshTrigger} />

        {/* Upload Form — appears below the list when toggled */}
        {showUpload && (
          <div className="mt-8 bg-white/90 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#6c7d36' }}>
                Upload a Song
              </h2>
              <Button
                onClick={() => setShowUpload(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <SongUploadForm onSongUploaded={handleSongUploaded} />
          </div>
        )}

      </div>
    </main>
  );
}