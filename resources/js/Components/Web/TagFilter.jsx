import { useRef } from 'react';

const TagFilter = ({ tags = [], activeTag, onSelect }) => {
  const scrollContainerRef = useRef(null);

  if (!tags.length) return null;

  const handleClick = (tag) => {
    onSelect?.(tag);

    // Scroll the selected tag into view
    if (scrollContainerRef.current) {
      const buttonElements = scrollContainerRef.current.querySelectorAll('button');
      const selectedButton = Array.from(buttonElements).find(
        button => button.textContent.trim() === tag
      );

      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  };

  return (
    <div className="relative group">
      {/* Background container with subtle border */}
      <div className="relative bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

        {/* Subtle gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 dark:from-slate-800/50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 dark:from-slate-800/50 to-transparent z-10 pointer-events-none"></div>

        {/* Enhanced scroll hint arrows */}
        <button
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
            }
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="Scroll left"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
            }
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="Scroll right"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scrollable container with better spacing */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide py-3 px-6 scroll-smooth tag-scroll-container items-center"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {tags.map((tag) => {
            const isActive = activeTag?.toLowerCase() === tag.toLowerCase();

            // Enhanced base classes with better styling
            const baseClasses =
              'inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800';

            // Inactive state styling
            const inactiveClasses =
              'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm hover:-translate-y-0.5';

            // Active state styling
            const activeClasses =
              isActive
                ? 'border-sky-500 bg-sky-500 text-white shadow-md ring-2 ring-sky-500/20 ring-offset-2 dark:ring-offset-slate-900'
                : inactiveClasses;

            return (
              <button
                key={tag}
                type="button"
                aria-pressed={isActive}
                className={`${baseClasses} ${activeClasses}`}
                onClick={() => handleClick(tag)}
              >
                {tag}
              </button>
            );
          })}

          {/* Spacing at the end for better scroll experience */}
          <div className="w-2 shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default TagFilter;
