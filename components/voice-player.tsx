'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoicePlayerProps {
  voiceUrl: string;
  duration: number;
}

export function VoicePlayer({ voiceUrl, duration }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#F5BFD7' }}>
        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0" />
        <span className="text-xs sm:text-sm text-gray-800 font-medium truncate">Voice Prayer Recording</span>
      </div>

      <audio
        ref={audioRef}
        src={voiceUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
        <Button
          type="button"
          onClick={handlePlayPause}
          size="sm"
          className="flex-shrink-0 text-white font-medium text-xs sm:text-sm h-9 sm:h-10 w-9 sm:w-10 min-h-9 sm:min-h-10 touch-manipulation flex items-center justify-center"
          style={{ backgroundColor: '#6c7d36' }}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <div className="flex-1 flex items-center gap-1 sm:gap-2 min-w-0">
          <span className="text-xs text-gray-600 flex-shrink-0 font-medium">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 h-2 bg-gray-300 rounded-full relative cursor-pointer hover:h-2.5 transition-all">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(currentTime / duration) * 100}%`,
                backgroundColor: '#6c7d36',
              }}
            />
          </div>
          <span className="text-xs text-gray-600 flex-shrink-0 font-medium">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
