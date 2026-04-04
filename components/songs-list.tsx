'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Music, File, Play, Pause, Download, Trash2, ImageIcon, Film } from 'lucide-react';
import { SongViewerModal } from '@/components/song-viewer-modal';

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

interface SongsListProps {
  refreshTrigger?: number;
}

export function SongsList({ refreshTrigger = 0 }: SongsListProps = {}) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/songs');
      const data = await res.json();
      if (!res.ok) { console.error('Error fetching songs:', data.error); return; }
      setSongs(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSong = useCallback(async (songId: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    setDeletingId(songId);
    try {
      const res = await fetch('/api/songs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: songId }),
      });
      if (res.ok) {
        setSongs(prev => prev.filter(s => s.id !== songId));
      } else {
        alert('Error deleting song. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handlePlay = useCallback((song: Song) => {
    const isAudio = ['mp3', 'wav', 'm4a'].includes(song.file_type);
    if (!isAudio) return;
    if (playingId === song.id && audioRef && !audioRef.paused) {
      audioRef.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef && !audioRef.paused) audioRef.pause();
    const audio = new Audio(song.file_data);
    audio.play().catch(err => console.error('Error playing audio:', err));
    setAudioRef(audio);
    setPlayingId(song.id);
    audio.onended = () => setPlayingId(null);
  }, [playingId, audioRef]);

  useEffect(() => { fetchSongs(); }, [refreshTrigger]);

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') return <File className="w-5 h-5 text-[#e85c1a]" />;
    if (['jpg', 'jpeg', 'png'].includes(fileType)) return <ImageIcon className="w-5 h-5 text-[#e85c1a]" />;
    if (fileType === 'mp4') return <Film className="w-5 h-5 text-[#e85c1a]" />;
    return <Music className="w-5 h-5 text-[#e85c1a]" />;
  };

  const isAudioFile = (fileType: string) => ['mp3', 'wav', 'm4a'].includes(fileType);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 min-h-40">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#e85c1a]" />
          <p className="text-sm text-gray-500">Loading songs...</p>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <Card className="w-full p-10 bg-white border-0 shadow-sm rounded-2xl text-center">
        <p className="text-gray-500">No songs yet. Be the first to share!</p>
      </Card>
    );
  }

  return (
    <>
      <SongViewerModal song={selectedSong!} isOpen={!!selectedSong} onClose={() => setSelectedSong(null)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {songs.map(song => (
          <Card key={song.id} className="p-4 sm:p-5 bg-white border-0 shadow-md hover:shadow-lg transition-shadow rounded-2xl">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                  {getFileIcon(song.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{song.title}</h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-block px-2 py-0.5 rounded-md bg-orange-100 text-[#e85c1a] font-semibold">
                  {song.file_type?.toUpperCase()}
                </span>
                <span>{formatFileSize(song.file_size)}</span>
              </div>

              <div className="flex gap-2">
                {isAudioFile(song.file_type) && (
                  <Button onClick={() => handlePlay(song)} size="sm"
                    className="flex-1 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1"
                    style={{ backgroundColor: '#e85c1a' }}
                    disabled={deletingId === song.id}>
                    {playingId === song.id ? <><Pause className="w-3.5 h-3.5" /><span>Pause</span></> : <><Play className="w-3.5 h-3.5" /><span>Play</span></>}
                  </Button>
                )}
                <Button onClick={() => setSelectedSong(song)} size="sm"
                  className="flex-1 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1"
                  style={{ backgroundColor: '#e85c1a' }}
                  disabled={deletingId === song.id}>
                  <Download className="w-3.5 h-3.5" /><span>Open</span>
                </Button>
                <Button onClick={() => deleteSong(song.id)} size="sm"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1"
                  disabled={deletingId === song.id}>
                  {deletingId === song.id ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Deleting</span></>
                  ) : (
                    <><Trash2 className="w-3.5 h-3.5" /><span>Delete</span></>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}