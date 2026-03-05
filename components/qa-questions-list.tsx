'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, X } from 'lucide-react';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { SuccessModal } from '@/components/success-modal';
import { ErrorModal } from '@/components/error-modal';

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

interface QAQuestionsListProps {
  onQuestionSelect?: (questionId: string) => void;
  refreshTrigger?: number;
}

// ─── Answer Popup Modal ───────────────────────────────────────────────────────
function AnswerModal({
  question,
  onClose,
}: {
  question: Question;
  onClose: () => void;
}) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', answer: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [answerToDelete, setAnswerToDelete] = useState<string | null>(null);
  const [deletingAnswerId, setDeletingAnswerId] = useState<string | null>(null);

  const fetchAnswers = useCallback(async () => {
    setIsLoadingAnswers(true);
    try {
      const res = await fetch(`/api/answers?question_id=${question.id}`);
      const data = await res.json();
      if (res.ok) setAnswers(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAnswers(false);
    }
  }, [question.id]);

  useEffect(() => {
    fetchAnswers();
  }, [fetchAnswers]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) { setValidationError('Please enter your name'); return false; }
    if (formData.name.trim().length < 3) { setValidationError('Name must be at least 3 letters'); return false; }
    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) { setValidationError('Name can only contain letters'); return false; }
    if (!formData.answer.trim()) { setValidationError('Please enter your answer'); return false; }
    if (formData.answer.trim().length < 10) { setValidationError('Answer must be at least 10 characters'); return false; }
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
          question_id: question.id,
          answered_by: formData.name,
          content: formData.answer,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setValidationError(data.error || 'Error submitting answer.');
      } else {
        setSubmitted(true);
        setFormData({ name: '', answer: '' });
        // Refresh answers immediately
        const aRes = await fetch(`/api/answers?question_id=${question.id}`);
        const aData = await aRes.json();
        if (aRes.ok) setAnswers(aData.data || []);
        setTimeout(() => setSubmitted(false), 4000);
      }
    } catch {
      setValidationError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        setValidationError('Error deleting answer.');
      }
    } catch {
      setValidationError('An error occurred.');
    } finally {
      setDeletingAnswerId(null);
      setAnswerToDelete(null);
    }
  }, [answerToDelete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <SuccessModal isOpen={submitted} message="Answer Submitted!" duration={4000} />
      <ErrorModal
        isOpen={!!validationError}
        message={validationError || ''}
        duration={4000}
        onClose={() => setValidationError(null)}
      />
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Answer"
        message="Are you sure you want to delete this answer?"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingAnswerId !== null}
        isDangerous={true}
        onConfirm={deleteAnswer}
        onCancel={() => { setShowDeleteConfirm(false); setAnswerToDelete(null); }}
      />

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-sm sm:text-base font-bold leading-snug" style={{ color: '#6c7d36' }}>
              {question.title}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(question.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

          {/* Question body */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#CAEFD7' }}>
            <p className="text-sm text-gray-800 leading-relaxed">{question.content}</p>
          </div>

          {/* Answers list */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold" style={{ color: '#6c7d36' }}>
              Answers ({answers.length})
            </h3>

            {isLoadingAnswers ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#6c7d36' }} />
              </div>
            ) : answers.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3 italic">
                No answers yet — be the first to answer!
              </p>
            ) : (
              answers.map(answer => (
                <div
                  key={answer.id}
                  className="p-3 sm:p-4 rounded-xl border border-gray-100"
                  style={{ backgroundColor: '#F5BFD7' + '33' }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold" style={{ color: '#6c7d36' }}>
                        {answer.answered_by}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {new Date(answer.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => { setAnswerToDelete(answer.id); setShowDeleteConfirm(true); }}
                      disabled={deletingAnswerId !== null}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 p-1"
                    >
                      {deletingAnswerId === answer.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-2">
                    {answer.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Answer Form */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-xs sm:text-sm font-bold mb-4" style={{ color: '#6c7d36' }}>
              Provide an Answer
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-sm border-gray-200 bg-white h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Your Answer <span className="text-red-500">*</span>
                </label>
                <Textarea
                  name="answer"
                  placeholder="Share your answer based on the Bible and your faith..."
                  value={formData.answer}
                  onChange={handleChange}
                  className="w-full min-h-24 resize-none text-sm border-gray-200 bg-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Please provide thoughtful, biblical answers that reflect your faith.
                </p>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-medium text-sm min-h-10 touch-manipulation"
                style={{ backgroundColor: '#6c7d36' }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Answer'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Questions List ──────────────────────────────────────────────────────
export function QAQuestionsList({ refreshTrigger = 0 }: QAQuestionsListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      if (!res.ok) { console.error('Error:', data.error); return; }
      setQuestions(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteQuestion = useCallback(async () => {
    if (!questionToDelete) return;
    setDeletingId(questionToDelete);
    try {
      const res = await fetch('/api/questions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: questionToDelete }),
      });
      if (res.ok) {
        setQuestions(prev => prev.filter(q => q.id !== questionToDelete));
        setShowDeleteConfirm(false);
      } else {
        alert('Error deleting question. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setDeletingId(null);
      setQuestionToDelete(null);
    }
  }, [questionToDelete]);

  useEffect(() => {
    fetchQuestions();
  }, [refreshTrigger, fetchQuestions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 min-h-40">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <Loader2 className="w-8 sm:w-10 h-8 sm:h-10 animate-spin" style={{ color: '#6c7d36' }} />
          <p className="text-xs sm:text-sm text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full p-6 sm:p-8 bg-white/90 border-0 shadow-xl text-center">
        <p className="text-gray-600">No questions yet. Be the first to ask!</p>
      </Card>
    );
  }

  return (
    <>
      {/* Popup modal */}
      {selectedQuestion && (
        <AnswerModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question? All answers will also be deleted."
        confirmText="Delete Question"
        cancelText="Cancel"
        isLoading={deletingId !== null}
        isDangerous={true}
        onConfirm={deleteQuestion}
        onCancel={() => { setShowDeleteConfirm(false); setQuestionToDelete(null); }}
      />

      <div className="space-y-3 sm:space-y-4">
        {questions.map(question => (
          <Card
            key={question.id}
            className="p-4 sm:p-5 bg-white/90 border-0 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-xs sm:text-sm font-bold truncate" style={{ color: '#6c7d36' }}>
                    {question.title}
                  </h3>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(question.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 leading-relaxed">
                  {question.content}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  className="text-white font-medium text-xs sm:text-sm min-h-9 px-3 touch-manipulation"
                  style={{ backgroundColor: '#6c7d36' }}
                  onClick={() => setSelectedQuestion(question)}
                  disabled={deletingId === question.id}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white font-medium text-xs sm:text-sm min-h-9 px-2 sm:px-3 touch-manipulation flex items-center gap-1"
                  onClick={() => { setQuestionToDelete(question.id); setShowDeleteConfirm(true); }}
                  disabled={deletingId !== null}
                >
                  {deletingId === question.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}