import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
      <div className="max-w-md rounded-3xl border border-white/10 bg-white/10 p-10 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-300">The page you requested could not be found.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400">
          Return home
        </Link>
      </div>
    </div>
  );
}
