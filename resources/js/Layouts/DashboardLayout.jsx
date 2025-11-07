import { useEffect, useState } from 'react';
import DashboardSidebar from '../Components/Dashboard/DashboardSidebar';
import { usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

const DesktopSearch = () => (
  <div className="hidden w-full max-w-sm items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm md:flex">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-3 h-5 w-5 text-slate-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.2-5.2m0-6.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
    </svg>
    <input type="search" placeholder="Search projects, teams..." className="flex-1 bg-transparent outline-none" />
  </div>
);

export default function DashboardLayout({ children }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = usePage().props.auth.user;

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event) => {
      const matches = event.matches ?? mql.matches;
      setIsDesktop(matches);
      setIsSidebarOpen(matches);
    };

    handleChange(mql);
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleChange);
      return () => mql.removeEventListener('change', handleChange);
    }

    mql.addListener(handleChange);
    return () => mql.removeListener(handleChange);
  }, []);

  const sidebarVisible = isDesktop || isSidebarOpen;
  const showOverlay = !isDesktop && isSidebarOpen;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-200 lg:hidden ${
          showOverlay ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <DashboardSidebar isOpen={sidebarVisible} />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:pr-8 lg:pl-[18rem]">
          <div className="flex flex-shrink-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:text-brand-600 lg:hidden"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h12M4 17h16" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center gap-4">
            {/* <DesktopSearch /> */}
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-brand-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 12 21a8.967 8.967 0 0 1-8.312-5.228 23.848 23.848 0 0 0 5.455 1.31m11.714-11.46a11.953 11.953 0 0 1 1.263 4.772A11.953 11.953 0 0 1 6.343 4.848a11.953 11.953 0 0 1 12.626.774Z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-semibold text-white">3</span>
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-brand-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3A2.25 2.25 0 0 0 8.25 5.25V9m-3 2.25h13.5m-10.5 3V21m7.5-6.75V21" />
                  </svg>
                </button>
              </div>
              <Dropdown>
                <Dropdown.Trigger>
                  <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-500">Admin</p>
                    </div>
                  </div>
                </Dropdown.Trigger>

                <Dropdown.Content>
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Dropdown.Link href={route('profile.edit')}>
                      <div className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </div>
                    </Dropdown.Link>
                    <Dropdown.Link
                      href={route('logout')}
                      method="post"
                      as="button"
                    >
                      <div className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </div>
                    </Dropdown.Link>
                  </div>
                </Dropdown.Content>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-40 pb-12 sm:pt-36 md:pt-28 lg:pt-24 lg:ml-72">
        <div className="space-y-10 px-4 sm:px-6 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
