const Hero = ({ searchValue = '', onSearchChange, onSearchSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit?.();
  };

  const handleChange = (event) => {
    onSearchChange?.(event.target.value);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 3h2v4h-2zM4.222 5.636l1.414-1.414L8.05 6.636 6.636 8.05zM3 11h4v2H3zM6.636 15.95 8.05 17.364l-2.414 2.414-1.414-1.414zM11 17h2v4h-2zM15.95 15.95l1.414 1.414 2.414-2.414-1.414-1.414zM17 11h4v2h-4zM15.95 8.05 17.364 6.636l-2.414-2.414-1.414 1.414z" />
          </svg>
          New: Fresh tutorials weekly
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Become a better dev, one tutorial at a time</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Clean, modern guides on JavaScript, Node, CSS, React, and more — with readable code samples and best practices.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-2xl gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 20.3 16.65 16a7.5 7.5 0 1 0-1.4 1.4L20.3 21 21 20.3ZM4 10.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z" />
              </svg>
            </span>
            <input
              type="search"
              value={searchValue}
              onChange={handleChange}
              placeholder="Search articles, e.g. 'react performance'..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
