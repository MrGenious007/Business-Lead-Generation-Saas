import Link from 'next/link';
import { requireAuthenticatedUser } from '@/lib/auth/server';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuthenticatedUser('/dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="font-semibold">LeadPilot AI Dashboard</div>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/dashboard" className="transition hover:text-cyan-300">Home</Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-cyan-400 hover:text-cyan-300">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
