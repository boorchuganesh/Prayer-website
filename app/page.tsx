import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-8 sm:space-y-10 md:space-y-12">
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-balance leading-tight" style={{ color: '#6c7d36' }}>
              Welcome to Faithybites
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 text-balance leading-relaxed max-w-2xl mx-auto px-2">
              Connect with a prayer community. You are never alone, your prayer matters, and there is always someone willing to stand with you in faith.
            </p>
          </div>

          {/* Two Prayer Request Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto pt-2 sm:pt-4">
            <Link href="/request-prayer">
              <Card className="p-6 sm:p-8 bg-white/90 border-2 border-white/80 hover:border-white hover:shadow-xl sm:transition-all cursor-pointer h-full backdrop-blur-sm">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl" style={{ backgroundColor: '#CAEFD7' }}>
                    📝
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
                    Submit Prayer Request
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Share your name, location, and prayer need with our community.
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/prayers">
              <Card className="p-6 sm:p-8 bg-white/90 border-2 border-white/80 hover:border-white hover:shadow-xl sm:transition-all cursor-pointer h-full backdrop-blur-sm">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl" style={{ backgroundColor: '#F5BFD7' }}>
                    🙏
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
                    View Prayers
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    See active prayers and join our community.
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Hub Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-balance" style={{ color: '#6c7d36' }}>
              Join Our Community Hub
            </h2>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-700 text-balance max-w-2xl mx-auto leading-relaxed">
              Explore questions, get answers, and discover worship music shared by believers like you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {/* Questions Card */}
            <Link href="/questions">
              <Card className="p-6 sm:p-8 bg-white/90 border-0 shadow-lg hover:shadow-2xl sm:transition-all cursor-pointer h-full backdrop-blur-sm group">
                <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center text-3xl sm:text-4xl sm:group-hover:scale-110 sm:transition-transform" style={{ backgroundColor: '#CAEFD7' }}>
                    ❓
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      Questions & Answers
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                      Ask biblical questions and learn from thoughtful answers by our community of believers.
                    </p>
                  </div>
                  <div className="pt-2 sm:pt-3">
                    <span className="inline-block px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-white" style={{ backgroundColor: '#6c7d36' }}>
                      Explore Questions
                    </span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Worship Songs Card */}
            <Link href="/songs">
              <Card className="p-6 sm:p-8 bg-white/90 border-0 shadow-lg hover:shadow-2xl sm:transition-all cursor-pointer h-full backdrop-blur-sm group">
                <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center text-3xl sm:text-4xl sm:group-hover:scale-110 sm:transition-transform" style={{ backgroundColor: '#ABC9E9' }}>
                    🎵
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      Worship Songs
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                      Discover beautiful worship songs and spiritual music shared by our community.
                    </p>
                  </div>
                  <div className="pt-2 sm:pt-3">
                    <span className="inline-block px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-white" style={{ backgroundColor: '#6c7d36' }}>
                      Listen Now
                    </span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Community Discussions Card */}
            <Link href="/prayers">
              <Card className="p-6 sm:p-8 bg-white/90 border-0 shadow-lg hover:shadow-2xl sm:transition-all cursor-pointer h-full backdrop-blur-sm group">
                <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center text-3xl sm:text-4xl sm:group-hover:scale-110 sm:transition-transform" style={{ backgroundColor: '#F5BFD7' }}>
                    💬
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      Community Discussions
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                      Connect with believers, share experiences, and grow together in faith.
                    </p>
                  </div>
                  <div className="pt-2 sm:pt-3">
                    <span className="inline-block px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-white" style={{ backgroundColor: '#6c7d36' }}>
                      Join Discussions
                    </span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Street Fellowship Card */}
            <Link href="/street-fellowship">
              <Card className="p-6 sm:p-8 bg-white/90 border-0 shadow-lg hover:shadow-2xl sm:transition-all cursor-pointer h-full backdrop-blur-sm group">
                <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center text-3xl sm:text-4xl sm:group-hover:scale-110 sm:transition-transform" style={{ backgroundColor: '#CAEFD7' }}>
                    🏘️
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      Street Fellowship
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                      Photos from our street outreach and fellowship moments in the community.
                    </p>
                  </div>
                  <div className="pt-2 sm:pt-3">
                    <span className="inline-block px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-white" style={{ backgroundColor: '#6c7d36' }}>
                      View Photos
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-balance" style={{ color: '#6c7d36' }}>
            How Faithybites Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Card className="p-5 sm:p-6 bg-white/80 border-0 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#6c7d36' }}>
                  1
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">Submit Request</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Share your name, area, and prayer need with our community.
                </p>
              </div>
            </Card>

            <Card className="p-5 sm:p-6 bg-white/80 border-0 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#ABC9E9' }}>
                  2
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">Community Prays</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Believers lift your prayer before God with intention and faith.
                </p>
              </div>
            </Card>

            <Card className="p-5 sm:p-6 bg-white/80 border-0 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#6c7d36' }}>
                  ✓
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">Prayer Complete</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Prayers are marked done and honored.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-white/30 bg-white/20 backdrop-blur-sm mt-auto">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col gap-3 text-center text-xs sm:text-sm text-gray-700">
            <p className="font-medium">Faithybites - A Community Connected in Faith</p>
            <p>Every prayer matters. You are never alone.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}