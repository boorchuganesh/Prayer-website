"use client";

import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SuccessModal } from '@/components/success-modal';
import { ErrorModal } from '@/components/error-modal';

interface QAQuestionFormProps {
  onQuestionSubmitted?: () => void;
  onCancel?: () => void;
}

export function QAQuestionForm({ onQuestionSubmitted, onCancel }: QAQuestionFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', question: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) { setValidationError('Please enter your name'); return false; }
    if (formData.name.trim().length < 3) { setValidationError('Name must be at least 3 letters'); return false; }
    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) { setValidationError('Name can only contain letters'); return false; }
    if (!formData.question.trim()) { setValidationError('Please enter your question'); return false; }
    if (formData.question.trim().length < 10) { setValidationError('Question must be at least 10 characters'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.name, content: formData.question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setValidationError(data.error || 'Error submitting question. Please try again.');
      } else {
        setSubmitted(true);
        setFormData({ name: '', question: '' });
        setTimeout(() => { setSubmitted(false); onQuestionSubmitted?.(); }, 4000);
      }
    } catch (error) {
      console.error('Error:', error);
      setValidationError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SuccessModal isOpen={submitted} message="Question Submitted Successfully!" duration={4000} />
      <ErrorModal isOpen={!!validationError} message={validationError || ''} duration={4000} onClose={() => setValidationError(null)} />

      <Card className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white border-0 shadow-xl rounded-2xl">
        <div className="mb-6 space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#e85c1a] flex items-center justify-center">
              <span className="text-white text-sm">❓</span>
            </div>
            <span className="text-[#e85c1a] font-bold text-sm">FaithyBites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Ask Your Question</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Have questions about Jesus or faith? Ask your questions and our community believers will provide answers based on the Bible and their faith.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Your Name <span className="text-[#e85c1a]">*</span>
            </label>
            <Input
              id="name" name="name" type="text" placeholder="Enter your name"
              value={formData.name} onChange={handleChange} required
              className="w-full border-gray-200 bg-gray-50 h-11"
            />
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Your Question <span className="text-[#e85c1a]">*</span>
            </label>
            <Textarea
              id="question" name="question"
              placeholder="What would you like to know about Jesus or faith?"
              value={formData.question} onChange={handleChange}
              className="w-full min-h-28 resize-none border-gray-200 bg-gray-50 p-3"
            />
            <p className="text-xs text-gray-400 mt-1">
              Be as detailed as possible. Our community will provide thoughtful, biblical answers.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}
              className="flex-1 text-white font-bold py-3 h-12 text-base rounded-xl"
              style={{ backgroundColor: '#e85c1a' }}>
              {isLoading ? 'Submitting...' : 'Submit Question'}
            </Button>
            {onCancel && (
              <Button type="button" onClick={onCancel} variant="outline"
                className="flex-1 text-gray-700 font-semibold py-3 h-12 border-gray-300 bg-transparent rounded-xl">
                Cancel
              </Button>
            )}
          </div>
        </form>

        <p className="text-xs text-gray-400 text-center mt-5 italic">
          "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault." — James 1:5
        </p>
      </Card>
    </>
  );
}