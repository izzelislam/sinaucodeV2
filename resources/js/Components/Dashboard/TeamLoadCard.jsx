const teams = [
  { name: 'Design Squad', value: 72, tone: 'bg-brand-500' },
  { name: 'Growth Team', value: 54, tone: 'bg-accent-400' },
  { name: 'Ops Center', value: 91, tone: 'bg-emerald-400' },
  { name: 'DevOps Crew', value: 63, tone: 'bg-sky-400' },
];

export default function TeamLoadCard() {
  return (
    <article className="rounded-3xl border border-white/60 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Team Load</p>
          <p className="text-xl font-semibold">Capacity</p>
        </div>
        <button className="text-xs text-slate-400">View all</button>
      </div>
      <div className="mt-6 space-y-5">
        {teams.map((team) => (
          <div key={team.name}>
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold">{team.name}</p>
              <p className="text-slate-500">{team.value}%</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${team.tone}`} style={{ width: `${team.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
