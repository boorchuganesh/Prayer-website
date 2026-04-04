'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Trash2 } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob, recordingTime);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('[v0] Error accessing microphone:', error);
      alert('Please allow microphone access to record prayers');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <label className="block text-xs sm:text-sm font-medium text-gray-800">
        Voice Prayer Recording <span className="text-gray-500 text-xs">(Optional)</span>
      </label>

      {!audioUrl ? (
        <div className="space-y-2 sm:space-y-3">
          {isRecording && (
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-red-700 font-medium">Recording: {formatTime(recordingTime)}</span>
            </div>
          )}

          <div className="flex gap-2">
            {!isRecording ? (
              <Button
                type="button"
                onClick={startRecording}
                className="flex-1 flex items-center justify-center gap-2 text-white font-medium text-xs sm:text-sm min-h-10 sm:min-h-11 touch-manipulation"
                style={{ backgroundColor: '#6c7d36' }}
              >
                <Mic className="w-4 h-4" />
                <span className="hidden xs:inline">Start Recording</span>
                <span className="xs:hidden">Record</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={stopRecording}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium text-xs sm:text-sm min-h-10 sm:min-h-11 touch-manipulation"
              >
                <Square className="w-4 h-4" />
                <span className="hidden xs:inline">Stop Recording</span>
                <span className="xs:hidden">Stop</span>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-800">
              Duration: {formatTime(recordingTime)}
            </span>
          </div>

          <audio
            ref={audioElementRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-8"
          />

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={playRecording}
              className="flex-1 flex items-center justify-center gap-2 text-white font-medium text-xs sm:text-sm min-h-10 sm:min-h-11 touch-manipulation"
              style={{ backgroundColor: '#6c7d36' }}
            >
              <Play className="w-4 h-4" />
              <span className="hidden xs:inline">{isPlaying ? 'Playing...' : 'Play'}</span>
              <span className="xs:hidden">{isPlaying ? 'Playing' : 'Play'}</span>
            </Button>

            <Button
              type="button"
              onClick={clearRecording}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium text-xs sm:text-sm min-h-10 sm:min-h-11 touch-manipulation"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden xs:inline">Clear</span>
              <span className="xs:hidden">Delete</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
