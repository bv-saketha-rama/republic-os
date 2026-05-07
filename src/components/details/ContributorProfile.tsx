import { Avatar } from '@/components/ui/Avatar';
import { useContributor } from '@/hooks/useConvex';
import { getPartyColor } from '@/api/static';
import { C } from '@/lib/constants';

interface ContributorProfileProps {
  handle: string;
  onBack: () => void;
  onUserClick?: (handle: string) => void;
}

export function ContributorProfile({ handle, onBack }: ContributorProfileProps) {
  const { data: c, isLoading } = useContributor(handle);
  if (isLoading) return <div className="p-8 font-mono text-gh-muted text-sm">Loading profile…</div>;
  if (!c) return <div className="p-8 font-mono text-gh-muted text-sm">Profile not found for @{handle}</div>;

  const partyColor = getPartyColor(c.party);

  const grid = Array.from({ length: 53 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const seed = (w * 31 + d * 7 + handle.charCodeAt(0)) % 100;
      return seed > 80 ? 4 : seed > 65 ? 3 : seed > 50 ? 2 : seed > 35 ? 1 : 0;
    })
  );

  const cellColor = (v: number) =>
    v === 0 ? C.surface2 : v === 1 ? '#0e4429' : v === 2 ? '#006d32' : v === 3 ? '#26a641' : '#39d353';

  return (
    <div>
      <div className="px-6 py-5 border-b border-gh-border">
        <button
          onClick={onBack}
          className="bg-transparent border-none text-gh-muted font-mono text-[11px] cursor-pointer mb-3"
        >
          ← back
        </button>
        <div className="flex gap-4 items-center">
          <Avatar handle={c.handle} size={64} />
          <div>
            <div className="font-mono text-[22px] text-gh-text font-semibold">@{c.handle}</div>
            <div className="font-sans text-sm text-gh-muted mt-1">
              {c.role} · <span style={{ color: partyColor }}>{c.party}</span> · @{c.orgs[0]} owner ·{' '}
              {c.house}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="bg-gh-surface border border-gh-border rounded-md p-3.5 mb-4">
          <div className="font-mono text-[11px] text-gh-muted mb-1.5">README · Affidavit 2024.md</div>
          <div className="font-sans text-[13px] text-gh-text leading-relaxed">{c.affidavit}</div>
        </div>

        <div className="bg-gh-surface border border-gh-border rounded-md p-3.5 mb-4">
          <div className="font-sans text-[13px] text-gh-text mb-3">
            <strong>1,247 contributions</strong> in the last 5 years{' '}
            <span className="text-gh-muted font-normal">
              · grouped by parliamentary session activity
            </span>
          </div>
          <div className="flex gap-0.5">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((v, di) => (
                  <div
                    key={di}
                    className="rounded-sm"
                    style={{ width: 10, height: 10, background: cellColor(v) }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-end items-center gap-1.5 mt-2 font-mono text-[10px] text-gh-muted">
            Less{' '}
            {[0, 1, 2, 3, 4].map((v) => (
              <div key={v} className="rounded-sm" style={{ width: 10, height: 10, background: cellColor(v) }} />
            ))}{' '}
            More
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {[
            { label: 'PRs opened', value: c.stats.opened, color: C.text },
            { label: 'Merged', value: c.stats.merged, color: C.green },
            { label: 'Closed', value: c.stats.closed, color: C.red },
            { label: 'Merge rate', value: c.stats.mergeRate + '%', color: C.accent },
            { label: 'Issues raised', value: c.stats.issuesRaised, color: C.text },
            { label: 'Reviews given', value: c.stats.reviewsGiven, color: C.blue },
          ].map((s, i) => (
            <div key={i} className="p-3.5 bg-gh-surface border border-gh-border rounded-md">
              <div className="font-mono text-2xl font-semibold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="font-sans text-[11px] text-gh-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
