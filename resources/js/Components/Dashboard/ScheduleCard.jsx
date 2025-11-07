import { usePage, Link } from '@inertiajs/react';

export default function ScheduleCard() {
  const { series } = usePage().props;
  const displaySeries = series.slice(0, 3);

  const statusStyles = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-slate-100 text-slate-600',
    draft: 'bg-amber-100 text-amber-700',
  };

  return (
    <article className="rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Series</p>
          <p className="text-xl font-semibold">Content series</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {series.length} series
        </span>
      </div>
      <div className="mt-6 space-y-4">
        {displaySeries.length > 0 ? (
          displaySeries.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.count} articles</p>
                </div>
                <span className={`ml-2 flex-shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[item.status] || statusStyles.draft}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-slate-500">No series yet</p>
        )}
      </div>
      {series.length > 0 && (
        <div className="mt-4">
          <Link 
            href="/admin/series" 
            className="block text-center text-sm text-brand-600 hover:text-brand-700"
          >
            View all series →
          </Link>
        </div>
      )}
    </article>
  );
}
