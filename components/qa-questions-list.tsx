"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Trash2 } from 'lucide-react';
import { ConfirmationModal } from '@/components/confirmation-modal';

interface Question {
  id: string;
  title: string;
  content: string;
  created_at: string;
  answers_count: number;
}

interface QAQuestionsListProps {
  onQuestionSelect: (questionId: string) => void;
  refreshTrigger?: number;
}

export function QAQuestionsList({ onQuestionSelect, refreshTrigger = 0 }: QAQuestionsListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
  
      if (!res.ok) {
        console.error('Error fetching questions:', data.error);
        return;
      }
  
      setQuestions(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openDeleteConfirm = useCallback((questionId: string) => {
    setQuestionToDelete(questionId);
    setShowDeleteConfirm(true);
  }, []);

  const deleteQuestion = useCallback(async () => {
    if (!questionToDelete) return;

    setDeletingId(questionToDelete);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionToDelete);

      if (error) {
        console.error('[v0] Error deleting question:', error.message);
        alert('Error deleting question. Please try again.');
      } else {
        setQuestions(prev => prev.filter(q => q.id !== questionToDelete));
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setDeletingId(null);
      setQuestionToDelete(null);
    }
  }, [questionToDelete]);

  useEffect(() => {
    fetchQuestions();
  }, [refreshTrigger]);

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
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question? All answers will also be deleted."
        confirmText="Delete Question"
        cancelText="Cancel"
        isLoading={deletingId !== null}
        isDangerous={true}
        onConfirm={deleteQuestion}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setQuestionToDelete(null);
        }}
      />
      <div className="space-y-3 sm:space-y-4">
        {questions.map(question => (
          <Card
            key={question.id}
            className="p-3 sm:p-4 md:p-5 bg-white/90 border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xs sm:text-sm font-bold truncate" style={{ color: '#6c7d36' }}>
                    {question.title}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(question.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                  {question.content}
                </p>
                <div className="mt-2 sm:mt-3 flex items-center gap-2">
                  <span className="inline-block px-2 sm:px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#CAEFD7' }}>
                    {question.answers_count} {question.answers_count === 1 ? 'Answer' : 'Answers'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  className="text-white font-medium text-xs sm:text-sm min-h-9 sm:min-h-10 px-2 sm:px-3 touch-manipulation"
                  style={{ backgroundColor: '#6c7d36' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuestionSelect(question.id);
                  }}
                  disabled={deletingId === question.id}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white font-medium text-xs sm:text-sm min-h-9 sm:min-h-10 px-2 sm:px-3 touch-manipulation flex items-center justify-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteConfirm(question.id);
                  }}
                  disabled={deletingId !== null}
                >
                  {deletingId === question.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Deleting</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                      <span className="sm:hidden">Del</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {expandedId === question.id && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{question.content}</p>
                <Button
                  size="sm"
                  className="mt-3 w-full text-white font-medium text-xs sm:text-sm min-h-10 sm:min-h-9 touch-manipulation"
                  style={{ backgroundColor: '#6c7d36' }}
                  onClick={() => onQuestionSelect(question.id)}
                >
                  Read Answers ({question.answers_count})
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}