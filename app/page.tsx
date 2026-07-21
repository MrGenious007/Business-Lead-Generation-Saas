import Link from 'next/link';
import { ArrowRight, Bot, ChartNoAxesCombined, Sparkles, Target } from 'lucide-react';

const featureCards = [
  {
    title: 'Lead discovery',
    description: 'Build prospect lists from local intent signals, firmographic filters, and enrichment workflows.',
    icon: Target,
  },
  {
    title: 'CRM command center',
    description: 'Track accounts, contacts, deals, and tasks in one revenue workspace your team can actually use.',
    icon: ChartNoAxesCombined,
  },
  {
    title: 'AI execution layer',
    description: 'Turn research into outreach, summaries, and follow-up recommendations without manual busywork.',
    icon: Bot,
  },
];

const stats = [
  { value: '3x', label: 'faster pipeline setup' },
  { value: '24/7', label: 'automated lead monitoring' },
  { value: '1 hub', label: 'for CRM, outreach, and analytics' },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_40%),radial-gradient(circle_at_75%_12%,_rgba(250,204,21,0.12),_transparent_20%)]" />

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles size={16} />
              Revenue intelligence for modern growth teams
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Grow smarter with an AI-powered operating system for pipeline creation.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Discover leads, automate outreach, coordinate CRM activity, and surface the next best action from a single elegant workspace.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_80px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300"
              >
                Create workspace
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10"
              >
                Preview dashboard
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-12 hidden h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl lg:block" />
            <div className="absolute -right-4 bottom-8 hidden h-32 w-32 rounded-full bg-amber-300/10 blur-3xl lg:block" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.75)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-medium text-slate-300">Pipeline overview</p>
                  <p className="mt-1 text-2xl font-semibold text-white">Q3 Growth Engine</p>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  Live
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {featureCards.map(({ title, description, icon: Icon }) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:last:col-span-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                      <Icon size={20} />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-400/10 to-transparent p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">Next best action</p>
                    <p className="mt-1 text-sm text-slate-300">Focus on high-intent HVAC prospects in Dallas and trigger a 3-step outreach sequence.</p>
                  </div>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                    AI recommendation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}