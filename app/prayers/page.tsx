import { Metadata } from 'next';
import { PrayersDashboard } from '@/components/prayers-dashboard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Prayer Community - Faithybites',
  description: 'View and manage prayer requests from our community.',
};

export default function PrayersPage() {
  return (
    <main className="min-h-screen bg-[#f5f0eb] py-8 sm:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
                Prayer Community
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                Join our community in lifting up these prayer requests. Every prayer matters, and together we stand in faith.
              </p>
            </div>
            <Link
              href="/request-prayer"
              className="inline-flex items-center gap-2 bg-[#e85c1a] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#d14e10] transition-colors"
            >
              + Submit Prayer
            </Link>
          </div>
        </div>

        <PrayersDashboard />
      </div>
    </main>
  );
}