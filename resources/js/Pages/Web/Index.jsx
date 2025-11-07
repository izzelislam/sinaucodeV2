import { useMemo, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import WebLayout from '../../Layouts/WebLayout';
import Hero from '../../Components/Web/Hero';
import TagFilter from '../../Components/Web/TagFilter';
import ArticleGrid from '../../Components/Web/ArticleGrid';
import { ARTICLES, getTagList } from '../../data/articles';
import { Description } from '@headlessui/react';

const Index = ({ auth }) => {
  const [activeTag, setActiveTag] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const resultRef = useRef(null);

  const tags = useMemo(() => getTagList(), []);

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

  return (
    <WebLayout auth={auth}>
      <Head title="TechTutor — Learn to build with modern tools" />
      
      <Hero searchValue={searchTerm} onSearchChange={setSearchTerm} onSearchSubmit={handleSearchSubmit} />
      <section ref={resultRef} className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mt-10">
          <TagFilter tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
        </div>
        <div className="mt-6">
          <ArticleGrid articles={filteredArticles} />
        </div>
      </section>
    </WebLayout>
  );
};

export default Index;
