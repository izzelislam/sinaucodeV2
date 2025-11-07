export const ARTICLES = [
  {
    id: 'responsive-blog-tailwind',
    title: 'Build a Responsive Blog UI with Tailwind CSS',
    excerpt: 'Design a clean, production-ready blog layout using Tailwind and modern patterns.',
    cover: 'https://images.unsplash.com/photo-1525286116112-b59af11adad1?q=80&w=1400&auto=format&fit=crop',
    category: 'UI',
    tags: ['tailwind', 'css', 'responsive'],
    author: { name: 'Alex Carter', avatar: 'https://i.pravatar.cc/100?img=12' },
    date: '2025-06-01',
    readTime: '8 min',
  },
  {
    id: 'js-fetch-api-guide',
    title: 'JavaScript Fetch API: A Practical Guide',
    excerpt: 'Use fetch safely with async/await, timeouts, and error handling patterns.',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop',
    category: 'JavaScript',
    tags: ['javascript', 'api', 'http'],
    author: { name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/100?img=32' },
    date: '2025-05-21',
    readTime: '7 min',
  },
  {
    id: 'nextjs-vs-vite-choose',
    title: 'Next.js vs Vite: When to Choose What?',
    excerpt: 'Compare Next.js and Vite for different project types and team sizes.',
    cover: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1400&auto=format&fit=crop',
    category: 'Frontend',
    tags: ['nextjs', 'vite', 'react'],
    author: { name: 'Sam Lee', avatar: 'https://i.pravatar.cc/100?img=5' },
    date: '2025-04-15',
    readTime: '10 min',
  },
  {
    id: 'docker-for-node',
    title: 'Docker for Node.js Developers',
    excerpt: 'Containerize Node apps with small images, multi-stage builds, and best practices.',
    cover: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1400&auto=format&fit=crop',
    category: 'DevOps',
    tags: ['docker', 'node', 'devops'],
    author: { name: 'Nora Kim', avatar: 'https://i.pravatar.cc/100?img=64' },
    date: '2025-03-07',
    readTime: '9 min',
  },
  {
    id: 'typescript-types-you-should-know',
    title: 'TypeScript Types You Should Know',
    excerpt: 'From utility types to generics and discriminated unions.',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop',
    category: 'TypeScript',
    tags: ['typescript', 'types', 'javascript'],
    author: { name: 'Diego Alvarez', avatar: 'https://i.pravatar.cc/100?img=15' },
    date: '2025-02-10',
    readTime: '6 min',
  },
  {
    id: 'css-grid-layout-patterns',
    title: 'CSS Grid Layout Patterns',
    excerpt: 'Real-world grid patterns for dashboards, blogs, and landing pages.',
    cover: 'https://images.unsplash.com/photo-1526481280698-8fcc13fd5f1d?q=80&w=1400&auto=format&fit=crop',
    category: 'CSS',
    tags: ['css', 'grid', 'layout'],
    author: { name: 'Maya Ito', avatar: 'https://i.pravatar.cc/100?img=47' },
    date: '2025-01-22',
    readTime: '8 min',
  },
  {
    id: 'node-testing-vitest',
    title: 'Testing Node.js with Vitest',
    excerpt: 'Fast, modern testing with built-in mocking and TypeScript support.',
    cover: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop',
    category: 'Node.js',
    tags: ['node', 'testing', 'vitest'],
    author: { name: 'Omar Faruk', avatar: 'https://i.pravatar.cc/100?img=23' },
    date: '2024-12-12',
    readTime: '7 min',
  },
];

export const getTagList = () => {
  const categories = new Set(['All']);
  const tagSet = new Set();

  ARTICLES.forEach((article) => {
    categories.add(article.category);
    (article.tags || []).forEach((tag) => tagSet.add(tag));
  });

  return Array.from(new Set([...categories, ...tagSet]));
};
