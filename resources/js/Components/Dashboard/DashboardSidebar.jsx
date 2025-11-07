import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import menuData from '../../data/dashboardMenu.json';

const iconMap = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125A1.125 1.125 0 0 0 5.625 21h12.75A1.125 1.125 0 0 0 19.5 19.875V9.75" />
    </svg>
  ),
  stack: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 14a4 4 0 10-8 0m8 0v1a3 3 0 003 3h1a3 3 0 003-3v-1a7 7 0 00-7-7m-8 7v1a3 3 0 01-3 3H5a3 3 0 01-3-3v-1a7 7 0 017-7m6-2a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  profile: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0116.5 0" />
    </svg>
  ),
  folder: (
    <svg xmlns="http://www.w3.org/2000 /svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0v6A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25v-6m-19.5 0h19.5" />
    </svg>
  ),
};

const ArrowIcon = ({ rotated }) => (
  <svg className={`h-4 w-4 transition ${rotated ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
  </svg>
);

const SidebarIndicator = ({ indicator, isOpen }) => {
  if (!indicator) return null;

  if (indicator.type === 'count') {
    return (
      <span className="flex items-center gap-2 text-xs text-slate-500">
        {indicator.text}
        <ArrowIcon rotated={isOpen} />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-600/30 px-2 py-0.5 text-xs text-brand-100">
      {indicator.text}
      <ArrowIcon rotated={isOpen} />
    </span>
  );
};

const CollapsibleMenuItem = ({ item, isActive, parentActive, isPathActive }) => {
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    setOpen(isActive);
  }, [isActive]);

  return (
    <div className={`rounded-xl ${open ? 'ring-1 ring-white/10' : ''}`}>
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
          parentActive ? 'bg-white/10 font-semibold text-white' : 'text-slate-200 hover:bg-white/5'
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex items-center gap-3">
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${parentActive ? 'bg-white/10' : 'bg-white/5'}`}>
            {iconMap[item.icon] || null}
          </span>
          {item.label}
        </span>
        <SidebarIndicator indicator={item.indicator} isOpen={open} />
      </button>
      {open && (
        <div className="space-y-1 px-3 pb-3">
          {item.items?.map((child) => (
            <a
              key={child.label}
              href={child.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                isPathActive(child.href) ? 'font-semibold text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {child.label}
              {child.badge ? (
                <span className="rounded-full bg-brand-600/30 px-2 py-0.5 text-[10px] text-brand-100">{child.badge.text}</span>
              ) : child.note ? (
                <span className="text-[10px] text-slate-500">{child.note}</span>
              ) : null}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const SimpleMenuItem = ({ item, isActive }) => (
  <a
    href={item.href}
    className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
      isActive ? 'bg-white/10 font-semibold text-white' : 'text-slate-300 hover:text-white'
    }`}
  >
    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? 'bg-white/10' : 'bg-white/5'}`}>
      {iconMap[item.icon] || null}
    </span>
    {item.label}
  </a>
);

const normalizePath = (path = '/') => {
  if (!path) return '/';
  const cleaned = path.split('?')[0] || '/';
  return cleaned === '/' ? '/' : cleaned.replace(/\/+$/, '') || '/';
};

const pathIsActive = (currentPath, targetPath) => {
  if (!targetPath) return false;
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedTarget = normalizePath(targetPath);

  if (normalizedCurrent === normalizedTarget) {
    return true;
  }

  return normalizedCurrent.startsWith(`${normalizedTarget}/`);
};

export default function DashboardSidebar({ isOpen }) {
  const { main = [], teams = [], cta = null } = menuData;
  const { url } = usePage();
  const currentPath = normalizePath(url);
  const isPathActive = (href) => pathIsActive(currentPath, href);

  return (
    <aside
      id="sidebar"
      className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-800 bg-slate-900 text-slate-100 shadow-soft transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className="flex h-full flex-col pt-6">
        <div className="px-6">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold">LD</div>
            <div>
              <p className="text-sm font-semibold">Ladmin Studio</p>
              <p className="text-xs text-slate-400">Bright workspace</p>
            </div>
          </div>
        </div>
        <div className="border-b border-slate-800 px-6 py-4" />
        <nav className="flex-1 overflow-y-auto px-3 py-6 text-sm">
          {main.length > 0 && (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Main</p>
              <ul className="mt-3 space-y-1">
                {main.map((item) => (
                  <li key={item.label}>
                    {item.type === 'collapsible' ? (
                      <CollapsibleMenuItem
                        item={item}
                        isActive={isPathActive(item.href) || item.items?.some((child) => isPathActive(child.href))}
                        parentActive={isPathActive(item.href)}
                        isPathActive={isPathActive}
                      />
                    ) : (
                      <SimpleMenuItem item={item} isActive={isPathActive(item.href)} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {teams.length > 0 && (
            <div className="mt-8">
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Teams</p>
              <ul className="mt-3 space-y-1">
                {teams.map((team) => (
                  <li key={team.label}>
                    <a href="#" className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-300 hover:bg-white/5">
                      <span className="flex items-center gap-3">
                        <span className={`h-2 w-2 rounded-full ${team.color}`} />
                        {team.label}
                      </span>
                      <span className="text-xs text-slate-500">{team.count}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cta && (
            <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
              <p className="text-sm font-semibold">{cta.title}</p>
              <p className="mt-2 text-xs text-slate-400">{cta.description}</p>
              <button className="mt-4 w-full rounded-xl bg-brand-500 py-2 text-sm font-semibold text-white shadow-soft">{cta.action}</button>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
