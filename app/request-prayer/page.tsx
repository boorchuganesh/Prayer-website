import { Metadata } from 'next';
import { PrayerForm } from '@/components/prayer-form';

export const metadata: Metadata = {
  title: 'Submit Prayer Request - Faithybites',
  description: 'Submit your prayer request on Faithybites to connect with believers who are willing to pray for you.',
};

export default function RequestPrayerPage() {
  return (
    <main className="min-h-screen bg-[#f5f0eb] py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <PrayerForm />
      </div>
    </main>
  );
}