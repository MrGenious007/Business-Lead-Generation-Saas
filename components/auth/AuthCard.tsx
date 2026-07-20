import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerLinkText: string;
}

export function AuthCard({ title, subtitle, children, footerText, footerHref, footerLinkText }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">LeadPilot AI</p>
          <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
        </div>
        {children}
        <div className="mt-6 text-center text-sm text-slate-300">
          {footerText}{' '}
          <Link href={footerHref} className="font-medium text-cyan-300 transition hover:text-cyan-200">
            {footerLinkText}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export function SubmitButton({ label, loading }: { label: string; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? 'Working…' : label}
      {!loading && <ArrowRight size={16} />}
    </button>
  );
}
