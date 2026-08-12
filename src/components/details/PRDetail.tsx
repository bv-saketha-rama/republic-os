import { useState } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tag } from '@/components/ui/Tag';
import { SourceCard } from '@/components/ui/SourceCard';
import { useArticlesByRelation, usePRById } from '@/hooks/useConvex';
import { C } from '@/lib/constants';

interface PRDetailProps {
  prId: string;
  onBack: () => void;
  onUserClick: (handle: string) => void;
}

export function PRDetail({ prId, onBack, onUserClick }: PRDetailProps) {
  const [tab, setTab] = useState<'timeline' | 'sources'>('timeline');
  const { data: pr, isLoading } = usePRById(prId);
  const { data: articles } = useArticlesByRelation(`pr:${prId}`);
  if (isLoading) return <div className="p-8 font-mono text-gh-muted text-sm">Loading bill…</div>;
  if (!pr) return null;

  const isMerged = pr.status === 'merged';
  const isLapsed = pr.status === 'lapsed' || pr.status === 'closed';
  const isOrdinance = pr.status === 'ordinance';
  const stageStr = (pr.stage ?? '').toLowerCase();
  const passedLS = isMerged || stageStr.includes('rajya') || stageStr.includes('assent') || stageStr.includes('gazette') || !!pr.voteAyeLS;
  const passedRS = isMerged || stageStr.includes('assent') || stageStr.includes('gazette') || !!pr.voteAyeRS;
  const hasCommittee = stageStr.includes('committee') || stageStr.includes('jpc') || !!pr.committeeReport;
  const hasAssent = isMerged || stageStr.includes('assent') || stageStr.includes('gazette') || !!pr.assentDate;
  const hasGazette = isMerged || stageStr.includes('gazette') || !!pr.gazette || !!pr.gazetteUrl;
  const stages = [
    { key: 'draft', label: 'Draft', date: pr.introducedDate ?? '—', sub: `${pr.ministry ?? 'Ministry'} · drafted by @${pr.author}`, state: pr.introducedDate ? 'done' : 'pending' },
    { key: 'introduced', label: 'Introduced', date: pr.introducedDate ?? '—', sub: `First reading · ${pr.state ? `${pr.state.toUpperCase()} Assembly` : 'Lok Sabha'}`, state: pr.introducedDate ? 'done' : 'pending' },
    { key: 'committee', label: 'Committee referral', date: hasCommittee ? 'referred' : '—', sub: pr.committeeReport ?? (hasCommittee ? 'Referred to standing committee' : 'No committee referral'), state: hasCommittee ? (pr.status === 'changes-requested' ? 'changes' : 'done') : 'locked' },
    { key: 'vote-ls', label: `Vote: ${pr.state ? `${pr.state.toUpperCase()} Assembly` : 'Lok Sabha'}`, date: passedLS && pr.introducedDate ? 'voted' : '—', sub: pr.voteAyeLS ? `${isMerged || passedLS ? 'Passed' : 'Pending'} ${pr.voteAyeLS}–${pr.voteNoLS ?? '?'} · ${pr.voteAbstainLS ?? 0} abstained` : passedLS ? 'Passed by voice vote' : 'Vote pending', state: passedLS ? 'approved' : isLapsed ? 'locked' : 'pending' },
    { key: 'vote-rs', label: 'Vote: Rajya Sabha', date: passedRS ? 'voted' : '—', sub: pr.voteAyeRS ? `${passedRS ? 'Passed' : 'Pending'} ${pr.voteAyeRS}–${pr.voteNoRS ?? '?'}` : passedRS ? 'Passed' : pr.state ? 'Not applicable for state bill' : 'Vote pending', state: pr.state ? 'locked' : passedRS ? 'approved' : isLapsed ? 'locked' : 'pending' },
    { key: 'assent', label: isOrdinance ? 'Presidential promulgation' : 'Presidential assent', date: pr.assentDate ?? '—', sub: hasAssent ? `Assented on ${pr.assentDate ?? 'record'}` : 'Awaiting both chambers', state: hasAssent ? 'done' : 'locked' },
    { key: 'gazette', label: 'Gazette notification', date: pr.gazette ?? '—', sub: pr.gazetteUrl ? 'Published source available' : pr.gazette ? `Reference: ${pr.gazette}` : 'Pending gazette', state: hasGazette ? 'done' : 'locked' },
  ].filter((stage) => !(pr.state && stage.key === 'vote-rs'));
  const stateColor = (state: string) => ({ done: C.green, changes: C.red, approved: C.green, pending: C.yellow, locked: C.muted } as Record<string, string>)[state] || C.muted;
  const directSources = [
    pr.gazetteUrl ? { url: pr.gazetteUrl, outlet: 'eGazette', label: 'Open gazette ↗' } : null,
    pr.sourceUrl ? { url: pr.sourceUrl, outlet: 'Primary legislative record', label: 'Open source ↗' } : null,
  ].filter(Boolean) as Array<{ url: string; outlet: string; label: string }>;

  return (
    <div>
      <div className="px-6 pt-4 pb-3.5 border-b border-gh-border">
        <button type="button" onClick={onBack} className="bg-transparent border-none text-gh-muted font-mono text-[11px] cursor-pointer mb-2">← back to pull requests</button>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={pr.status} />
          <div className="font-sans text-[22px] font-semibold text-gh-text">{pr.title} <span className="text-gh-muted font-normal">#{pr.id}</span></div>
        </div>
        <div className="font-mono text-[11px] text-gh-muted mt-2">
          <span className="text-gh-accent cursor-pointer" onClick={() => onUserClick(pr.author)}>@{pr.author}</span>{' '}opened this bill · {pr.stage}
          {pr.conversations >= 0 && <span> · {pr.conversations} conversations</span>}
        </div>
        <div className="flex gap-0 mt-4 font-mono text-xs">
          {[
            { id: 'timeline' as const, label: 'Timeline' },
            { id: 'sources' as const, label: 'Sources', count: articles.length + directSources.length },
          ].map((item) => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className="px-3.5 py-2 bg-transparent border-none font-mono text-xs cursor-pointer flex items-center gap-1.5" style={{ borderBottom: tab === item.id ? `2px solid ${C.accent}` : '2px solid transparent', color: tab === item.id ? C.text : C.muted, fontWeight: tab === item.id ? 600 : 400 }}>
              {item.label}
              {item.count != null && <span className="px-1.5 rounded-full bg-gh-surface2 text-gh-muted text-[10px]">{item.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_240px] gap-6 px-6 py-5">
        <div>
          {tab === 'timeline' && (
            <div>
              {pr.summary && <div className="mb-5 font-sans text-sm leading-relaxed text-gh-text">{pr.summary}</div>}
              {stages.map((stage, index) => (
                <div key={stage.key} className="flex gap-3 mb-1 relative">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono" style={{ background: stateColor(stage.state), color: '#0d1117' }}>
                      {stage.state === 'done' || stage.state === 'approved' ? '✓' : stage.state === 'changes' ? '↩' : stage.state === 'pending' ? '⟳' : '○'}
                    </div>
                    {index < stages.length - 1 && <div className="w-0.5 flex-1 bg-gh-border min-h-[28px]" />}
                  </div>
                  <div className="flex-1 mb-4 p-2.5 rounded-md" style={{ background: stage.state === 'locked' ? 'transparent' : C.surface, border: `1px solid ${stage.state === 'changes' ? `${C.red}66` : stage.state === 'approved' ? `${C.green}66` : C.border}`, opacity: stage.state === 'locked' ? 0.5 : 1 }}>
                    <div className="flex justify-between items-center gap-2"><div className="font-sans text-[13px] font-semibold text-gh-text">{stage.label}</div><div className="font-mono text-[10px] text-gh-muted">{stage.date}</div></div>
                    <div className="font-sans text-xs text-gh-muted mt-0.5">{stage.sub}</div>
                    {(stage.key === 'vote-ls' || stage.key === 'vote-rs') && stage.state === 'approved' && (() => {
                      const aye = stage.key === 'vote-ls' ? (pr.voteAyeLS ?? 0) : (pr.voteAyeRS ?? 0);
                      const no = stage.key === 'vote-ls' ? (pr.voteNoLS ?? 0) : (pr.voteNoRS ?? 0);
                      const abstain = stage.key === 'vote-ls' ? (pr.voteAbstainLS ?? 0) : (pr.voteAbstainRS ?? 0);
                      const total = aye + no + abstain || 1;
                      return <div className="mt-2.5 p-2.5 rounded-md" style={{ background: C.bg, border: `1px solid ${C.green}44` }}><div className="font-mono text-[11px] text-gh-green font-semibold">✓ Approved · {aye} / {total} votes ({Math.round((aye / total) * 100)}%)</div></div>;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'sources' && (
            <div className="grid gap-3">
              {articles.map((article) => <SourceCard key={article.id} article={article} url={article.url} outlet={article.outlet} />)}
              {directSources.map((source) => <SourceCard key={source.url} url={source.url} outlet={source.outlet} label={source.label} />)}
              {articles.length === 0 && directSources.length === 0 && <div className="rounded-md border border-gh-border bg-gh-surface px-4 py-6 text-center font-mono text-xs text-gh-muted">No source records are attached to this bill.</div>}
            </div>
          )}
        </div>

        <aside>
          {pr.labels.length > 0 && <div className="mb-4"><div className="font-mono text-[11px] text-gh-muted font-semibold mb-2">Labels</div><div className="h-px bg-gh-border mb-2" /><div className="flex flex-wrap gap-1">{pr.labels.map((label) => <Tag key={label} color={C.yellow}>{label}</Tag>)}</div></div>}
          <div className="mb-4"><div className="font-mono text-[11px] text-gh-muted font-semibold mb-2">Record</div><div className="h-px bg-gh-border mb-2" /><div className="font-mono text-xs text-gh-muted leading-relaxed">Status: <span className="text-gh-text">{pr.status}</span><br />Stage: <span className="text-gh-text">{pr.stage}</span>{pr.ministry && <><br />Ministry: <span className="text-gh-text">{pr.ministry}</span></>}</div></div>
        </aside>
      </div>
    </div>
  );
}
