import { usePage, Link } from '@inertiajs/react';

const toneColors = ['bg-brand-500', 'bg-accent-400', 'bg-emerald-400', 'bg-sky-400', 'bg-purple-400'];

export default function TeamLoadCard() {
  const { categories } = usePage().props;

  return (
    <article className="rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Categories</p>
          <p className="text-xl font-semibold">Top performing</p>
        </div>
        <Link href="/admin/categories" className="text-xs text-slate-400 hover:text-slate-600">
          View all
        </Link>
      </div>
      <div className="mt-6 space-y-5">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <div key={category.id}>
              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold">{category.name}</p>
                <p className="text-slate-500">{category.count} articles</p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div 
                  className={`h-full rounded-full ${toneColors[index % toneColors.length]}`} 
                  style={{ width: `${Math.min(category.percentage, 100)}%` }} 
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-4 text-slate-500">No categories yet</p>
        )}
      </div>
    </article>
  );
}
