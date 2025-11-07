const events = [
  {
    time: 'Today, 10:00',
    title: 'Design System QA',
    meta: 'Product • 6 members',
  },
  {
    time: 'Tomorrow, 14:00',
    title: 'Growth Forecast review',
    meta: 'Growth • 4 members',
  },
  {
    time: 'Fri, 09:30',
    title: 'Data integrity check',
    meta: 'Ops • 5 members',
  },
];

export default function ScheduleCard() {
  return (
    <article className="rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Scheduled</p>
          <p className="text-xl font-semibold">Upcoming sync</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">3 events</span>
      </div>
      <div className="mt-6 space-y-4">
        {events.map((event) => (
          <div key={event.title} className="rounded-2xl border border-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{event.time}</p>
            <p className="mt-1 font-semibold">{event.title}</p>
            <p className="text-xs text-slate-500">{event.meta}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
