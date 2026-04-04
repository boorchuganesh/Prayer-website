import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: '#f5f0eb' }}>

      {/* Hero Section with striped background */}
      <section className="px-6 py-12 md:py-16 relative overflow-hidden">

        {/* Striped background on right side */}
        <div
          className="absolute top-0 right-0 h-full w-2/3 md:w-1/2"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 18px,
              #e8e0d8 18px,
              #e8e0d8 20px
            )`,
            zIndex: 0,
          }}
        />

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 items-center relative z-10">

          {/* Left: Headline */}
          <div className="md:col-span-1 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#e85c1a] leading-tight">
              Connecting<br />Hearts<br />Through Prayer.
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              A place where believers come together to pray, encourage one another, and share prayer requests, trusting in the power of prayer and the love of Christ.
            </p>
          </div>

          {/* Middle: Submit Prayer Card */}
          <Link href="/request-prayer" className="block">
            <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center text-center gap-6 h-64 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100">
              <div className="w-20 h-20 flex items-center justify-center">
                <span style={{ fontSize: '64px' }}>✍️</span>
              </div>
              <h2 style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '22px',
                fontWeight: '700',
                color: '#1a1a1a',
                lineHeight: '1.3',
              }}>
                Submit Prayer<br />Request
              </h2>
            </div>
          </Link>

          {/* Right: View Prayer Card (Orange) */}
          <Link href="/prayers" className="block">
            <div
              className="rounded-2xl shadow-lg p-10 flex flex-col items-center text-center gap-6 h-64 hover:opacity-95 transition-opacity cursor-pointer"
              style={{ backgroundColor: '#e85c1a' }}
            >
              <div className="w-20 h-20 flex items-center justify-center">
                <span style={{ fontSize: '64px' }}>🙏</span>
              </div>
              <h2 style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '22px',
                fontWeight: '700',
                color: '#ffffff',
                lineHeight: '1.3',
              }}>
                View Prayer<br />Request
              </h2>
            </div>
          </Link>

        </div>
      </section>

      {/* Community Cards Section */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* Question & Answer */}
          <Link href="/questions" className="block">
            <div
              className="relative rounded-2xl overflow-hidden h-48 md:h-56 cursor-pointer group"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm mb-1">Question & Answer</h3>
                <p className="text-white/80 text-xs leading-snug mb-3">
                  Ask biblical questions and learn from thoughtful answers by our community of believers.
                </p>
                <span className="inline-block bg-[#e85c1a] text-white text-xs font-semibold px-3 py-1.5 rounded-full group-hover:bg-[#d14e10] transition-colors">
                  Explore Questions
                </span>
              </div>
            </div>
          </Link>

          {/* Prayers */}
          <Link href="/prayers" className="block">
            <div
              className="relative rounded-2xl overflow-hidden h-48 md:h-56 cursor-pointer group"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm mb-1">Prayers</h3>
                <p className="text-white/80 text-xs leading-snug mb-3">
                  Share your prayer requests and experience the strength of a community united in prayer.
                </p>
                <span className="inline-block bg-[#e85c1a] text-white text-xs font-semibold px-3 py-1.5 rounded-full group-hover:bg-[#d14e10] transition-colors">
                  Explore Prayer
                </span>
              </div>
            </div>
          </Link>

          {/* Media */}
          <Link href="/media" className="block">
            <div
              className="relative rounded-2xl overflow-hidden h-48 md:h-56 cursor-pointer group"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm mb-1">Media</h3>
                <p className="text-white/80 text-xs leading-snug mb-3">
                  Photos and moments from our street fellowship and community outreach.
                </p>
                <span className="inline-block bg-[#e85c1a] text-white text-xs font-semibold px-3 py-1.5 rounded-full group-hover:bg-[#d14e10] transition-colors">
                  Explore Media
                </span>
              </div>
            </div>
          </Link>

          {/* Worship Songs */}
          <Link href="/songs" className="block">
            <div
              className="relative rounded-2xl overflow-hidden h-48 md:h-56 cursor-pointer group"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm mb-1">Worship Songs</h3>
                <p className="text-white/80 text-xs leading-snug mb-3">
                  Discover beautiful worship songs and spiritual music shared by our community.
                </p>
                <span className="inline-block bg-[#e85c1a] text-white text-xs font-semibold px-3 py-1.5 rounded-full group-hover:bg-[#d14e10] transition-colors">
                  Explore Songs
                </span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 px-6 text-center text-sm text-gray-500">
        <p className="font-medium text-gray-700">Faithybites — Connecting Hearts Through Prayer</p>
        <p className="mt-1">Every prayer matters. You are never alone.</p>
      </footer>
    </main>
  );
}