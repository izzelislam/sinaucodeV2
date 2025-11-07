const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
  } catch {
    return value;
  }
};

const ArticleCard = ({ article }) => {
  const { cover, title, excerpt, tags = [], author = {}, date, readTime } = article;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={cover} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-3">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-700 backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-base font-semibold text-slate-900 transition group-hover:text-sky-600">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">{excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{author.name}</span>
          <span>
            {formatDate(date)} • {readTime}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
