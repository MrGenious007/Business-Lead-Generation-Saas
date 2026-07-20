export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <div className="max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">LeadPilot AI</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">Grow smarter with an AI-powered growth platform.</h1>
        <p className="mt-6 text-lg text-slate-300">
          Discover leads, automate outreach, and manage growth from a single modern workspace.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="/signup" className="rounded-full bg-cyan-500 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-400">
            Create account
          </a>
          <a href="/login" className="rounded-full border border-white/20 px-6 py-3 font-medium text-white transition hover:border-cyan-400 hover:text-cyan-300">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}