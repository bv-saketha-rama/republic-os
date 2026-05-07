import { useDiscussions } from '@/hooks/useConvex';
import { Avatar } from '@/components/ui/Avatar';
import { C } from '@/lib/constants';

interface DiscussionsViewProps { stateId?: string; }

const CAT_COLOR: Record<string, string> = {
  RFC: C.blue,
  'Town Hall': C.green,
  'Show & Tell': C.purple,
  Q: C.yellow,
  Announcement: C.accent,
};

export function DiscussionsView({ stateId }: DiscussionsViewProps) {
  const { data: items, isLoading } = useDiscussions(stateId);

  if (isLoading) return <div className="p-6 font-mono text-gh-muted text-sm">Loading discussions…</div>;

  return (
    <div>
      <div className="px-6 py-3.5 border-b border-gh-border bg-gh-surface flex items-center justify-between">
        <div className="font-mono text-[13px] text-gh-text">
          <span className="text-gh-accent">{items.length}</span> discussions
        </div>
        <div className="flex gap-1.5 font-mono text-[11px]">
          {Object.keys(CAT_COLOR).map((cat) => (
            <span key={cat} className="px-2 py-[3px] rounded-md border font-mono text-[11px]"
              style={{ borderColor: CAT_COLOR[cat] + '66', color: CAT_COLOR[cat] }}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      {items.length === 0 && (
        <div className="p-6 font-mono text-gh-muted text-sm">No discussions yet.</div>
      )}

      {items.map((d) => (
        <div key={d.id} className="px-6 py-4 border-b border-gh-border2 flex items-start gap-3 hover:bg-gh-surface transition-colors">
          <Avatar handle={d.author} size={28} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {d.pinned && <span className="font-mono text-[10px] text-gh-muted">📌</span>}
              <span
                className="font-mono text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: (CAT_COLOR[d.category] ?? C.muted) + '22', color: CAT_COLOR[d.category] ?? C.muted, border: `1px solid ${(CAT_COLOR[d.category] ?? C.muted)}44` }}
              >
                {d.category}
              </span>
              {d.answered && <span className="font-mono text-[10px] text-gh-green">✓ answered</span>}
              <span className="font-sans text-sm font-medium text-gh-text">{d.title}</span>
            </div>
            <div className="font-mono text-[11px] text-gh-muted">
              <span className="text-gh-accent">@{d.author}</span>
              <span> · {d.replies} replies · {d.views} views</span>
              <span> · last activity {d.lastActivity}</span>
            </div>
            {d.body && (
              <div className="font-sans text-xs text-gh-muted mt-1 line-clamp-2 leading-relaxed">
                {d.body.split('\n')[0]}
              </div>
            )}
          </div>
          {d.sourceUrl && (
            <a href={d.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-gh-accent shrink-0">
              ↗
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
