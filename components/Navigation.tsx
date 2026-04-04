'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Main' },
    { href: '/questions', label: 'Questions' },
    { href: '/media', label: 'Media' },
    { href: '/songs', label: 'Songs' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="w-full px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Image src="/logo.svg" alt="FaithyBites" width={36} height={36} className="w-full h-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <span className="text-[#e85c1a] font-bold text-base sm:text-lg tracking-tight">FaithyBites</span>
          </Link>

          {/* Center Nav Pills — Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
            {navLinks.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    active
                      ? 'bg-[#e85c1a] text-white'
                      : 'text-gray-600 hover:text-[#e85c1a]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Join Now + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/request-prayer"
              className="hidden md:inline-flex bg-[#e85c1a] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#d14e10] transition-colors"
            >
              Join Now
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-[#e85c1a] transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 mt-3 pt-3 pb-2 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    active
                      ? 'bg-[#e85c1a] text-white'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-[#e85c1a]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <Link
                href="/request-prayer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center bg-[#e85c1a] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#d14e10] transition-colors"
              >
                Join Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}