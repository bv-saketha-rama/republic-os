import { Avatar } from '@/components/ui/Avatar';
import { useContributor } from '@/hooks/useConvex';
import { C, getPartyColor } from '@/lib/constants';

interface ContributorProfileProps {
  handle: string;
  onBack: () => void;
}

export function ContributorProfile({ handle, onBack }: ContributorProfileProps) {
  const { data: c, isLoading } = useContributor(handle);
  if (isLoading) return <div className="p-8 font-mono text-gh-muted text-sm">Loading profile…</div>;
  if (!c) return <div className="p-8 font-mono text-gh-muted text-sm">Profile not found for @{handle}</div>;

  const partyColor = getPartyColor(c.party);

  const hasStats = c.stats.opened + c.stats.merged + c.stats.closed + c.stats.issuesRaised + c.stats.reviewsGiven > 0;
  const fmt = (n: number, suffix = '') => (hasStats ? n + suffix : '—');
  const org = c.orgs[0];

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
              {c.role} · <span style={{ color: partyColor }}>{c.party}</span>
              {org ? <> · @{org} owner</> : null} · {c.house}
              {c.constituency ? <> · {c.constituency}</> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="bg-gh-surface border border-gh-border rounded-md p-3.5 mb-4">
          <div className="font-mono text-[11px] text-gh-muted mb-1.5">README · Affidavit</div>
          <div className="font-sans text-[13px] text-gh-text leading-relaxed">{c.affidavit}</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'PRs opened', value: fmt(c.stats.opened), color: C.text },
            { label: 'Merged', value: fmt(c.stats.merged), color: C.green },
            { label: 'Closed', value: fmt(c.stats.closed), color: C.red },
            { label: 'Merge rate', value: fmt(c.stats.mergeRate, '%'), color: C.accent },
            { label: 'Issues raised', value: fmt(c.stats.issuesRaised), color: C.text },
            { label: 'Reviews given', value: fmt(c.stats.reviewsGiven), color: C.blue },
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
