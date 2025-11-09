import CyclingTypingText from './CyclingTypingText';

const Hero = ({ searchValue = '', onSearchChange, onSearchSubmit, categories = [], onCategorySelect, onSearchClick }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSearchClick) {
      onSearchClick();
    } else {
      onSearchSubmit?.();
    }
  };

  const handleChange = (event) => {
    onSearchChange?.(event.target.value);
  };

  const handleSearchFocus = () => {
    if (onSearchClick) {
      onSearchClick();
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 3h2v4h-2zM4.222 5.636l1.414-1.414L8.05 6.636 6.636 8.05zM3 11h4v2H3zM6.636 15.95 8.05 17.364l-2.414 2.414-1.414-1.414zM11 17h2v4h-2zM15.95 15.95l1.414 1.414 2.414-2.414-1.414-1.414zM17 11h4v2h-4zM15.95 8.05 17.364 6.636l-2.414-2.414-1.414 1.414z" />
          </svg>
          New: Fresh tutorials weekly
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Become a better{' '}
          <CyclingTypingText
            phrases={[
              'dev, one tutorial at a time',
              'developer with modern tools',
              'programmer through practice',
              'coder step by step',
              'engineer with best practices',
              'builder with real projects',
              'creator through tutorials',
              'problem solver with code',
              'software craftsman',
              'full-stack developer',
              'frontend specialist',
              'backend architect',
              'DevOps engineer',
              'mobile app developer',
              'game developer',
              'AI/ML engineer',
              'data scientist',
              'security expert',
              'cloud architect',
              'UI/UX developer',
              'web performance expert',
              'API designer',
              'database expert',
              'system architect',
              'tech lead',
              'software consultant',
              'product engineer',
              'platform engineer',
              'site reliability engineer',
              'blockchain developer',
              'AR/VR developer',
              'IoT developer',
              'quantum computing pioneer',
              'ethical hacker',
              'cybersecurity expert',
              'machine learning engineer',
              'deep learning specialist',
              'computer vision engineer',
              'natural language processing expert',
              'robotics engineer',
              'embedded systems developer',
              'firmware engineer',
              'network engineer',
              'systems programmer',
              'compiler engineer',
              'tools developer',
              'DevSecOps engineer',
              'infrastructure engineer',
              'cloud native developer',
              'microservices architect',
              'distributed systems expert',
              'performance engineer',
              'scalability architect',
              'reliability engineer',
              'automation engineer',
              'CI/CD specialist',
              'testing engineer',
              'quality assurance engineer',
              'technical writer',
              'developer advocate',
              'solutions architect',
              'enterprise architect',
              'software architect',
              'principal engineer',
              'staff engineer',
              'senior developer',
              'tech manager',
              'engineering manager',
              'VP of Engineering',
              'CTO'
            ]}
            typingSpeed={100}
            deletingSpeed={50}
            delayBetweenPhrases={3000}
            className="text-sky-600 dark:text-sky-400"
          />
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          Clean, modern guides on JavaScript, Node, CSS, React, and more — with readable code samples and best practices.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-2xl gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 20.3 16.65 16a7.5 7.5 0 1 0-1.4 1.4L20.3 21 21 20.3ZM4 10.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z" />
              </svg>
            </span>
            <input
              type="search"
              value={searchValue}
              onChange={handleChange}
              onFocus={handleSearchFocus}
              onClick={handleSearchFocus}
              placeholder="Search articles, tutorials, tips and tricks..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 cursor-pointer"
              readOnly={!!onSearchClick}
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Search
          </button>
        </form>

        {categories.length > 0 && (
          <div className="mx-auto mt-8 max-w-4xl text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Browse by category</p>
            <div className="-mx-2 mt-3 flex gap-3 overflow-x-auto pb-3 sm:mx-0">
              {categories.map((category) => (
                <button
                  key={category.id || category}
                  type="button"
                  onClick={() => onCategorySelect?.(category.name || category)}
                  className="group flex-none min-w-[140px] max-w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    {category.featured_image ? (
                      <div className="relative h-10 w-10 flex-none overflow-hidden rounded-lg">
                        <img
                          src={category.featured_image}
                          alt={category.name}
                          className="h-full w-full object-cover transition group-hover:scale-110"
                        />
                      </div>
                    ) : category.name === 'All' ? (
                      <div className="relative h-10 w-10 flex-none overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="relative h-10 w-10 flex-none overflow-hidden rounded-lg bg-gradient-to-br from-sky-400 to-blue-600">
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                          {category.name ? category.name.substring(0, 2).toUpperCase() : 'CA'}
                        </div>
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                        {category.name || category}
                      </h3>
                      {category.article_count && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {category.article_count} {category.article_count === 1 ? 'article' : 'articles'}
                        </p>
                      )}
                      {category.name === 'All' && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          View all articles
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
