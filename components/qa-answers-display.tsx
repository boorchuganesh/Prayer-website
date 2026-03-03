'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, ChevronLeft, Trash2 } from 'lucide-react';
import { SuccessModal } from '@/components/success-modal';
import { ErrorModal } from '@/components/error-modal';
import { ConfirmationModal } from '@/components/confirmation-modal';

interface Question {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Answer {
  id: string;
  answered_by: string;
  content: string;
  created_at: string;
}

interface QAAnswersDisplayProps {
  questionId: string;
  onBack: () => void;
  refreshTrigger?: number;
}

export function QAAnswersDisplay({ questionId, onBack, refreshTrigger = 0 }: QAAnswersDisplayProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', answer: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [answerToDelete, setAnswerToDelete] = useState<string | null>(null);
  const [deletingAnswerId, setDeletingAnswerId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch question
      const qRes = await fetch(`/api/questions/${questionId}`);
      const qData = await qRes.json();

      if (!qRes.ok) {
        console.error('Error fetching question:', qData.error);
        return;
      }
      setQuestion(qData.data);

      // Fetch answers
      const aRes = await fetch(`/api/answers?question_id=${questionId}`);
      const aData = await aRes.json();

      if (!aRes.ok) {
        console.error('Error fetching answers:', aData.error);
        return;
      }
      setAnswers(aData.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchData();
  }, [questionId, refreshTrigger, fetchData]);

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
    if (!formData.answer.trim()) {
      setValidationError('Please enter your answer');
      return false;
    }
    if (formData.answer.trim().length < 10) {
      setValidationError('Answer must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          answered_by: formData.name,
          content: formData.answer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setValidationError(data.error || 'Error submitting answer. Please try again.');
      } else {
        setSubmitted(true);
        setFormData({ name: '', answer: '' });
        setTimeout(() => {
          setSubmitted(false);
          fetchData();
        }, 4000);
      }
    } catch (error) {
      console.error('Error:', error);
      setValidationError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = useCallback((answerId: string) => {
    setAnswerToDelete(answerId);
    setShowDeleteConfirm(true);
  }, []);

  const deleteAnswer = useCallback(async () => {
    if (!answerToDelete) return;

    setDeletingAnswerId(answerToDelete);
    try {
      const res = await fetch('/api/answers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: answerToDelete }),
      });

      if (res.ok) {
        setAnswers(prev => prev.filter(a => a.id !== answerToDelete));
        setShowDeleteConfirm(false);
      } else {
        setValidationError('Error deleting answer. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setValidationError('An error occurred. Please try again.');
    } finally {
      setDeletingAnswerId(null);
      setAnswerToDelete(null);
    }
  }, [answerToDelete]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 min-h-40">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <Loader2 className="w-8 sm:w-10 h-8 sm:h-10 animate-spin" style={{ color: '#6c7d36' }} />
          <p className="text-xs sm:text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return <Card className="p-6 text-center text-gray-600">Question not found</Card>;
  }

  return (
    <>
      <SuccessModal
        isOpen={submitted}
        message="Answer Submitted Successfully!"
        duration={4000}
      />
      <ErrorModal
        isOpen={!!validationError}
        message={validationError || ''}
        duration={4000}
        onClose={() => setValidationError(null)}
      />
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Answer"
        message="Are you sure you want to delete this answer? This action cannot be undone."
        confirmText="Delete Answer"
        cancelText="Cancel"
        isLoading={deletingAnswerId !== null}
        isDangerous={true}
        onConfirm={deleteAnswer}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setAnswerToDelete(null);
        }}
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Questions
        </Button>

        {/* Question Card */}
        <Card className="p-4 sm:p-6 md:p-8 bg-white/90 border-0 shadow-xl">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-sm sm:text-base font-bold" style={{ color: '#6c7d36' }}>
                {question.title}
              </h2>
              <span className="text-xs text-gray-500">
                {new Date(question.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{question.content}</p>
          </div>
        </Card>

        {/* Answers Section */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-bold" style={{ color: '#6c7d36' }}>
            Answers ({answers.length})
          </h3>

          {answers.length > 0 ? (
            answers.map(answer => (
              <Card key={answer.id} className="p-3 sm:p-4 md:p-5 bg-white/90 border-0 shadow-lg">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <h4 className="text-xs sm:text-sm font-bold" style={{ color: '#6c7d36' }}>
                        {answer.answered_by}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(answer.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white font-medium text-xs min-h-8 sm:min-h-9 px-2 sm:px-3"
                      onClick={() => openDeleteConfirm(answer.id)}
                      disabled={deletingAnswerId !== null}
                    >
                      {deletingAnswerId === answer.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{answer.content}</p>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-4 sm:p-6 bg-white/90 border-0 shadow-lg text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                No answers yet. Be the first to answer this question!
              </p>
            </Card>
          )}
        </div>

        {/* Answer Form */}
        <Card className="p-3 sm:p-6 md:p-8 bg-white/90 border-0 shadow-xl">
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6" style={{ color: '#6c7d36' }}>
            Provide an Answer
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
            <div>
              <label htmlFor="answer-name" className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="answer-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full text-sm sm:text-base border-gray-200 bg-white h-10 sm:h-11 px-3"
              />
            </div>
            <div>
              <label htmlFor="answer-text" className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
                Your Answer <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="answer-text"
                name="answer"
                placeholder="Share your answer based on the Bible and your faith..."
                value={formData.answer}
                onChange={handleChange}
                className="w-full min-h-24 sm:min-h-32 resize-none text-sm sm:text-base border-gray-200 bg-white p-3"
              />
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Please provide thoughtful, biblical answers that reflect your faith.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-medium py-3 sm:py-2 h-auto text-sm sm:text-base min-h-11 sm:min-h-10 touch-manipulation"
              style={{ backgroundColor: '#6c7d36' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}