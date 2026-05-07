import { Sparkline } from '@/components/ui/Sparkline';
import { C } from '@/lib/constants';
import type { State } from '@/types';

interface InsightsViewProps {
  state: State;
}

export function InsightsView({ state }: InsightsViewProps) {
  const cards = [
    { label: 'Bills enacted (12mo)', value: state.prs, delta: '+' + Math.round(state.prs * 0.12), positive: true },
    { label: 'Avg debate time / bill', value: '3h 14m', delta: '−22m', positive: false },
    { label: 'Issue resolution rate', value: Math.round(state.resolveRate * 100) + '%', delta: state.resolveRate > 0.7 ? '↑ healthy' : state.resolveRate > 0.5 ? '⚠ degraded' : '↓ critical', positive: state.resolveRate > 0.7 },
    { label: 'Open issues', value: state.open, delta: state.open > 200 ? 'high' : state.open > 100 ? 'medium' : 'low', positive: state.open < 100 },
    { label: 'Acts in force', value: state.acts, delta: 'enacted', positive: true },
    { label: 'Mandate expires', value: state.mandateExpires, delta: state.party, positive: true },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-3 mb-4">
        {cards.map((c, i) => (
          <div key={i} className="p-4 bg-gh-surface border border-gh-border rounded-md">
            <div className="font-sans text-[11px] text-gh-muted mb-1.5 uppercase tracking-wide">
              {c.label}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="font-mono text-[26px] font-semibold text-gh-text">{c.value}</div>
              <div className="font-mono text-[11px]" style={{ color: c.positive ? C.green : C.red }}>
                {c.delta}
              </div>
            </div>
            <div className="mt-2">
              <Sparkline
                data={Array.from({ length: 14 }, () => Math.random() * 30 + 10)}
                color={c.positive ? C.green : C.red}
                width={200}
                height={24}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gh-surface border border-gh-border rounded-md">
        <div className="font-sans text-[13px] text-gh-text mb-2.5 font-semibold">
          Commit activity by ministry · last 12 months
        </div>
        <div className="flex items-end gap-1 h-[100px]">
          {Array.from({ length: 52 }, (_, i) => {
            const h = 20 + Math.random() * 70;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm opacity-70"
                style={{
                  height: `${h}%`,
                  background: i % 4 === 0 ? C.accent : C.green,
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between font-mono text-[10px] text-gh-muted mt-1.5">
          <span>May 2025</span>
          <span>Aug 2025</span>
          <span>Nov 2025</span>
          <span>Feb 2026</span>
          <span>May 2026</span>
        </div>
      </div>
    </div>
  );
}
