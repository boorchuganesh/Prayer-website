'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useMemo, memo } from 'react';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = useMemo(
    () => (path: string) => pathname === path,
    [pathname]
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo - LEFT */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 sm:group-hover:scale-105 sm:transition-transform">
              <Image
                src="/logo.svg"
                alt="Faithybites Logo"
                width={48}
                height={48}
                className="w-full h-full"
              />
            </div>
          </Link>

          {/* Navigation - CENTER */}
          <nav className="hidden sm:flex items-center gap-4 flex-grow justify-center">
            <Link href="/prayers">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive('/prayers')
                    ? 'text-gray-900 border-b-2'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={isActive('/prayers') ? { borderColor: '#6c7d36', borderBottomWidth: '2px', paddingBottom: '2px' } : {}}
              >
                Prayers
              </Button>
            </Link>
            <Link href="/questions">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive('/questions')
                    ? 'text-gray-900 border-b-2'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={isActive('/questions') ? { borderColor: '#6c7d36', borderBottomWidth: '2px', paddingBottom: '2px' } : {}}
              >
                Q&A
              </Button>
            </Link>
            <Link href="/songs">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive('/songs')
                    ? 'text-gray-900 border-b-2'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={isActive('/songs') ? { borderColor: '#6c7d36', borderBottomWidth: '2px', paddingBottom: '2px' } : {}}
              >
                Songs
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden text-gray-600 hover:text-gray-900 p-2 h-auto min-h-0"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          {/* Request Prayer Button - Desktop Only */}
          <Link href="/request-prayer" className="hidden sm:block flex-shrink-0">
            <Button
              size="sm"
              className="text-xs sm:text-sm font-medium text-white rounded-full px-3 sm:px-4 min-h-9 sm:min-h-10"
              style={{ backgroundColor: '#6c7d36' }}
            >
              Request Prayer
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white/95 backdrop-blur">
            <nav className="flex flex-col py-3">
              <Link href="/prayers" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-sm font-medium transition-all rounded-none px-4 py-2 h-auto min-h-10 ${
                    isActive('/prayers')
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Prayers
                </Button>
              </Link>
              <Link href="/questions" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-sm font-medium transition-all rounded-none px-4 py-2 h-auto min-h-10 ${
                    isActive('/questions')
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Questions & Answers
                </Button>
              </Link>
              <Link href="/songs" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-sm font-medium transition-all rounded-none px-4 py-2 h-auto min-h-10 ${
                    isActive('/songs')
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Worship Songs
                </Button>
              </Link>
              <div className="border-t border-gray-200 my-2" />
              <Link href="/request-prayer" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  size="sm"
                  className="w-full justify-start text-sm font-medium text-white rounded-none px-4 py-2 h-auto min-h-10"
                  style={{ backgroundColor: '#6c7d36' }}
                >
                  Request Prayer
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
