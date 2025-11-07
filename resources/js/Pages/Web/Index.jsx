import { useMemo, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import WebLayout from '../../Layouts/WebLayout';
import Hero from '../../Components/Web/Hero';
import TagFilter from '../../Components/Web/TagFilter';
import ArticleGrid from '../../Components/Web/ArticleGrid';
import { ARTICLES, getTagList } from '../../data/articles';

const SERIES_TUTORIALS = [
  {
    id: 'modern-react-stack',
    title: 'Modern React Stack',
    description: 'Hooks, Suspense boundaries, server components, and testing with Vitest.',
    category: 'Frontend',
    parts: 5,
    level: 'Intermediate',
  },
  {
    id: 'typescript-pro-playbook',
    title: 'TypeScript Pro Playbook',
    description: 'Real-world typing strategies, generics, and safe API contracts.',
    category: 'TypeScript',
    parts: 6,
    level: 'Intermediate',
  },
  {
    id: 'node-api-lab',
    title: 'Node API Lab',
    description: 'From Express fundamentals to production-grade observability.',
    category: 'Node.js',
    parts: 7,
    level: 'Advanced',
  },
  {
    id: 'css-motion-design',
    title: 'CSS Motion Design',
    description: 'Fluid layouts, micro-interactions, and accessibility-friendly motion.',
    category: 'CSS',
    parts: 4,
    level: 'Beginner',
  },
];

const Index = ({ auth }) => {
  const [activeTag, setActiveTag] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const resultRef = useRef(null);

  const tags = useMemo(() => getTagList(), []);
  const categories = useMemo(() => {
    const unique = new Set(['All']);
    ARTICLES.forEach((article) => unique.add(article.category));
    return Array.from(unique);
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedTag = activeTag.toLowerCase();

    return ARTICLES.filter((article) => {
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
  }, [activeTag, searchTerm]);

  const handleSearchSubmit = () => {
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const handleCategorySelect = (category) => {
    setActiveTag(category);
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <WebLayout auth={auth}>
      <Head title="TechTutor — Learn to build with modern tools" />

      <Hero
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
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
              <p className="text-sm text-slate-500 dark:text-slate-400">Bite-sized playlists that bundle our best lessons into themed learning paths.</p>
            </div>
            <button
              type="button"
              onClick={() => handleCategorySelect('All')}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              Clear filters
            </button>
          </div>
          <div className="-mx-4 mt-6 flex gap-5 overflow-x-auto pb-4 sm:mx-0">
            {SERIES_TUTORIALS.map((series) => (
              <article
                key={series.id}
                className="min-w-[260px] max-w-[280px] flex-none rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{series.category}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{series.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{series.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>{series.parts} parts</span>
                  <span aria-hidden="true">•</span>
                  <span>{series.level}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCategorySelect(series.category)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  Explore series
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                  </svg>
                </button>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-12">
          <ArticleGrid articles={filteredArticles} />
        </div>
      </section>
    </WebLayout>
  );
};

export default Index;
