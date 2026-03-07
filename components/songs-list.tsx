'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Music, Play, Pause, Trash2 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  file_data: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface SongsListProps {
  refreshTrigger?: number;
}

function Toast({ toasts, onRemove }: { toasts: ToastMessage[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all animate-in slide-in-from-right-5 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function SongsList({ refreshTrigger = 0 }: SongsListProps = {}) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastCounter = useRef(0);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = ++toastCounter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/songs');
      const data = await res.json();
      if (!res.ok) {
        console.error('Error fetching songs:', data.error);
        return;
      }
      setSongs(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSong = useCallback(
    async (songId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setDeletingId(songId);
      try {
        const res = await fetch('/api/songs', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: songId }),
        });

        if (res.ok) {
          setSongs(prev => prev.filter(s => s.id !== songId));
          if (playingId === songId) {
            audioRef.current?.pause();
            audioRef.current = null;
            setPlayingId(null);
          }
          addToast('Song deleted successfully', 'success');
        } else {
          addToast('Error deleting song. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        addToast('An error occurred. Please try again.', 'error');
      } finally {
        setDeletingId(null);
      }
    },
    [playingId, addToast]
  );

  const handlePlay = useCallback(
  async (song: Song) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // If tapping the same song, just stop it
    if (playingId === song.id) {
      setPlayingId(null);
      return;
    }

    setPlayingId(song.id); // show loading state immediately

    try {
      // Fetch full song data (with file_data) only now
      const res = await fetch(`/api/songs/${song.id}`);
      if (!res.ok) {
        addToast('Could not load song. Please try again.', 'error');
        setPlayingId(null);
        return;
      }
      const data = await res.json();
      const fullSong = data.data;

      if (!fullSong?.file_data) {
        addToast('Audio data missing. Please re-upload this song.', 'error');
        setPlayingId(null);
        return;
      }

      let src = fullSong.file_data;
      if (!src.startsWith('data:')) {
        src = `data:audio/${fullSong.file_type};base64,${src}`;
      }

      const audio = new Audio(src);
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        addToast(`Error playing song: ${err.message}`, 'error');
        setPlayingId(null);
      });
      audioRef.current = audio;
      audio.onended = () => setPlayingId(null);
    } catch (err) {
      console.error('Error loading song:', err);
      addToast('Failed to load song.', 'error');
      setPlayingId(null);
    }
  },
  [playingId, addToast]
);

  useEffect(() => {
    fetchSongs();
  }, [refreshTrigger, fetchSongs]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 min-h-40">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <Loader2
            className="w-8 sm:w-10 h-8 sm:h-10 animate-spin"
            style={{ color: '#6c7d36' }}
          />
          <p className="text-xs sm:text-sm text-gray-600">Loading songs...</p>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <Card className="w-full p-6 sm:p-8 bg-white/90 border-0 shadow-xl text-center">
        <p className="text-gray-600">No songs yet. Be the first to share!</p>
      </Card>
    );
  }

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {songs.map(song => {
          const isPlaying = playingId === song.id;
          return (
            <Card
              key={song.id}
              className="p-3 sm:p-4 md:p-5 bg-white/90 border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="space-y-3 sm:space-y-4">
                {/* Header */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: isPlaying ? '#6c7d36' : '#CAEFD7' }}
                  >
                    <Music
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      style={{ color: isPlaying ? 'white' : '#6c7d36' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-xs sm:text-sm font-bold truncate"
                      style={{ color: '#6c7d36' }}
                    >
                      {song.title}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">{song.artist}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatFileSize(song.file_size)} · {song.file_type?.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                <Button
  onClick={() => handlePlay(song)}
  size="sm"
  className="flex-1 text-white font-medium text-xs sm:text-sm min-h-10 sm:min-h-9 touch-manipulation flex items-center justify-center gap-1.5"
  style={{ backgroundColor: '#6c7d36' }}
  disabled={deletingId === song.id}
>
  {isPlaying ? (
    <>
      {/* Show spinner while audio is loading but not yet playing */}
      {!audioRef.current ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Pause className="w-4 h-4" />
      )}
      <span>{!audioRef.current ? 'Loading...' : 'Pause'}</span>
    </>
  ) : (
    <>
      <Play className="w-4 h-4" />
      <span>Play</span>
    </>
  )}
</Button>
                  <Button
                    onClick={e => deleteSong(song.id, e)}
                    size="sm"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium text-xs sm:text-sm min-h-10 sm:min-h-9 touch-manipulation flex items-center justify-center gap-1.5"
                    disabled={deletingId === song.id}
                  >
                    {deletingId === song.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">Deleting</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Animated bar when playing */}
                {isPlaying && (
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: '#6c7d36',
                        width: '100%',
                        animation: 'pulse 1.5s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}