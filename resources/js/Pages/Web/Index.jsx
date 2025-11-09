import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import WebLayout from '../../Layouts/WebLayout';
import Hero from '../../Components/Web/Hero';
import TagFilter from '../../Components/Web/TagFilter';
import ArticleGrid from '../../Components/Web/ArticleGrid';
import TypingText from '../../Components/Web/TypingText';
import AlgoliaSearchModal from '../../Components/Web/AlgoliaSearch';

const Index = ({ auth, articles = [], seriesTutorials = [], categories = [], tags = [], algolia = {} }) => {
  const [activeTag, setActiveTag] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const resultRef = useRef(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  
  const filteredArticles = useMemo(() => {
    // Use Algolia search results if available and we have a search term
    if (searchResults && searchTerm.trim()) {
      return searchResults.filter((article) => {
        const normalizedTag = activeTag.toLowerCase();
        return (
          normalizedTag === 'all' ||
          article.category.toLowerCase() === normalizedTag ||
          article.tags.some((tag) => tag.toLowerCase() === normalizedTag)
        );
      });
    }

    // Fallback to client-side filtering
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedTag = activeTag.toLowerCase();

    return articles.filter((article) => {
      const matchesTag =
        normalizedTag === 'all' ||
        article.category.toLowerCase() === normalizedTag ||
        article.tags.some((tag) => tag.toLowerCase() === normalizedTag);

      if (!matchesTag) return false;
      if (!normalizedSearch) return true;

      const haystack = [
        article.title,
        article.excerpt,
        article.author?.name ?? '',
        article.tags.join(' '),
        article.category,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [articles, activeTag, searchTerm, searchResults]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(6);
    setHasMore(true);
  }, [activeTag, searchTerm]);

  // Update hasMore when filtered articles change
  useEffect(() => {
    const totalFiltered = filteredArticles.length;
    setHasMore(totalFiltered > displayedCount);
  }, [filteredArticles, displayedCount]);

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // Trigger load more when 200px from bottom
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreArticles();
    }
  }, [isLoadingMore, hasMore]);

  const loadMoreArticles = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 6, filteredArticles.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, filteredArticles.length]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Get articles to display
  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, displayedCount);
  }, [filteredArticles, displayedCount]);

  const handleSearchSubmit = (query) => {
    if (query) {
      // Perform Algolia search
      performAlgoliaSearch(query);
    } else {
      // Clear search results
      setSearchResults(null);
      setSearchTerm(query);
    }
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const performAlgoliaSearch = async (query) => {
    if (!algolia?.appId || !algolia?.searchApiKey) {
      setSearchTerm(query);
      return;
    }

    setIsSearching(true);
    setSearchTerm(query);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${activeTag}&limit=50`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      } else {
        console.error('Search failed:', data.message);
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategorySelect = (category) => {
    setActiveTag(category);
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSeriesClick = (seriesCategory) => {
    setActiveTag(seriesCategory);
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <WebLayout auth={auth}>
      <Head title="TechTutor — Learn to build with modern tools" />

      <Hero
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        onSearchClick={algolia?.appId && algolia?.searchApiKey ? () => setSearchOpen(true) : null}
        categories={categories}
        onCategorySelect={handleCategorySelect}
      />
      <section ref={resultRef} className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mt-10">
          <TagFilter tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
        </div>
        <div className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Series tutorials</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Deep dives you can follow step-by-step</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <TypingText
                  text="Bite-sized playlists that bundle our best lessons into themed learning paths."
                  speed={30}
                  className="inline-block"
                />
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCategorySelect('All')}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              Clear filters
            </button>
          </div>
          <div className="-mx-4 mt-6 flex gap-4 overflow-x-auto pb-4 sm:mx-0">
            {seriesTutorials.length > 0 ? (
              seriesTutorials.map((series) => (
                <article
                  key={series.id}
                  onClick={() => handleSeriesClick(series.category)}
                  className="min-w-[220px] max-w-[240px] flex-none rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{series.category}</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      {series.parts}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight line-clamp-2">{series.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{series.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{series.level}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 transition group-hover:text-sky-500 dark:text-sky-400 dark:group-hover:text-sky-300">
                      Explore
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="flex w-full justify-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No series tutorials available yet.</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12">
          <ArticleGrid articles={displayedArticles} />

          {/* Load more indicator */}
          {isLoadingMore && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-500"></div>
                <span className="text-sm">Loading more articles...</span>
              </div>
            </div>
          )}

          {/* No more articles indicator */}
          {!hasMore && displayedArticles.length > 0 && displayedArticles.length === filteredArticles.length && (
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing all {displayedArticles.length} articles
              </p>
            </div>
          )}

          {/* No articles found */}
          {displayedArticles.length === 0 && (
            <div className="mt-8 text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {searchTerm
                  ? `No articles found for "${searchTerm}". Try different keywords or browse categories.`
                  : `No articles found in "${activeTag}". Try selecting a different category.`
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveTag('All');
                }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Algolia Search Modal */}
      {algolia?.appId && algolia?.searchApiKey && (
        <AlgoliaSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          algoliaConfig={algolia}
        />
      )}
    </WebLayout>
  );
};

export default Index;
