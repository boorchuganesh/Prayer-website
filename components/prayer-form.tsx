'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VoiceRecorder } from '@/components/voice-recorder';
import { SuccessModal } from '@/components/success-modal';
import { ErrorModal } from '@/components/error-modal';

export function PrayerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [voiceData, setVoiceData] = useState<{ blob: Blob; duration: number } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setValidationError('Please enter your name');
      return false;
    }
    if (formData.name.trim().length < 3) {
      setValidationError('Name must be at least 3 letters');
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      setValidationError('Name can only contain letters');
      return false;
    }
    if (formData.city.trim() && !/^[a-zA-Z\s]+$/.test(formData.city.trim())) {
      setValidationError('City can only contain letters');
      return false;
    }
    if (!formData.reason.trim() && !voiceData) {
      setValidationError('Please provide either a prayer request or a voice recording');
      return false;
    }
    return true;
  };

  const handleVoiceComplete = (audioBlob: Blob, duration: number) => {
    setVoiceData({ blob: audioBlob, duration });
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      let voiceBase64 = null;
      let voiceDuration = 0;
      if (voiceData) {
        voiceBase64 = await blobToBase64(voiceData.blob);
        voiceDuration = voiceData.duration;
      }
      const res = await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          city: formData.city,
          prayer_request: formData.reason,
          voice_data: voiceBase64,
          voice_duration: voiceDuration,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setValidationError(data.error || 'Error submitting prayer. Please try again.');
      } else {
        setSubmitted(true);
        setFormData({ name: '', city: '', reason: '' });
        setVoiceData(null);
        setTimeout(() => setSubmitted(false), 4000);
      }
    } catch (error) {
      console.error('Error:', error);
      setValidationError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SuccessModal isOpen={submitted} message="Prayer Request Submitted Successfully!" duration={4000} />
      <ErrorModal isOpen={!!validationError} message={validationError || ''} duration={4000} onClose={() => setValidationError(null)} />

      <Card className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white border-0 shadow-xl rounded-2xl">
        {/* Header */}
        <div className="mb-6 space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#e85c1a] flex items-center justify-center">
              <span className="text-white text-sm">🙏</span>
            </div>
            <span className="text-[#e85c1a] font-bold text-sm">FaithyBites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Share Your Prayer Request
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Tell us how we can pray for you. Your request will be lifted up by our Faithybites community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Your Name <span className="text-[#e85c1a]">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border-gray-200 bg-gray-50 h-11 focus:border-[#e85c1a] focus:ring-[#e85c1a]"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1.5">
              City <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Your city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border-gray-200 bg-gray-50 h-11 focus:border-[#e85c1a] focus:ring-[#e85c1a]"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Prayer Request <span className="text-gray-400 font-normal text-xs">(Optional if voice recorded)</span>
            </label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Share what you need prayer for. Be as specific as you feel comfortable."
              value={formData.reason}
              onChange={handleChange}
              className="w-full min-h-28 resize-none border-gray-200 bg-gray-50 p-3 focus:border-[#e85c1a] focus:ring-[#e85c1a]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Share your needs openly. Your request will be handled with compassion and confidentiality.
            </p>
          </div>

          <VoiceRecorder onRecordingComplete={handleVoiceComplete} />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-bold py-3 h-12 text-base rounded-xl transition-colors"
            style={{ backgroundColor: '#e85c1a' }}
          >
            {isLoading ? 'Submitting...' : 'Submit Prayer Request'}
          </Button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-5 italic">
          "The Lord is near to all who call on him, to all who call on him in truth." — Psalm 145:18
        </p>
      </Card>
    </>
  );
}