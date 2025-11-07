const weeks = [
  { label: 'Week 18', value: 86, tone: 'brand' },
  { label: 'Week 19', value: 92, tone: 'accent' },
  { label: 'Week 20', value: 78, tone: 'brand' },
  { label: 'Week 21', value: 98, tone: 'accent' },
  { label: 'Week 22', value: 69, tone: 'brand' },
  { label: 'Week 23', value: 88, tone: 'accent' },
];

const toneClass = {
  brand: 'bg-brand-500',
  accent: 'bg-accent-400',
};

export default function VelocityOverview() {
  return (
    <article className="lg:col-span-2 rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Velocity Overview</p>
          <p className="text-xl font-semibold">Delivery timeline</p>
        </div>
        <button className="text-sm text-brand-600">Last 12 weeks</button>
      </div>
      <div className="mt-6 grid grid-cols-12 gap-2">
        <div className="col-span-12 flex items-end gap-2 text-[10px] uppercase tracking-wide text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            Planned
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            Completed
          </span>
        </div>
        <div className="col-span-12 mt-6 grid grid-cols-6 gap-3">
          {weeks.map((week) => (
            <div key={week.label} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{week.label}</p>
              <p className="mt-2 text-lg font-semibold">{week.value}%</p>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className={`h-full rounded-full ${toneClass[week.tone]}`} style={{ width: `${week.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
