'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SuccessModal } from '@/components/success-modal';
import { ErrorModal } from '@/components/error-modal';
import { Upload, Music, File } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validExtensions = ['.mp3', '.wav', '.m4a', '.pdf', '.jpg', '.jpeg', '.png', '.mp4'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setValidationError('Please upload: Audio (mp3, wav, m4a), Video (mp4), Images (jpg, png), or PDF');
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
    if (!formData.title.trim()) { setValidationError('Please enter song title'); return false; }
    if (formData.title.trim().length < 2) { setValidationError('Song title must be at least 2 characters'); return false; }
    if (!formData.artist.trim()) { setValidationError('Please enter artist name'); return false; }
    if (!selectedFile) { setValidationError('Please select a file to upload'); return false; }
    return true;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
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
      const fileBase64 = await fileToBase64(selectedFile);
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          artist: formData.artist,
          file_data: fileBase64,
          file_name: selectedFile.name,
          file_type: selectedFile.name.split('.').pop()?.toLowerCase(),
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
      setTimeout(() => { setSubmitted(false); onSongUploaded?.(); }, 4000);
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
      <ErrorModal isOpen={!!validationError} message={validationError || ''} duration={4000} onClose={() => setValidationError(null)} />

      <Card className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white border-0 shadow-xl rounded-2xl">
        <div className="mb-6 space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#e85c1a] flex items-center justify-center">
              <span className="text-white text-sm">🎵</span>
            </div>
            <span className="text-[#e85c1a] font-bold text-sm">FaithyBites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Share a Song</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Share your favorite worship songs, hymns, or spiritual music with our community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Song Title <span className="text-[#e85c1a]">*</span>
            </label>
            <Input id="title" name="title" type="text" placeholder="Enter song title"
              value={formData.title} onChange={handleChange} required
              className="w-full border-gray-200 bg-gray-50 h-11" />
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Artist / Composer <span className="text-[#e85c1a]">*</span>
            </label>
            <Input id="artist" name="artist" type="text" placeholder="Artist or composer name"
              value={formData.artist} onChange={handleChange} required
              className="w-full border-gray-200 bg-gray-50 h-11" />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Upload File <span className="text-[#e85c1a]">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#e85c1a] hover:bg-orange-50/50 transition-colors"
            >
              <input ref={fileInputRef} id="file" type="file"
                accept=".mp3,.wav,.m4a,.pdf,.jpg,.jpeg,.png,.mp4"
                onChange={handleFileSelect} className="hidden" />
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {selectedFile.type.includes('audio') ? (
                      <Music className="w-6 h-6 text-[#e85c1a]" />
                    ) : (
                      <File className="w-6 h-6 text-[#e85c1a]" />
                    )}
                    <span className="text-sm font-semibold text-gray-800">{selectedFile.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button type="button" size="sm" variant="outline"
                    className="text-xs border-gray-300 bg-transparent rounded-lg"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                    Change File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-10 h-10 mx-auto text-[#e85c1a]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">Audio (MP3, WAV, M4A), Video (MP4), Images, PDF (max 100MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Processing...</span>
                <span className="text-xs font-semibold text-gray-700">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all bg-[#e85c1a]" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <Button type="submit" disabled={isLoading}
            className="w-full text-white font-bold h-12 text-base rounded-xl"
            style={{ backgroundColor: '#e85c1a' }}>
            {isLoading ? 'Uploading...' : 'Upload Song'}
          </Button>
        </form>
      </Card>
    </>
  );
}