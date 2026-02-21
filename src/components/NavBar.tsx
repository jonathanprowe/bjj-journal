'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, PlusCircle } from 'lucide-react';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '3.5rem',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={16} color="white" />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            BJJ Journal
          </span>
        </Link>

        {/* Actions */}
        <Link
          href="/new"
          className="btn btn-primary"
          style={{ padding: '0.4rem 1rem', fontSize: '0.8125rem' }}
        >
          <PlusCircle size={15} />
          New Entry
        </Link>
      </div>
    </nav>
  );
}
