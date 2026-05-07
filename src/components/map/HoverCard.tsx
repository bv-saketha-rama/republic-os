import { C } from '@/lib/constants';
import { Sparkline } from '@/components/ui/Sparkline';
import type { State } from '@/types';

interface HoverCardProps {
  hovered: { id: string; x: number; y: number } | null;
  data: State[];
}

export function HoverCard({ hovered, data }: HoverCardProps) {
  if (!hovered) return null;
  const s = data.find((d) => d.id === hovered.id);
  if (!s) return null;

  const sparkData = Array.from({ length: 12 }, (_, i) =>
    Math.floor(Math.abs(Math.sin(i * 0.7 + s.id.charCodeAt(0)) * 25 + 8))
  );
  const cardW = 300;
  const left = Math.min(hovered.x + 16, window.innerWidth - cardW - 12);

  const healthColor =
    s.health === 'healthy' ? C.green : s.health === 'amber' ? C.yellow : C.red;

  return (
    <div
      className="fixed bg-gh-surface border border-gh-border rounded-lg p-3 pointer-events-none z-[100] shadow-xl"
      style={{ left, top: hovered.y + 12, minWidth: cardW }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-sans text-sm font-semibold text-gh-text">{s.name}</div>
        <div className="flex items-center gap-1 font-mono text-[11px]" style={{ color: healthColor }}>
          <span
            className="inline-block rounded-full"
            style={{ width: 7, height: 7, background: healthColor }}
          />
          {s.health}
        </div>
      </div>
      <div className="h-px bg-gh-border my-2" />
      <div className="font-mono text-[11px] text-gh-muted mb-2">
        maintained by <span className="text-gh-accent">@{s.maintainer}</span>
      </div>
      <div className="h-px bg-gh-border my-2" />
      <div className="grid grid-cols-[14px_1fr] gap-x-2 gap-y-1 font-mono text-[11px] text-gh-text">
        <span style={{ color: C.yellow }}>⚠</span>
        <span>{s.open} open issues</span>
        <span style={{ color: C.blue }}>⟳</span>
        <span>{s.prs} open pull requests</span>
        <span style={{ color: C.green }}>✓</span>
        <span>{s.acts} acts in force</span>
      </div>
      <div className="mt-2 pt-2 border-t border-gh-border font-mono text-[10px] text-gh-muted">
        Last merged: {s.lastMerged} — <span className="text-gh-text">{s.lastTitle}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="font-mono text-[10px] text-gh-muted">activity 12mo</span>
        <Sparkline data={sparkData} color={healthColor} />
      </div>
    </div>
  );
}
