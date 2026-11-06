'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('menu') === 'open') {
        setIsMenuOpen(true);
      }
    } catch {}
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-bg border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="font-serif text-2xl tracking-tight text-ink hover:underline decoration-accent decoration-2 underline-offset-4 dark:hover:text-accent transition-colors duration-200 shrink-0"
          onClick={closeMenu}
        >
          Balaji Dasetti
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm" aria-label="Main Navigation">
          <Link
            href="/#work"
            className="text-ink hover:underline decoration-accent underline-offset-4 dark:hover:text-accent transition-colors duration-200"
          >
            Work
          </Link>
          <Link
            href="/#stack"
            className="text-ink hover:underline decoration-accent underline-offset-4 dark:hover:text-accent transition-colors duration-200"
          >
            Stack
          </Link>
          <Link
            href="/#about"
            className="text-ink hover:underline decoration-accent underline-offset-4 dark:hover:text-accent transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="text-ink hover:underline decoration-accent underline-offset-4 dark:hover:text-accent transition-colors duration-200"
          >
            Contact
          </Link>
          {/* TODO: Replace /resume.pdf with real resume file before deployment */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink border border-line px-3 py-1 hover:border-accent hover:underline decoration-accent dark:hover:text-accent transition-colors duration-200"
          >
            Resume
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 sm:gap-3 md:hidden shrink-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="p-1.5 text-ink border border-line focus-visible:outline-2 focus-visible:outline-accent"
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Plain and simple, solid background, clean hairline borders) */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden border-t border-line bg-bg px-4 sm:px-6 py-6 flex flex-col gap-4 text-base"
          aria-label="Mobile Navigation"
        >
          <Link
            href="/#work"
            onClick={closeMenu}
            className="text-ink hover:underline decoration-accent dark:hover:text-accent py-1 border-b border-line border-dashed"
          >
            Work
          </Link>
          <Link
            href="/#stack"
            onClick={closeMenu}
            className="text-ink hover:underline decoration-accent dark:hover:text-accent py-1 border-b border-line border-dashed"
          >
            Stack
          </Link>
          <Link
            href="/#about"
            onClick={closeMenu}
            className="text-ink hover:underline decoration-accent dark:hover:text-accent py-1 border-b border-line border-dashed"
          >
            About
          </Link>
          <Link
            href="/#contact"
            onClick={closeMenu}
            className="text-ink hover:underline decoration-accent dark:hover:text-accent py-1 border-b border-line border-dashed"
          >
            Contact
          </Link>
          {/* TODO: Replace /resume.pdf with real resume file before deployment */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="text-ink hover:underline decoration-accent dark:hover:text-accent py-1"
          >
            Resume
          </a>
        </nav>
      )}
    </header>
  );
}
