import { useState } from 'react';
import { Link } from '@inertiajs/react';
import ThemeToggle from '../Components/Web/ThemeToggle';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Search', href: '/search' },
  { label: 'GitHub', href: 'https://github.com/', external: true },
];

const WebLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-sky-200 selection:text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">TT</span>
            <span className="text-lg font-semibold">TechTutor</span>
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => {
              const className = 'text-sm text-slate-600 transition hover:text-slate-900';
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
            <ThemeToggle />
          </nav>
          <div className="flex items-center gap-2 sm:hidden">
            <a
              href="/search"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
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
          className={`border-t border-slate-200 bg-white px-4 py-3 sm:hidden ${menuOpen ? '' : 'hidden'}`}
        >
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const classes = 'rounded px-2 py-2 text-sm text-slate-700 hover:bg-slate-100';
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
          </nav>
        </div>
        <div className="h-0.5 w-full bg-transparent">
          <div id="readingBar" className="h-0.5 w-0 bg-sky-600 transition-[width]" />
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} TechTutor. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="/search" className="hover:text-slate-900">
              Browse
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900">
              About
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebLayout;
