'use client';

import { useMemo, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageHeader } from '@/components/layout/page-header';
import { WidgetCard } from '@/components/layout/widget-card';
import { getSearchHistory, saveBusiness, searchBusinesses } from '@/services/lead-discovery/google-places';
import type { BusinessRecord, SearchHistoryItem } from '@/types/lead-discovery';

export default function LeadsPage() {
  const [keyword, setKeyword] = useState('dentist');
  const [industry, setIndustry] = useState('Healthcare');
  const [city, setCity] = useState('Chicago');
  const [state, setState] = useState('IL');
  const [country, setCountry] = useState('US');
  const [radius, setRadius] = useState(10);
  const [results, setResults] = useState<BusinessRecord[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);

    const { data, error } = await searchBusinesses({ keyword, industry, radius, city, state, country, page: 1, pageSize: 10 });

    if (!error) {
      if (data[0]) {
        const saved = await saveBusiness(data[0]);
        if (saved.error) {
          setLoading(false);
          return;
        }
      }

      setResults(data);
    }

    const { data: historyData } = await getSearchHistory();
    setHistory(historyData ?? []);
    setLoading(false);
  };

  const historySummary = useMemo(() => history.slice(0, 5), [history]);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <PageHeader title="Lead discovery" description="Search local businesses by keyword, industry, and geography." />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <WidgetCard title="Business search" subtitle="Find businesses that match your target audience">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-300">
                Keyword
                <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
              </label>
              <label className="text-sm text-slate-300">
                Industry
                <input value={industry} onChange={(event) => setIndustry(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
              </label>
              <label className="text-sm text-slate-300">
                City
                <input value={city} onChange={(event) => setCity(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
              </label>
              <label className="text-sm text-slate-300">
                State
                <input value={state} onChange={(event) => setState(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
              </label>
              <label className="text-sm text-slate-300">
                Country
                <input value={country} onChange={(event) => setCountry(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
              </label>
              <label className="text-sm text-slate-300">
                Radius (mi)
                <input type="number" value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
              </label>
            </div>
            <button onClick={search} disabled={loading} className="mt-5 rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70">
              {loading ? 'Searching…' : 'Search businesses'}
            </button>
          </WidgetCard>

          <WidgetCard title="Search history" subtitle="Recent queries and filters">
            <div className="space-y-2">
              {historySummary.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-slate-300">
                  <p className="font-medium text-white">{entry.keyword || 'Untitled search'}</p>
                  <p className="mt-1 text-xs text-slate-400">{entry.city || 'Unknown city'} · {entry.state || 'Unknown state'} · {entry.country || 'Unknown country'}</p>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>

        <div className="mt-6">
          <WidgetCard title="Discovered businesses" subtitle="Results stored in Supabase with deduplication and refresh support">
            <div className="space-y-3">
              {results.map((business, index) => (
                <div key={`${business.business_name}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{business.business_name}</p>
                      <p className="mt-1 text-sm text-slate-400">{business.category || 'Local business'}</p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <p>{business.address || 'Address pending'}</p>
                      <p>{business.rating ? `${business.rating} ★` : 'No rating yet'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>
    </DashboardShell>
  );
}
