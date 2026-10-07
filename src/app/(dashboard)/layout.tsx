import Link from 'next/link';
import { MOCK_ORG, MOCK_USER } from '@/data/mock';

const NAV = [
  { href: '/today', label: 'Today', icon: '⚡' },
  { href: '/opportunities', label: 'Opportunities', icon: '🎯' },
  { href: '/leads', label: 'Leads', icon: '📥' },
  { href: '/quotes', label: 'Quotes', icon: '📄' },
  { href: '/customers', label: 'Customers', icon: '👥' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="h-14 flex items-center gap-2 px-4 border-b border-slate-200">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white text-xs font-bold">
            CF
          </span>
          <span className="font-semibold text-slate-900 tracking-tight">CloseFlow</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <p className="text-xs font-medium text-slate-900 truncate">{MOCK_ORG.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{MOCK_USER.name} · Owner</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6">
          <div className="text-sm text-slate-500">
            Demo mode · Mock data
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
              Trial · 11 days left
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
