'use client';

import { useState } from 'react';
import { QAQuestionForm } from '@/components/qa-question-form';
import { QAQuestionsList } from '@/components/qa-questions-list';
import { QAAnswersDisplay } from '@/components/qa-answers-display';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function QuestionsContent() {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [showAskForm, setShowAskForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleQuestionSubmitted = () => {
    setShowAskForm(false);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
  };

  if (selectedQuestionId) {
    return (
      <main className="min-h-screen bg-[#f5f0eb] py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <QAAnswersDisplay
            questionId={selectedQuestionId}
            onBack={() => setSelectedQuestionId(null)}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f0eb] py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
                Questions & Answers
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                Have questions about Jesus and faith? Browse community questions and answers or ask your own.
              </p>
            </div>
            <Button
              onClick={() => setShowAskForm(!showAskForm)}
              className="flex items-center gap-2 text-white font-semibold text-sm rounded-full min-h-10 px-5"
              style={{ backgroundColor: '#e85c1a' }}
            >
              <Plus className="w-4 h-4" />
              Ask Question
            </Button>
          </div>
        </div>

        {showAskForm && (
          <div className="mb-7">
            <QAQuestionForm onQuestionSubmitted={handleQuestionSubmitted} onCancel={() => setShowAskForm(false)} />
          </div>
        )}

        <QAQuestionsList onQuestionSelect={setSelectedQuestionId} refreshTrigger={refreshTrigger} />
      </div>
    </main>
  );
}