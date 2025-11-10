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

  // Generate SEO meta tags
  const seoMeta = {
    title: searchTerm
      ? `Search results for "${searchTerm}" - TechTutor`
      : activeTag !== 'All'
      ? `${activeTag} Articles - TechTutor`
      : "TechTutor — Learn to build with modern tools",
    description: searchTerm
      ? `Find articles about "${searchTerm}". Discover high-quality tutorials, guides, and resources for modern web development.`
      : activeTag !== 'All'
      ? `Browse ${activeTag} articles and tutorials. Learn ${activeTag.toLowerCase()} with comprehensive guides and examples.`
      : "Learn to build with modern tools through comprehensive tutorials, guides, and articles. Master web development, programming languages, and cutting-edge technologies.",
    keywords: searchTerm
      ? `${searchTerm}, tutorial, guide, programming, web development, coding`
      : activeTag !== 'All'
      ? `${activeTag}, ${activeTag.toLowerCase()} tutorial, programming, web development, coding, ${activeTag.toLowerCase()} guide`
      : "web development, programming, tutorial, coding, javascript, react, php, laravel, modern tools, tech education",
    canonical: typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''}`
      : '',
    openGraph: {
      type: 'website',
      title: searchTerm
        ? `Search results for "${searchTerm}" - TechTutor`
        : activeTag !== 'All'
        ? `${activeTag} Articles - TechTutor`
        : "TechTutor — Learn to build with modern tools",
      description: searchTerm
        ? `Find articles about "${searchTerm}". Discover high-quality tutorials and guides.`
        : activeTag !== 'All'
        ? `Browse ${activeTag} articles and tutorials. Learn ${activeTag.toLowerCase()} with comprehensive guides.`
        : "Learn to build with modern tools through comprehensive tutorials and guides.",
      images: [{
        url: typeof window !== 'undefined' ? `${window.location.origin}/images/og-image.jpg` : '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechTutor - Learn Modern Web Development'
      }],
      siteName: 'TechTutor',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@techtutor',
      creator: '@techtutor',
      title: searchTerm
        ? `Search results for "${searchTerm}" - TechTutor`
        : activeTag !== 'All'
        ? `${activeTag} Articles - TechTutor`
        : "TechTutor — Learn to build with modern tools",
      description: searchTerm
        ? `Find articles about "${searchTerm}". Discover high-quality tutorials and guides.`
        : activeTag !== 'All'
        ? `Browse ${activeTag} articles and tutorials. Learn ${activeTag.toLowerCase()} with comprehensive guides.`
        : "Learn to build with modern tools through comprehensive tutorials and guides.",
      image: typeof window !== 'undefined' ? `${window.location.origin}/images/og-image.jpg` : '/images/og-image.jpg'
    }
  };

  // Generate structured data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': searchTerm ? 'SearchResultsPage' : 'CollectionPage',
    name: seoMeta.title,
    description: seoMeta.description,
    url: seoMeta.canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: 'TechTutor',
      url: typeof window !== 'undefined' ? window.location.origin : ''
    },
    mainEntity: searchTerm ? {
      '@type': 'ItemList',
      numberOfItems: displayedArticles.length,
      itemListElement: displayedArticles.map((article, index) => ({
        '@type': 'Article',
        position: index + 1,
        name: article.title,
        description: article.excerpt,
        url: typeof window !== 'undefined' ? `${window.location.origin}/article/${article.slug}` : '',
        author: {
          '@type': 'Person',
          name: article.author?.name || 'Anonymous'
        },
        datePublished: article.published_at,
        dateModified: article.published_at,
        image: article.featured_image ? {
          '@type': 'ImageObject',
          url: article.featured_image
        } : undefined,
        publisher: {
          '@type': 'Organization',
          name: 'TechTutor',
          logo: {
            '@type': 'ImageObject',
            url: typeof window !== 'undefined' ? `${window.location.origin}/images/logo.png` : '/images/logo.png'
          }
        }
      }))
    } : {
      '@type': 'ItemList',
      numberOfItems: displayedArticles.length,
      itemListElement: displayedArticles.map((article, index) => ({
        '@type': 'Article',
        position: index + 1,
        name: article.title,
        description: article.excerpt,
        url: typeof window !== 'undefined' ? `${window.location.origin}/article/${article.slug}` : '',
        author: {
          '@type': 'Person',
          name: article.author?.name || 'Anonymous'
        },
        datePublished: article.published_at,
        dateModified: article.published_at
      }))
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: typeof window !== 'undefined' ? window.location.origin : ''
        },
        ...(searchTerm ? [{
          '@type': 'ListItem',
          position: 2,
          name: `Search: ${searchTerm}`,
          item: seoMeta.canonical
        }] : activeTag !== 'All' ? [{
          '@type': 'ListItem',
          position: 2,
          name: activeTag,
          item: typeof window !== 'undefined' ? `${window.location.origin}/?category=${encodeURIComponent(activeTag)}` : ''
        }] : [])
      ]
    }
  };

  return (
    <WebLayout auth={auth}>
      <Head>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {seoMeta.canonical && <link rel="canonical" href={seoMeta.canonical} />}

        {/* Open Graph tags */}
        <meta property="og:type" content={seoMeta.openGraph.type} />
        <meta property="og:title" content={seoMeta.openGraph.title} />
        <meta property="og:description" content={seoMeta.openGraph.description} />
        <meta property="og:url" content={seoMeta.canonical} />
        <meta property="og:site_name" content={seoMeta.openGraph.siteName} />
        <meta property="og:locale" content={seoMeta.openGraph.locale} />
        {seoMeta.openGraph.images.map((image, index) => (
          <meta key={index} property="og:image" content={image.url} />
        ))}
        {seoMeta.openGraph.images.map((image, index) => (
          <meta key={index} property="og:image:width" content={image.width} />
        ))}
        {seoMeta.openGraph.images.map((image, index) => (
          <meta key={index} property="og:image:height" content={image.height} />
        ))}
        {seoMeta.openGraph.images.map((image, index) => (
          <meta key={index} property="og:image:alt" content={image.alt} />
        ))}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:site" content={seoMeta.twitter.site} />
        <meta name="twitter:creator" content={seoMeta.twitter.creator} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <meta name="twitter:image" content={seoMeta.twitter.image} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />

        {/* Additional meta tags */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="application-name" content="TechTutor" />
        <meta name="apple-mobile-web-app-title" content="TechTutor" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Hreflang tags for internationalization */}
        <link rel="alternate" hrefLang="en" href={seoMeta.canonical} />
        <link rel="alternate" hrefLang="x-default" href={seoMeta.canonical} />
      </Head>

      <header>
        <Hero
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          onSearchClick={algolia?.appId && algolia?.searchApiKey ? () => setSearchOpen(true) : null}
          categories={categories}
          onCategorySelect={handleCategorySelect}
        />
      </header>

      <main id="main-content" ref={resultRef} className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mt-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <a href="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                Home
              </a>
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 mx-2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {searchTerm ? (
                <span className="text-slate-900 dark:text-slate-100 font-medium">Search: "{searchTerm}"</span>
              ) : activeTag !== 'All' ? (
                <span className="text-slate-900 dark:text-slate-100 font-medium">{activeTag}</span>
              ) : (
                <span className="text-slate-900 dark:text-slate-100 font-medium">All Articles</span>
              )}
            </li>
          </ol>
        </nav>

        {/* Filter Section */}
        <section aria-label="Content Filters" className="mt-10">
          <TagFilter tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
        </section>

        {/* Series Tutorials Section */}
        <section aria-labelledby="series-heading" className="mt-10">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Series tutorials</p>
              <h2 id="series-heading" className="text-2xl font-bold text-slate-900 dark:text-white">Deep dives you can follow step-by-step</h2>
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
              aria-label="Clear all filters"
            >
              Clear filters
            </button>
          </header>
          <div className="-mx-4 mt-6 flex gap-4 overflow-x-auto pb-4 sm:mx-0" role="list">
            {seriesTutorials.length > 0 ? (
              seriesTutorials.map((series) => (
                <article
                  key={series.id}
                  onClick={() => handleSeriesClick(series.category)}
                  className="min-w-[220px] max-w-[240px] flex-none rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 hover:shadow-md transition-shadow cursor-pointer"
                  role="listitem"
                  aria-labelledby={`series-title-${series.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{series.category}</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      {series.parts} parts
                    </span>
                  </div>
                  <h3 id={`series-title-${series.id}`} className="text-base font-semibold text-slate-900 dark:text-white leading-tight line-clamp-2">{series.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{series.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{series.level}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 transition group-hover:text-sky-500 dark:text-sky-400 dark:group-hover:text-sky-300" aria-hidden="true">
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
        </section>

        {/* Articles Section */}
        <section aria-labelledby="articles-heading" className="mt-12">
          <header>
            <h2 id="articles-heading" className="sr-only">
              {searchTerm
                ? `Search results for "${searchTerm}"`
                : activeTag !== 'All'
                ? `${activeTag} Articles`
                : 'Latest Articles'
              }
            </h2>
            {displayedArticles.length > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Showing {displayedArticles.length} of {filteredArticles.length} articles
              </p>
            )}
          </header>
          <ArticleGrid articles={displayedArticles} />

          {/* Load more indicator */}
          {isLoadingMore && (
            <div className="mt-8 flex justify-center" role="status" aria-live="polite">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-500" aria-hidden="true"></div>
                <span className="text-sm">Loading more articles...</span>
              </div>
            </div>
          )}

          {/* No more articles indicator */}
          {!hasMore && displayedArticles.length > 0 && displayedArticles.length === filteredArticles.length && (
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400" role="status">
                Showing all {displayedArticles.length} articles
              </p>
            </div>
          )}

          {/* No articles found */}
          {displayedArticles.length === 0 && (
            <div className="mt-8 text-center py-12" role="status" aria-live="polite">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4" aria-hidden="true">
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
                aria-label="Reset all filters and show all articles"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Pagination or Load More Section */}
        {hasMore && displayedArticles.length > 0 && (
          <section aria-label="Load More Articles" className="mt-12 text-center">
            <button
              onClick={loadMoreArticles}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Load more articles"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Load more articles
            </button>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Showing {displayedArticles.length} of {filteredArticles.length} articles
            </p>
          </section>
        )}
      </main>

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sky-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Algolia Search Modal */}
      {algolia?.appId && algolia?.searchApiKey && (
        <AlgoliaSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          algoliaConfig={algolia}
        />
      )}

      {/* Schema.org Website markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'TechTutor',
            description: 'Learn to build with modern tools through comprehensive tutorials, guides, and articles.',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: typeof window !== 'undefined' ? `${window.location.origin}/?q={search_term_string}` : ''
              },
              'query-input': 'required name=search_term_string'
            },
            publisher: {
              '@type': 'Organization',
              name: 'TechTutor',
              logo: {
                '@type': 'ImageObject',
                url: typeof window !== 'undefined' ? `${window.location.origin}/images/logo.png` : '/images/logo.png'
              }
            }
          })
        }}
      />
    </WebLayout>
  );
};

export default Index;
