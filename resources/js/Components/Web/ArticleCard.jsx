import { Link } from '@inertiajs/react';

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
  } catch {
    return value;
  }
};

const ArticleCard = ({ article }) => {
  const {
    slug,
    featured_image,
    title,
    excerpt,
    tags = [],
    author = {},
    published_at,
    read_time
  } = article;

  // Use featured_image as cover, fallback to a default if no image
  const cover = featured_image || '/images/default-article-cover.jpg';
  const date = published_at;

  return (
    <Link href={`/article/${slug}`} className="group block">
      <article className="h-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={cover} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-3">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300 backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white transition group-hover:text-sky-600 dark:group-hover:text-sky-400">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">{excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <img
              src={author.avatar || '/images/default-avatar.png'}
              alt={author.name}
              className="h-6 w-6 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=6366F1&color=ffffff&size=24`;
              }}
            />
            <span>{author.name}</span>
          </div>
          <span>
            {formatDate(date)} • {read_time}
          </span>
        </div>
      </div>
    </article>
    </Link>
  );
};

export default ArticleCard;
