'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Play, Pause, Volume2, Download, ImageIcon, Film } from 'lucide-react';

interface SongViewerModalProps {
  song: {
    id: string;
    title: string;
    artist: string;
    file_data: string;
    file_name: string;
    file_type: string;
    created_at: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function SongViewerModal({ song, isOpen, onClose }: SongViewerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen || !song) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Download file from base64
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = song.file_data;
    link.download = song.file_name || `${song.title}.${song.file_type}`;
    link.click();
  };

  const isImage = ['jpg', 'jpeg', 'png'].includes(song.file_type);
  const isAudio = ['mp3', 'wav', 'm4a'].includes(song.file_type);
  const isVideo = song.file_type === 'mp4';
  const isPdf = song.file_type === 'pdf';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 border-0 shadow-2xl rounded-2xl">

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold truncate" style={{ color: '#6c7d36' }}>
              {song.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{song.artist}</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

          {isPdf && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">📄 PDF Document</p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <iframe
                  src={song.file_data}
                  className="w-full h-96 sm:h-[500px] border border-gray-300 rounded-lg"
                  title={song.title}
                />
              </div>
              <Button
                onClick={handleDownload}
                className="w-full text-white font-medium text-xs sm:text-sm"
                style={{ backgroundColor: '#6c7d36' }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}

          {isImage && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-600 font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Image
              </p>
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center min-h-64">
                <img
                  src={song.file_data}
                  alt={song.title}
                  className="w-full h-full object-contain max-h-[500px]"
                />
              </div>
              <Button
                onClick={handleDownload}
                className="w-full text-white font-medium text-xs sm:text-sm"
                style={{ backgroundColor: '#6c7d36' }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>
          )}

          {isVideo && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-600 font-medium flex items-center gap-2">
                <Film className="w-4 h-4" /> Worship Video
              </p>
              <div className="bg-black rounded-lg overflow-hidden border border-gray-300">
                <video
                  controls
                  className="w-full h-auto max-h-[500px]"
                  src={song.file_data}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <Button
                onClick={handleDownload}
                className="w-full text-white font-medium text-xs sm:text-sm"
                style={{ backgroundColor: '#6c7d36' }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </Button>
            </div>
          )}

          {isAudio && (
            <div className="space-y-4 sm:space-y-6">
              <div
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg"
                style={{ backgroundColor: '#F5BFD7' }}
              >
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: '#6c7d36' }} />
                <span className="text-xs sm:text-sm font-medium text-gray-800">
                  Audio Worship Song
                </span>
              </div>

              <audio
                ref={audioRef}
                src={song.file_data}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                onEnded={() => setIsPlaying(false)}
              />

              <Button
                onClick={handlePlayPause}
                className="text-white font-medium text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8 touch-manipulation flex items-center gap-2"
                style={{ backgroundColor: '#6c7d36' }}
              >
                {isPlaying ? (
                  <><Pause className="w-5 h-5 sm:w-6 sm:h-6" /><span>Pause</span></>
                ) : (
                  <><Play className="w-5 h-5 sm:w-6 sm:h-6" /><span>Play</span></>
                )}
              </Button>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                      backgroundColor: '#6c7d36',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                className="w-full text-white font-medium text-xs sm:text-sm"
                style={{ backgroundColor: '#6c7d36' }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Audio
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}