'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, ImageIcon, Trash2, Eye, X, Download, Plus } from 'lucide-react';

interface FellowshipImage {
  id: string;
  title: string;
  location: string;
  file_data: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export function StreetFellowshipContent() {
  const [images, setImages] = useState<FellowshipImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [viewingImage, setViewingImage] = useState<FellowshipImage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState({ title: '', location: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/fellowship-images');
      const data = await res.json();
      setImages(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      setFormError('Only JPG, PNG, or WEBP images allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormError('Image must be under 10MB');
      return;
    }
    setSelectedFile(file);
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) { setFormError('Title is required'); return; }
    if (!selectedFile) { setFormError('Please select an image'); return; }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      setUploadProgress(60);

      const res = await fetch('/api/fellowship-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          location: formData.location,
          file_data: base64,
          file_name: selectedFile.name,
          file_type: selectedFile.name.split('.').pop()?.toLowerCase(),
          file_size: selectedFile.size,
        }),
      });

      setUploadProgress(90);
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Upload failed');
        setUploadProgress(0);
        return;
      }

      setUploadProgress(100);
      showToast('Image uploaded successfully!', 'success');
      setFormData({ title: '', location: '' });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowUpload(false);
      setTimeout(() => { setUploadProgress(0); fetchImages(); }, 500);
    } catch (e) {
      setFormError('An error occurred. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch('/api/fellowship-images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
        if (viewingImage?.id === id) setViewingImage(null);
        showToast('Image deleted', 'success');
      } else {
        showToast('Error deleting image', 'error');
      }
    } catch {
      showToast('An error occurred', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '';
    const mb = bytes / 1024 / 1024;
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <main className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto">

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
            {toast.message}
          </div>
        )}

        {/* View Modal */}
        {viewingImage && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
                <div>
                  <h2 className="font-bold text-lg" style={{ color: '#6c7d36' }}>{viewingImage.title}</h2>
                  {viewingImage.location && <p className="text-sm text-gray-500">{viewingImage.location}</p>}
                </div>
                <button onClick={() => setViewingImage(null)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <img
                  src={viewingImage.file_data}
                  alt={viewingImage.title}
                  className="w-full rounded-xl object-contain max-h-[500px] bg-gray-50"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = viewingImage.file_data;
                      link.download = viewingImage.file_name || `${viewingImage.title}.${viewingImage.file_type}`;
                      link.click();
                    }}
                    className="flex-1 text-white text-sm"
                    style={{ backgroundColor: '#6c7d36' }}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                  <Button
                    onClick={() => handleDelete(viewingImage.id)}
                    disabled={deletingId === viewingImage.id}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm"
                  >
                    {deletingId === viewingImage.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4 mr-2" />Delete</>}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ color: '#6c7d36' }}>
                Street Fellowship
              </h1>
              <p className="text-xs sm:text-base text-gray-700 leading-relaxed">
                Photos from our street outreach and fellowship moments.
              </p>
            </div>
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 text-white font-medium text-xs sm:text-sm rounded-lg min-h-10 sm:min-h-11 px-3 sm:px-4"
              style={{ backgroundColor: '#6c7d36' }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{showUpload ? 'Cancel' : 'Add Photo'}</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Image Grid - FIRST */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#6c7d36' }} />
          </div>
        ) : images.length === 0 ? (
          <Card className="p-8 text-center bg-white/90 border-0 shadow-xl">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-600">No photos yet. Share your first street fellowship moment!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {images.map(img => (
              <div key={img.id} className="group relative rounded-xl overflow-hidden shadow-md bg-gray-100 aspect-square">
                <img
                  src={img.file_data}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-end">
                  <div className="w-full p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-white text-xs font-semibold truncate mb-1.5">{img.title}</p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setViewingImage(img)}
                        className="flex-1 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs py-1.5 rounded-lg backdrop-blur-sm"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={() => handleDelete(img.id)}
                        disabled={deletingId === img.id}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-500/80 hover:bg-red-600 text-white text-xs py-1.5 rounded-lg"
                      >
                        {deletingId === img.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Trash2 className="w-3 h-3" /> Del</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Form - BELOW grid */}
        {showUpload && (
          <div className="mt-8 bg-white/90 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: '#6c7d36' }}>Add Photo</h2>
              <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Sunday Outreach"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="border-gray-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5">
                  Location <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <Input
                  placeholder="e.g. Bengaluru, MG Road"
                  value={formData.location}
                  onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                  className="border-gray-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5">
                  Photo <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileSelect} className="hidden" />
                  {selectedFile ? (
                    <div className="space-y-1">
                      <ImageIcon className="w-8 h-8 mx-auto" style={{ color: '#6c7d36' }} />
                      <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatSize(selectedFile.size)}</p>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="text-xs text-gray-500 underline"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-8 h-8 mx-auto" style={{ color: '#6c7d36' }} />
                      <p className="text-sm font-medium text-gray-800">Click to upload photo</p>
                      <p className="text-xs text-gray-500">JPG, PNG, WEBP (max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{uploadProgress < 60 ? 'Reading...' : uploadProgress < 90 ? 'Uploading...' : uploadProgress < 100 ? 'Saving...' : 'Done!'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%`, backgroundColor: '#6c7d36' }} />
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full text-white font-medium"
                style={{ backgroundColor: '#6c7d36' }}
              >
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}