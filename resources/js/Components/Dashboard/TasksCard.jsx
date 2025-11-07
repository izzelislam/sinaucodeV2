import { usePage, Link } from '@inertiajs/react';

const statusStyles = {
  published: { badge: 'Live', style: 'bg-emerald-100 text-emerald-700' },
  draft: { badge: 'Draft', style: 'bg-amber-100 text-amber-700' },
  scheduled: { badge: 'Scheduled', style: 'bg-brand-50 text-brand-700' },
};

export default function TasksCard() {
  const { recentArticles } = usePage().props;
  const displayArticles = recentArticles.slice(0, 3);

  return (
    <article className="rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Recent Articles</p>
          <p className="text-xl font-semibold">Latest content</p>
        </div>
        <Link href="/admin/articles/create" className="text-xs text-brand-600 hover:text-brand-700">
          Create New
        </Link>
      </div>
      <ul className="mt-6 space-y-4 text-sm">
        {displayArticles.length > 0 ? (
          displayArticles.map((article) => {
            const statusInfo = statusStyles[article.status] || statusStyles.draft;
            return (
              <li key={article.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{article.title}</p>
                  <p className="text-xs text-slate-500">
                    {article.created_at} • {article.author}
                  </p>
                </div>
                <span className={`ml-2 flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.style}`}>
                  {statusInfo.badge}
                </span>
              </li>
            );
          })
        ) : (
          <li className="text-center py-8 text-slate-500">
            No articles yet. Create your first article!
          </li>
        )}
      </ul>
    </article>
  );
}
