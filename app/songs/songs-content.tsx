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
    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
  };

  return (
    <main className="min-h-screen bg-[#f5f0eb] py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">Worship Songs</h1>
              <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                Listen to worship songs and spiritual music shared by our community.
              </p>
            </div>
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 text-white font-semibold text-sm rounded-full min-h-10 px-5"
              style={{ backgroundColor: '#e85c1a' }}
            >
              <Plus className="w-4 h-4" />
              Upload New
            </Button>
          </div>
        </div>

        {showUpload && (
          <div className="mb-7 relative">
            <button
              onClick={() => setShowUpload(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <SongUploadForm onSongUploaded={handleSongUploaded} />
          </div>
        )}

        <SongsList refreshTrigger={refreshTrigger} />
      </div>
    </main>
  );
}