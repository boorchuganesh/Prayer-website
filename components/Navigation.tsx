'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/prayers', label: 'Prayers' },
  { href: '/questions', label: 'Q&A' },
  { href: '/media', label: 'Media' },
  { href: '/songs', label: 'Songs' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e8e0d8',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '22px' }}>🙏</span>
          <span
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: '700',
              fontSize: '20px',
              color: '#e85c1a',
              letterSpacing: '-0.3px',
            }}
          >
            Faithybites
          </span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          className="hidden-mobile"
        >
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#ffffff' : '#4b4540',
                  backgroundColor: isActive ? '#e85c1a' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0eb';
                    (e.currentTarget as HTMLElement).style.color = '#e85c1a';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#4b4540';
                  }
                }}
              >
                {label}
              </Link>
            );
          })}

          {/* CTA Button */}
          <Link
            href="/request-prayer"
            style={{
              textDecoration: 'none',
              marginLeft: '12px',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#e85c1a',
              border: '2px solid #e85c1a',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#e85c1a';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#e85c1a';
              (e.currentTarget as HTMLElement).style.color = '#ffffff';
            }}
          >
            ✍️ Submit Prayer
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            color: '#4b4540',
          }}
          className="show-mobile"
        >
          {menuOpen ? (
            // X icon
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Hamburger icon
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e8e0d8',
            padding: '12px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
          className="show-mobile"
        >
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#e85c1a' : '#4b4540',
                  backgroundColor: isActive ? '#fdf0ea' : 'transparent',
                }}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/request-prayer"
            onClick={() => setMenuOpen(false)}
            style={{
              textDecoration: 'none',
              marginTop: '8px',
              padding: '11px 18px',
              borderRadius: '999px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#e85c1a',
              textAlign: 'center',
            }}
          >
            ✍️ Submit Prayer Request
          </Link>
        </div>
      )}

      {/* Inline responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}