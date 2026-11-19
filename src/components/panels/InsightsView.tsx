import { useMemo } from 'react';
import { usePRs } from '@/hooks/useConvex';
import { C } from '@/lib/constants';
import { mandateExpired } from '@/lib/format';
import type { State } from '@/types';

interface InsightsViewProps {
  state: State;
}

const MONTH_LABEL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function InsightsView({ state }: InsightsViewProps) {
  const isNational = state.id === 'IN';
  const { data: prs, isLoading } = usePRs(isNational ? null : state.id);

  // Bills per month for the trailing 12 months, from real year/month fields.
  const months = useMemo(() => {
    const now = new Date();
    const out = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1, count: 0 };
    });
    for (const p of prs) {
      const slot = out.find((m) => m.year === p.year && m.month === p.month);
      if (slot) slot.count++;
    }
    return out;
  }, [prs]);

  const merged = prs.filter((p) => p.status === 'merged').length;
  const inProgress = prs.filter((p) => p.status === 'open' || p.status === 'in-review').length;
  const expired = mandateExpired(state.mandateExpires);

  const cards = [
    { label: 'Bills tracked', value: isNational ? prs.length : state.prs, note: isNational ? 'all legislatures' : 'open pull requests', positive: true },
    { label: 'Enacted', value: merged, note: 'merged bills', positive: true },
    { label: 'In progress', value: inProgress, note: 'open or in review', positive: true },
    {
      label: 'Issue resolution rate',
      value: isNational ? '—' : Math.round(state.resolveRate * 100) + '%',
      note: isNational ? 'n/a' : state.resolveRate > 0.7 ? '↑ healthy' : state.resolveRate > 0.5 ? '⚠ degraded' : '↓ critical',
      positive: state.resolveRate > 0.7,
    },
    { label: 'Open issues', value: isNational ? '—' : state.open, note: isNational ? 'n/a' : state.open > 200 ? 'high' : state.open > 100 ? 'medium' : 'low', positive: state.open < 100 },
    { label: 'Acts in force', value: isNational ? '—' : state.acts, note: 'enacted', positive: true },
    {
      label: 'Mandate expires',
      value: state.mandateExpires || '—',
      note: expired ? 'term ended — data may be outdated' : state.party,
      positive: !expired,
    },
  ];

  const max = Math.max(...months.map((m) => m.count), 1);
  const total = months.reduce((n, m) => n + m.count, 0);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {cards.map((c) => (
          <div key={c.label} className="p-4 bg-gh-surface border border-gh-border rounded-md min-w-0">
            <div className="font-sans text-[11px] text-gh-muted mb-1.5 uppercase tracking-wide">{c.label}</div>
            <div className="font-mono text-[26px] font-semibold text-gh-text">{c.value}</div>
            <div className="font-mono text-[11px] mt-1" style={{ color: c.positive ? C.green : C.red }}>
              {c.note}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gh-surface border border-gh-border rounded-md">
        <div className="font-sans text-[13px] text-gh-text mb-2.5 font-semibold">
          Bills introduced per month · last 12 months
        </div>
        {isLoading ? (
          <div className="font-mono text-xs text-gh-muted py-8">Loading…</div>
        ) : total === 0 ? (
          <div className="font-mono text-xs text-gh-muted py-8">
            No dated bills in the last 12 months.
          </div>
        ) : (
          <>
            <div className="flex items-end gap-1 h-[100px]">
              {months.map((m) => (
                <div
                  key={`${m.year}-${m.month}`}
                  className="flex-1 rounded-t-sm"
                  title={`${MONTH_LABEL[m.month - 1]} ${m.year}: ${m.count}`}
                  style={{ height: `${Math.max((m.count / max) * 100, m.count ? 4 : 1)}%`, background: m.count ? C.green : C.surface2 }}
                />
              ))}
            </div>
            <div className="flex gap-1 font-mono text-[10px] text-gh-muted mt-1.5">
              {months.map((m) => (
                <span key={`${m.year}-${m.month}`} className="flex-1 text-center">
                  {MONTH_LABEL[m.month - 1][0]}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
