import { QAQuestionForm } from '@/components/qa-question-form';

export const metadata = {
  title: 'Ask a Question - Faithybites',
  description: 'Ask your questions about Jesus and faith to our believer community.',
};

export default function AskQuestionPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <QAQuestionForm />
      </div>
    </main>
  );
}
