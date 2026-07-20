import Link from 'next/link';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.24),_transparent_40%),_linear-gradient(135deg,_#020617,_#0f172a)] text-slate-50">
      <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="text-lg font-semibold">LeadPilot AI</p>
            <p className="text-sm text-slate-400">Revenue intelligence workspace</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <Link href="/dashboard" className="transition hover:text-cyan-300">Dashboard</Link>
            <Link href="/leads" className="transition hover:text-cyan-300">Leads</Link>
            <Link href="/crm" className="transition hover:text-cyan-300">CRM</Link>
            <Link href="/organizations" className="transition hover:text-cyan-300">Organizations</Link>
            <Link href="/api/auth/logout" className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-cyan-400 hover:text-cyan-300">Logout</Link>
          </nav>
        </div>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
