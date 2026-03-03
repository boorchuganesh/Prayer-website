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
  const [formData, setFormData] = useState({
    name: '',
    question: '',
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
    if (!formData.question.trim()) {
      setValidationError('Please enter your question');
      return false;
    }
    if (formData.question.trim().length < 10) {
      setValidationError('Question must be at least 10 characters');
      return false;
    }
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
        body: JSON.stringify({
          title: formData.name,
          content: formData.question,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setValidationError(data.error || 'Error submitting question. Please try again.');
      } else {
        setSubmitted(true);
        setFormData({ name: '', question: '' });
        setTimeout(() => {
          setSubmitted(false);
          onQuestionSubmitted?.();
        }, 4000);
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
      <SuccessModal
        isOpen={submitted}
        message="Question Submitted Successfully!"
        duration={4000}
      />
      <ErrorModal
        isOpen={!!validationError}
        message={validationError || ''}
        duration={4000}
        onClose={() => setValidationError(null)}
      />
      <Card className="w-full max-w-2xl mx-auto p-3 sm:p-6 md:p-8 bg-white/90 border-0 shadow-xl backdrop-blur-sm">
        <div className="mb-5 sm:mb-8 space-y-1 sm:space-y-2">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold" style={{ color: '#6c7d36' }}>
            Ask Your Question
          </h2>
          <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
            Have questions about Jesus or faith? Ask your questions and our community believers will provide answers based on the Bible and their faith.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full text-sm sm:text-base border-gray-200 bg-white h-10 sm:h-11 px-3"
            />
          </div>

          <div>
            <label htmlFor="question" className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
              Your Question <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="question"
              name="question"
              placeholder="What would you like to know about Jesus or faith?"
              value={formData.question}
              onChange={handleChange}
              className="w-full min-h-24 sm:min-h-32 resize-none text-sm sm:text-base border-gray-200 bg-white p-3"
            />
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Be as detailed as possible. Our community will provide thoughtful, biblical answers.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 text-white font-medium py-3 sm:py-2 h-auto text-sm sm:text-base min-h-11 sm:min-h-10 touch-manipulation"
              style={{ backgroundColor: '#6c7d36' }}
            >
              {isLoading ? 'Submitting...' : 'Submit Question'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1 text-gray-700 font-medium py-3 sm:py-2 h-auto text-sm sm:text-base min-h-11 sm:min-h-10 border-gray-300 bg-transparent"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        <p className="text-xs sm:text-sm text-gray-600 text-center mt-4 sm:mt-6 italic leading-relaxed px-2">
          "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you." - James 1:5
        </p>
      </Card>
    </>
  );
}