import { usePage } from '@inertiajs/react';

export default function VelocityOverview() {
  const { contentPerformance } = usePage().props;

  const maxArticles = Math.max(...contentPerformance.map(d => d.articles), 1);

  return (
    <article className="lg:col-span-2 rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Content Performance</p>
          <p className="text-xl font-semibold">Last 7 days</p>
        </div>
        <a href="/admin/articles" className="text-sm text-brand-600 hover:text-brand-700">View all</a>
      </div>
      <div className="mt-6 grid grid-cols-12 gap-2">
        <div className="col-span-12 flex items-end gap-2 text-[10px] uppercase tracking-wide text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            Articles Published
          </span>
        </div>
        <div className="col-span-12 mt-6 grid grid-cols-7 gap-3">
          {contentPerformance.map((day) => {
            const percentage = maxArticles > 0 ? (day.articles / maxArticles) * 100 : 0;
            return (
              <div key={day.date} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{day.date}</p>
                <p className="mt-2 text-lg font-semibold">{day.articles}</p>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div 
                    className="h-full rounded-full bg-brand-500" 
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
