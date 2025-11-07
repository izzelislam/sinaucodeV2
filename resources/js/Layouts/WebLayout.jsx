import { useState } from 'react';
import { Link } from '@inertiajs/react';
import ThemeToggle from '../Components/Web/ThemeToggle';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Search', href: '/search' },
  { label: 'GitHub', href: 'https://github.com/', external: true },
];

const WebLayout = ({ children, auth }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased selection:bg-sky-200 dark:selection:bg-sky-900 selection:text-slate-900 dark:selection:text-slate-100 transition-colors">
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            {/* <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">TT</span>
            <span className="text-lg font-semibold">TechTutor</span> */}
            <img src="/sinaucode-black.png" alt="TechTutor Logo" className="h-8 w-auto" />
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => {
              const className = 'text-sm text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-slate-100';
              if (link.external) {
                return (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={className}>
                    {link.label}
                  </a>
                );
              }
              return (
                <Link key={link.label} href={link.href} className={className}>
                  {link.label}
                </Link>
              );
            })}

            {/* Dashboard link for authenticated users */}
            {auth?.user && (
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            )}

            <ThemeToggle />
          </nav>
          <div className="flex items-center gap-2 sm:hidden">
            <a
              href="/search"
              className="rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 20.3 16.65 16a7.5 7.5 0 1 0-1.4 1.4L20.3 21 21 20.3ZM4 10.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z" />
              </svg>
            </a>
            <ThemeToggle className="sm:hidden" />
            <button
              type="button"
              onClick={toggleMenu}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
              </svg>
            </button>
          </div>
        </div>
        <div
          className={`border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 sm:hidden ${menuOpen ? '' : 'hidden'}`}
        >
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const classes = 'rounded px-2 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
              if (link.external) {
                return (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={classes} onClick={closeMenu}>
                    {link.label}
                  </a>
                );
              }
              return (
                <Link key={link.label} href={link.href} className={classes} onClick={closeMenu}>
                  {link.label}
                </Link>
              );
            })}

            {/* Dashboard link for authenticated users in mobile menu */}
            {auth?.user && (
              <Link
                href="/admin/dashboard"
                className="rounded px-2 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-2"
                onClick={closeMenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="h-0.5 w-full bg-transparent">
          <div id="readingBar" className="h-0.5 w-0 bg-sky-600 transition-[width]" />
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} TechTutor. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="/search" className="hover:text-slate-900 dark:hover:text-slate-100">
              Browse
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">
              About
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebLayout;
