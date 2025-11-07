import { useCallback, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'theme';

const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState(null);
  const [isManual, setIsManual] = useState(false);

  const applyTheme = useCallback((nextTheme, persist) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');

    root.classList.toggle('dark', nextTheme === 'dark');
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    meta?.setAttribute('content', nextTheme === 'dark' ? '#0b1220' : '#ffffff');

    if (typeof window === 'undefined') return;
    if (persist) {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      setIsManual(true);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      setIsManual(false);
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      if (window.localStorage.getItem(THEME_STORAGE_KEY)) return;
      setTheme(event.matches ? 'dark' : 'light');
      setIsManual(false);
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!theme) return;
    applyTheme(theme, isManual);
  }, [applyTheme, isManual, theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    setIsManual(true);
  };

  const classes = [
    'rounded-lg p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="Toggle dark mode"
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
      className={classes}
    >
      <svg
        data-icon="sun"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${theme === 'dark' ? 'hidden' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm0-18a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm10 7h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM3 11H2a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2Zm15.657 8.657-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1-1.414 1.414Zm-13.314 0A1 1 0 0 1 3.93 18.93l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414 0ZM18.657 5.757a1 1 0 0 1-1.414 0l-.707-.707A1 1 0 1 1 17.95 2.93l.707.707a1 1 0 0 1 0 1.414ZM5.05 5.05 4.343 4.343A1 1 0 0 1 5.757 2.93l.707.707A1 1 0 1 1 5.05 5.05Z" />
      </svg>
      <svg
        data-icon="moon"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${theme === 'dark' ? '' : 'hidden'}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
      </svg>
    </button>
  );
};

export default ThemeToggle;
