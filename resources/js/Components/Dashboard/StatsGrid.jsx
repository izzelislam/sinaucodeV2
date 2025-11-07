import { usePage } from '@inertiajs/react';

const Card = ({ title, value, note, tag, caption, progress, delta }) => (
  <article className="rounded-2xl border border-white/60 bg-white p-5 shadow-soft">
    <p className="text-sm text-slate-500">{title}</p>
    {progress !== undefined ? (
      <>
        <div className="mt-4 flex items-end gap-2">
          <p className="text-3xl font-semibold">{value}</p>
          {delta && <span className="text-xs text-green-500">{delta}</span>}
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-accent-400" style={{ width: `${progress}%` }} />
        </div>
      </>
    ) : (
      <p className="mt-4 text-3xl font-semibold">{value}</p>
    )}
    {tag ? (
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex h-6 items-center rounded-full bg-brand-50 px-2 text-brand-600">{tag}</span>
        {caption}
      </div>
    ) : note ? (
      <p className={`mt-2 text-xs font-semibold ${note.className}`}>{note.text}</p>
    ) : null}
  </article>
);

export default function StatsGrid() {
  const { stats } = usePage().props;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => (
        <Card key={card.title} {...card} />
      ))}
    </section>
  );
}
