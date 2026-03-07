'use client';

import { useState } from 'react';
import { QAQuestionForm } from '@/components/qa-question-form';
import { QAQuestionsList } from '@/components/qa-questions-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function QuestionsContent() {
  const [showAskForm, setShowAskForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleQuestionSubmitted = () => {
    setShowAskForm(false);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-balance" style={{ color: '#6c7d36' }}>
                Questions & Answers
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 text-balance leading-relaxed">
                Have questions about Jesus and faith? Browse community questions and answers or ask your own.
              </p>
            </div>
            <Button
              onClick={() => setShowAskForm(!showAskForm)}
              className="flex items-center gap-2 text-white font-medium text-xs sm:text-sm rounded-lg min-h-10 sm:min-h-11 touch-manipulation px-3 sm:px-4"
              style={{ backgroundColor: '#6c7d36' }}
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Ask Question</span>
              <span className="sm:hidden">Ask</span>
            </Button>
          </div>
        </div>

        {showAskForm && (
          <div className="mb-8">
            <QAQuestionForm
              onQuestionSubmitted={handleQuestionSubmitted}
              onCancel={() => setShowAskForm(false)}
            />
          </div>
        )}

        <QAQuestionsList refreshTrigger={refreshTrigger} />
      </div>
    </main>
  );
}