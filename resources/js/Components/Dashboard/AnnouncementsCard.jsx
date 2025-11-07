const updates = [
  {
    title: 'Automations get re-run & scheduling rules',
    time: 'Shipped 2h ago',
    tone: 'bg-brand-500',
  },
  {
    title: 'New components for finance dashboards',
    time: 'Shipped yesterday',
    tone: 'bg-accent-400',
  },
  {
    title: 'Resolved latency spikes on webhooks',
    time: 'Shipped Mon',
    tone: 'bg-emerald-400',
  },
];

export default function AnnouncementsCard() {
  return (
    <article className="rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Announcements</p>
          <p className="text-xl font-semibold">What changed</p>
        </div>
        <button className="text-xs text-slate-400">View log</button>
      </div>
      <div className="mt-6 space-y-5 text-sm">
        {updates.map((update) => (
          <div key={update.title} className="flex gap-3">
            <span className={`mt-1 h-2 w-2 rounded-full ${update.tone}`} />
            <div>
              <p className="font-semibold">{update.title}</p>
              <p className="text-xs text-slate-500">{update.time}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
