const tasks = [
  {
    title: 'Finalize onboarding screens',
    subtitle: 'Due today • Design Squad',
    badge: 'In progress',
    badgeStyle: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'Sync analytics events',
    subtitle: 'Due tomorrow • DevOps Crew',
    badge: 'Pending',
    badgeStyle: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'Activate lifecycle campaign',
    subtitle: 'Next 2 days • Growth Team',
    badge: 'Review',
    badgeStyle: 'bg-brand-50 text-brand-700',
  },
];

export default function TasksCard() {
  return (
    <article className="rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Tasks</p>
          <p className="text-xl font-semibold">Daily queue</p>
        </div>
        <button className="text-xs text-brand-600">Assign</button>
      </div>
      <ul className="mt-6 space-y-4 text-sm">
        {tasks.map((task) => (
          <li key={task.title} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-xs text-slate-500">{task.subtitle}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.badgeStyle}`}>{task.badge}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
