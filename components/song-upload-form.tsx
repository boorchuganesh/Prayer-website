'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SuccessModal } from '@/components/success-modal';
import { ErrorModal } from '@/components/error-modal';
import { Upload, Music } from 'lucide-react';

interface SongUploadFormProps {
  onSongUploaded?: () => void;
}

export function SongUploadForm({ onSongUploaded }: SongUploadFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ title: '', artist: '' });

  const ALLOWED_AUDIO = ['.mp3', '.wav', '.m4a'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!ALLOWED_AUDIO.includes(fileExtension)) {
      setValidationError('Only audio files are allowed: MP3, WAV, M4A');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setValidationError('File size must be less than 100MB');
      return;
    }

    setSelectedFile(file);
    setValidationError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setValidationError('Please enter song title');
      return false;
    }
    if (formData.title.trim().length < 2) {
      setValidationError('Song title must be at least 2 characters');
      return false;
    }
    if (!formData.artist.trim()) {
      setValidationError('Please enter artist name');
      return false;
    }
    if (!selectedFile) {
      setValidationError('Please select an audio file to upload');
      return false;
    }
    return true;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedFile) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const fileBase64 = await fileToBase64(selectedFile);

      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          artist: formData.artist,
          file_data: fileBase64,
          file_name: selectedFile.name,
          file_type: fileExt,
          file_size: selectedFile.size,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setValidationError(data.error || 'Error uploading song. Please try again.');
        return;
      }

      setSubmitted(true);
      setFormData({ title: '', artist: '' });
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => {
        setSubmitted(false);
        onSongUploaded?.();
      }, 4000);
    } catch (error) {
      console.error('Error:', error);
      setValidationError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SuccessModal isOpen={submitted} message="Song Uploaded Successfully!" duration={4000} />
      <ErrorModal
        isOpen={!!validationError}
        message={validationError || ''}
        duration={4000}
        onClose={() => setValidationError(null)}
      />
      <Card className="w-full max-w-2xl mx-auto p-3 sm:p-6 md:p-8 bg-white/90 border-0 shadow-xl backdrop-blur-sm">
        <div className="mb-5 sm:mb-8 space-y-1 sm:space-y-2">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold" style={{ color: '#6c7d36' }}>
            Share a Song
          </h2>
          <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
            Share your favorite worship songs, hymns, or spiritual music with our community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
          <div>
            <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
              Song Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter song title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full text-sm sm:text-base border-gray-200 bg-white h-10 sm:h-11 px-3"
            />
          </div>

          <div>
            <label htmlFor="artist" className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
              Artist / Composer <span className="text-red-500">*</span>
            </label>
            <Input
              id="artist"
              name="artist"
              type="text"
              placeholder="Artist or composer name"
              value={formData.artist}
              onChange={handleChange}
              required
              className="w-full text-sm sm:text-base border-gray-200 bg-white h-10 sm:h-11 px-3"
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
              Upload Audio File <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                accept=".mp3,.wav,.m4a"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Music className="w-6 h-6" style={{ color: '#6c7d36' }} />
                    <span className="text-xs sm:text-sm font-medium text-gray-800">
                      {selectedFile.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs sm:text-sm border-gray-300 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 mx-auto" style={{ color: '#6c7d36' }} />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                      Click to upload audio
                    </p>
                    <p className="text-xs text-gray-600">
                      MP3, WAV, or M4A only (max 100MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Processing...</span>
                <span className="text-xs sm:text-sm font-medium text-gray-800">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${uploadProgress}%`, backgroundColor: '#6c7d36' }}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-medium py-3 sm:py-2 h-auto text-sm sm:text-base min-h-11 sm:min-h-10 touch-manipulation"
            style={{ backgroundColor: '#6c7d36' }}
          >
            {isLoading ? 'Uploading...' : 'Upload Song'}
          </Button>
        </form>
      </Card>
    </>
  );
}