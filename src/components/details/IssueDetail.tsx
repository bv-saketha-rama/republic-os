import { Tag } from '@/components/ui/Tag';
import { SourceCard } from '@/components/ui/SourceCard';
import { useArticlesByRelation, useIssueById } from '@/hooks/useConvex';
import { C } from '@/lib/constants';

interface IssueDetailProps {
  issueId: number;
  onBack: () => void;
  onUserClick: (handle: string) => void;
}

export function IssueDetail({ issueId, onBack, onUserClick }: IssueDetailProps) {
  const { data: issue, isLoading } = useIssueById(issueId);
  const { data: articles } = useArticlesByRelation(`issue:${issueId}`);
  if (isLoading) return <div className="p-8 font-mono text-gh-muted text-sm">Loading issue…</div>;
  if (!issue) return null;

  const statusColor = issue.status === 'open' ? C.green : C.muted;
  return (
    <div>
      <div className="px-6 pt-4 pb-3.5 border-b border-gh-border">
        <button type="button" onClick={onBack} className="bg-transparent border-none text-gh-muted font-mono text-[11px] cursor-pointer mb-2">← back to issues</button>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-full font-mono text-[11px] font-semibold" style={{ color: statusColor, border: `1px solid ${statusColor}66` }}>● {issue.status}</span>
          <div className="font-sans text-[22px] font-semibold text-gh-text">{issue.title} <span className="text-gh-muted font-normal">#{issue.id}</span></div>
        </div>
        <div className="font-mono text-[11px] text-gh-muted mt-2">
          <span className="text-gh-accent cursor-pointer" onClick={() => onUserClick(issue.author)}>@{issue.author}</span>{' '}opened this issue · {issue.lastActivity} · Session {issue.session} · {issue.comments} comments
          {issue.stale && <span className="text-gh-yellow"> · stale</span>}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_240px] gap-6 px-6 py-5">
        <div>
          <div className="bg-gh-surface border border-gh-border rounded-md mb-4">
            <div className="px-3.5 py-2 border-b border-gh-border bg-gh-surface2 font-mono text-[11px] text-gh-muted">
              <span className="text-gh-accent">@{issue.author}</span> · record description
            </div>
            <div className="px-3.5 py-3.5 font-sans text-sm text-gh-text leading-relaxed">
              {issue.description ? <p className="m-0">{issue.description}</p> : <p className="m-0 text-gh-muted italic">No description provided.</p>}
              {(issue.source || issue.ministryRef) && <p className="m-0 mt-2.5 font-mono text-[11px] text-gh-muted">{issue.source && <>Source: <span className="text-gh-accent">{issue.source}</span></>}{issue.source && issue.ministryRef && ' · '}{issue.ministryRef}</p>}
            </div>
          </div>

          <div className="rounded-md mb-4 px-3.5 py-3.5" style={{ border: `1px solid ${C.border}`, background: C.surface }}>
            <div className="font-mono text-[11px] text-gh-muted font-semibold mb-1.5">Discussion</div>
            <div className="font-sans text-xs text-gh-muted">Discussion content is unavailable in the stored record.</div>
          </div>

          {articles.length > 0 && (
            <div className="grid gap-3">
              <div className="font-mono text-[11px] text-gh-muted font-semibold">Related sources</div>
              {articles.map((article) => <SourceCard key={article.id} article={article} url={article.url} outlet={article.outlet} />)}
            </div>
          )}
          {issue.sourceUrl && <div className="mt-3"><SourceCard url={issue.sourceUrl} outlet="Issue source" /></div>}
        </div>

        <aside>
          {issue.labels.length > 0 && <div className="mb-4"><div className="font-mono text-[11px] text-gh-muted font-semibold mb-2">Labels</div><div className="h-px bg-gh-border mb-2" /><div className="flex flex-wrap gap-1">{issue.labels.map((label) => <Tag key={label} color={C.blue}>{label}</Tag>)}</div></div>}
          <div className="mb-4"><div className="font-mono text-[11px] text-gh-muted font-semibold mb-2">Record</div><div className="h-px bg-gh-border mb-2" /><div className="font-mono text-xs text-gh-muted leading-relaxed">Status: <span className="text-gh-text">{issue.status}</span><br />Last activity: <span className="text-gh-text">{issue.lastActivity}</span>{issue.ministryRef && <><br />Ministry: <span className="text-gh-text">{issue.ministryRef}</span></>}</div></div>
        </aside>
      </div>
    </div>
  );
}
