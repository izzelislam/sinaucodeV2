import { useState, useEffect, useRef } from 'react';
import { algoliasearch } from 'algoliasearch';
import { router } from '@inertiajs/react';

const AlgoliaSearchModal = ({ isOpen, onClose, algoliaConfig }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        handleResultClick(results[activeIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, activeIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    if (!algoliaConfig?.appId || !algoliaConfig?.searchApiKey) {
      console.error('Algolia config is missing');
      return;
    }

    console.log('Searching for:', searchQuery);
    console.log('Algolia config:', {
      appId: algoliaConfig.appId,
      searchApiKey: algoliaConfig.searchApiKey,
      indexName: algoliaConfig.indexName
    });

    setIsLoading(true);

    try {
      const client = algoliasearch(algoliaConfig.appId, algoliaConfig.searchApiKey);
      console.log('Client created:', client);
      
      const searchParams = {
        requests: [
          {
            indexName: algoliaConfig.indexName,
            query: searchQuery,
            hitsPerPage: 10,
          },
        ],
      };
      
      console.log('Search params:', searchParams);
      
      const { results: searchResults } = await client.search(searchParams);
      
      console.log('Search results:', searchResults);

      setResults(searchResults[0]?.hits || []);
      setActiveIndex(0);
    } catch (error) {
      console.error('Algolia search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleResultClick = (item) => {
    router.visit(`/article/${item.slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-start justify-center p-4 pt-[10vh]">
        <div
          ref={modalRef}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl transform transition-all overflow-hidden"
        >
          {/* Search Input */}
          <div className="relative flex items-center border-b border-slate-200 dark:border-slate-700">
            <svg 
              className="absolute left-4 h-5 w-5 text-slate-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search articles, tutorials, tips and tricks..."
              className="w-full bg-transparent py-4 pl-12 pr-16 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
            <div className="absolute right-4 flex items-center gap-2">
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">
                ESC
              </kbd>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query ? (
              isLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-400"></div>
                </div>
              ) : results.length > 0 ? (
                <ul>
                  {results.map((item, index) => (
                    <li key={item.objectID}>
                      <button
                        onClick={() => handleResultClick(item)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full text-left px-5 py-3 border-b border-slate-100 dark:border-slate-700 transition ${
                          index === activeIndex
                            ? 'bg-slate-50 dark:bg-slate-700/50'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                        }`}
                      >
                        <div className="flex items-start gap-3 algolia-search-result">
                          {/* Featured Image */}
                          {item.featured_image ? (
                            <img
                              src={item.featured_image}
                              alt={item.title}
                              className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                              {item.title?.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            {/* Title with highlighting */}
                            <div 
                              className="font-medium text-slate-900 dark:text-white mb-1"
                              dangerouslySetInnerHTML={{ 
                                __html: item._highlightResult?.title?.value || item.title 
                              }}
                              style={{
                                wordBreak: 'break-word'
                              }}
                            />
                            
                            {/* Excerpt with highlighting */}
                            {item.excerpt && (
                              <div 
                                className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2"
                                dangerouslySetInnerHTML={{ 
                                  __html: item._highlightResult?.excerpt?.value || item.excerpt 
                                }}
                              />
                            )}
                            
                            {/* Category and author */}
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-500">
                              {item.category && (
                                <span 
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700"
                                  dangerouslySetInnerHTML={{ 
                                    __html: item._highlightResult?.category?.value || item.category 
                                  }}
                                />
                              )}
                              {item.author_name && (
                                <>
                                  <span>•</span>
                                  <span>{item.author_name}</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <svg 
                            className="h-5 w-5 text-slate-400 flex-shrink-0 mt-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-base">No results found for <strong className="text-slate-700 dark:text-slate-300">"{query}"</strong></p>
                  <p className="text-sm mt-2">Try searching with different keywords</p>
                </div>
              )
            ) : (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                <svg className="mx-auto h-12 w-12 mb-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-base">Search articles, tutorials & tips</p>
                <p className="text-sm mt-2">Start typing to find the content you need</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-[10px]">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-[10px]">↓</kbd>
                <span>to navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-[10px]">↵</kbd>
                <span>to select</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Search by</span>
              <span className="font-semibold text-sky-600 dark:text-sky-400">Algolia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgoliaSearchModal;