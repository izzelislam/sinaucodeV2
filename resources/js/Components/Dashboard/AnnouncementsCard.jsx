import { usePage } from '@inertiajs/react';

const toneColors = ['bg-brand-500', 'bg-accent-400', 'bg-emerald-400', 'bg-purple-400', 'bg-sky-400'];

export default function AnnouncementsCard() {
  const { popularTags, summary } = usePage().props;
  const displayTags = popularTags.slice(0, 10);

  return (
    <article className="rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Popular Tags</p>
          <p className="text-xl font-semibold">Most used</p>
        </div>
        <span className="text-xs text-slate-400">{summary.total_tags} total</span>
      </div>
      <div className="mt-6 space-y-5 text-sm">
        {displayTags.length > 0 ? (
          displayTags.map((tag, index) => (
            <div key={tag.id} className="flex gap-3 items-center">
              <span className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${toneColors[index % toneColors.length]}`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{tag.name}</p>
                <p className="text-xs text-slate-500">{tag.count} articles</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-4 text-slate-500">No tags yet</p>
        )}
      </div>
    </article>
  );
}
