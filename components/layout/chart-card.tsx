const bars = [
  { id: 'bar-1', label: 'Mon', value: 62 },
  { id: 'bar-2', label: 'Tue', value: 78 },
  { id: 'bar-3', label: 'Wed', value: 55 },
  { id: 'bar-4', label: 'Thu', value: 91 },
  { id: 'bar-5', label: 'Fri', value: 74 },
  { id: 'bar-6', label: 'Sat', value: 48 },
  { id: 'bar-7', label: 'Sun', value: 66 },
];

export function ChartCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div className="flex h-56 items-end gap-3">
        {bars.map((bar) => (
          <div key={bar.id} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-44 w-full items-end">
              <div
                className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-500 to-blue-400"
                style={{ height: `${bar.value}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
