import { Metadata } from 'next';
import { PrayersDashboard } from '@/components/prayers-dashboard';

export const metadata: Metadata = {
  title: 'Prayer Dashboard - Faithybites',
  description: 'View and manage prayer requests from our community. Mark prayers as done and see answered prayers on Faithybites.',
};

export default function PrayersPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-balance" style={{ color: '#6c7d36' }}>
            Prayer Community
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 text-balance">
            Join our community in lifting up these prayer requests. Every prayer matters, and together we stand in faith.
          </p>
        </div>

        <PrayersDashboard />
      </div>
    </main>
  );
}
