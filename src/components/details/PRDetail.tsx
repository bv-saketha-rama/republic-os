import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tag } from '@/components/ui/Tag';
import { usePRById } from '@/hooks/useConvex';
import { C } from '@/lib/constants';

interface PRDetailProps {
  prId: string;
  onBack: () => void;
  onUserClick: (handle: string) => void;
}

export function PRDetail({ prId, onBack, onUserClick }: PRDetailProps) {
  const [tab, setTab] = useState('conversation');
  const { data: pr, isLoading } = usePRById(prId);
  if (isLoading) return <div className="p-8 font-mono text-gh-muted text-sm">Loading bill…</div>;
  if (!pr) return null;

  // Derive pipeline stages from real PR data
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
    {
      key: 'draft', label: 'Draft', date: pr.introducedDate ?? '—',
      sub: `${pr.ministry ?? 'Ministry'} · drafted by @${pr.author}`,
      state: pr.introducedDate ? 'done' : 'pending',
    },
    {
      key: 'introduced', label: 'Introduced', date: pr.introducedDate ?? '—',
      sub: `First reading · ${pr.state ? `${pr.state.toUpperCase()} Assembly` : 'Lok Sabha'}`,
      state: pr.introducedDate ? 'done' : 'pending',
    },
    {
      key: 'committee', label: 'Committee Referral', date: hasCommittee ? 'referred' : '—',
      sub: pr.committeeReport ?? (hasCommittee ? `Referred to Standing Committee` : 'No committee referral'),
      state: hasCommittee ? (pr.status === 'changes-requested' ? 'changes' : 'done') : 'locked',
    },
    {
      key: 'vote-ls', label: `Vote: ${pr.state ? `${pr.state.toUpperCase()} Assembly` : 'Lok Sabha'}`,
      date: passedLS && pr.introducedDate ? 'voted' : '—',
      sub: pr.voteAyeLS
        ? `${isMerged || passedLS ? 'Passed' : 'Pending'} ${pr.voteAyeLS}–${pr.voteNoLS ?? '?'} · ${pr.voteAbstainLS ?? 0} abstained`
        : passedLS ? 'Passed by voice vote' : 'Vote pending',
      state: passedLS ? 'approved' : isLapsed ? 'locked' : 'pending',
    },
    {
      key: 'vote-rs', label: 'Vote: Rajya Sabha',
      date: passedRS ? 'voted' : '—',
      sub: pr.voteAyeRS
        ? `${passedRS ? 'Passed' : 'Pending'} ${pr.voteAyeRS}–${pr.voteNoRS ?? '?'}`
        : passedRS ? 'Passed' : pr.state ? 'N/A for state bill' : 'Vote pending',
      state: pr.state ? 'locked' : passedRS ? 'approved' : isLapsed ? 'locked' : 'pending',
    },
    {
      key: 'assent', label: isOrdinance ? 'Presidential Promulgation' : 'Presidential Assent',
      date: pr.assentDate ?? '—',
      sub: hasAssent ? `Assented on ${pr.assentDate ?? 'record'}` : 'Awaiting both chambers',
      state: hasAssent ? 'done' : 'locked',
    },
    {
      key: 'gazette', label: 'Gazette Notification',
      date: pr.gazette ?? '—',
      sub: pr.gazetteUrl ? `Published · ${pr.gazetteUrl}` : pr.gazette ? `Ref: ${pr.gazette}` : 'Pending gazette',
      state: hasGazette ? 'done' : 'locked',
    },
  ].filter((s) => !(pr.state && s.key === 'vote-rs'));

  const stateColor = (s: string) =>
    ({
      done: C.green,
      changes: C.red,
      approved: C.green,
      pending: C.yellow,
      locked: C.muted,
    } as Record<string, string>)[s] || C.muted;

  const tabs = [
    { id: 'conversation', label: 'Conversation', count: pr.conversations },
    { id: 'commits', label: 'Commits', count: 47 },
    { id: 'checks', label: 'Checks', count: 4 },
    { id: 'files', label: 'Files Changed', count: 12 },
  ];

  return (
    <div>
      <div className="px-6 pt-4 pb-3.5 border-b border-gh-border">
        <button
          onClick={onBack}
          className="bg-transparent border-none text-gh-muted font-mono text-[11px] cursor-pointer mb-2"
        >
          ← back to pull requests
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={pr.status} />
          <div className="font-sans text-[22px] font-semibold text-gh-text">
            {pr.title} <span className="text-gh-muted font-normal">#{pr.id}</span>
          </div>
        </div>
        <div className="font-mono text-[11px] text-gh-muted mt-2">
          <span className="text-gh-accent cursor-pointer" onClick={() => onUserClick(pr.author)}>
            @{pr.author}
          </span>{' '}
          wants to merge 47 commits into{' '}
          <span className="text-gh-text bg-gh-surface2 px-1.5 py-px rounded">main</span>
          {' '}from{' '}
          <span className="text-gh-text bg-gh-surface2 px-1.5 py-px rounded">
            finance/income-tax-amdt-2025
          </span>
        </div>
        <div className="flex gap-0 mt-4 font-mono text-xs">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-3.5 py-2 bg-transparent border-none font-mono text-xs cursor-pointer flex items-center gap-1.5"
              style={{
                borderBottom: tab === t.id ? `2px solid ${C.accent}` : '2px solid transparent',
                color: tab === t.id ? C.text : C.muted,
                fontWeight: tab === t.id ? 600 : 400,
              }}
            >
              {t.label}
              <span className="px-1.5 rounded-full bg-gh-surface2 text-gh-muted text-[10px]">
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_240px] gap-6 px-6 py-5">
        <div>
          {tab === 'conversation' && (
            <div>
              {stages.map((s, i) => (
                <div key={s.key} className="flex gap-3 mb-1 relative">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                      style={{ background: stateColor(s.state), color: '#0d1117' }}
                    >
                      {s.state === 'done' || s.state === 'approved'
                        ? '✓'
                        : s.state === 'changes'
                          ? '↩'
                          : s.state === 'pending'
                            ? '⟳'
                            : '○'}
                    </div>
                    {i < stages.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gh-border min-h-[28px]" />
                    )}
                  </div>
                  <div
                    className="flex-1 mb-4 p-2.5 rounded-md"
                    style={{
                      background: s.state === 'locked' ? 'transparent' : C.surface,
                      border: `1px solid ${
                        s.state === 'changes'
                          ? C.red + '66'
                          : s.state === 'approved'
                            ? C.green + '66'
                            : C.border
                      }`,
                      opacity: s.state === 'locked' ? 0.5 : 1,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-sans text-[13px] font-semibold text-gh-text">
                        {s.label}
                      </div>
                      <div className="font-mono text-[10px] text-gh-muted">{s.date}</div>
                    </div>
                    <div className="font-sans text-xs text-gh-muted mt-0.5">{s.sub}</div>
                    {(s.key === 'vote-ls' || s.key === 'vote-rs') && s.state === 'approved' && (() => {
                      const aye = s.key === 'vote-ls' ? (pr.voteAyeLS ?? 0) : (pr.voteAyeRS ?? 0);
                      const no = s.key === 'vote-ls' ? (pr.voteNoLS ?? 0) : (pr.voteNoRS ?? 0);
                      const abs = s.key === 'vote-ls' ? (pr.voteAbstainLS ?? 0) : (pr.voteAbstainRS ?? 0);
                      const total = aye + no + abs || 1;
                      const pct = Math.round((aye / total) * 100);
                      return (
                        <div className="mt-2.5 p-2.5 rounded-md" style={{ background: C.bg, border: `1px solid ${C.green}44` }}>
                          <div className="font-mono text-[11px] text-gh-green font-semibold mb-1.5">
                            ✓ Approved · {aye} / {total} votes ({pct}%)
                          </div>
                          <div className="flex gap-0.5 h-1.5 rounded-sm overflow-hidden">
                            <div style={{ flex: aye, background: C.green }} />
                            <div style={{ flex: no, background: C.red }} />
                            <div style={{ flex: abs, background: C.muted }} />
                          </div>
                          <div className="flex gap-3 mt-1.5 font-mono text-[10px] text-gh-muted">
                            <span><span style={{ color: C.green }}>●</span> Aye {aye}</span>
                            <span><span style={{ color: C.red }}>●</span> No {no}</span>
                            {abs > 0 && <span><span style={{ color: C.muted }}>●</span> Abstain {abs}</span>}
                          </div>
                        </div>
                      );
                    })()}
                    {s.key === 'committee' && s.state === 'changes' && (
                      <div className="mt-2.5 p-2.5 rounded-md" style={{ background: C.bg, border: `1px solid ${C.red}44` }}>
                        <div className="font-mono text-[11px] text-gh-red font-semibold mb-1.5">↩ Changes Requested</div>
                        <div className="font-sans text-xs text-gh-text">
                          {pr.committeeReport ?? 'Committee has requested amendments before floor vote.'}
                        </div>
                      </div>
                    )}
                    {s.key === 'debate' && (
                      <div className="mt-2.5">
                        <div className="font-sans text-xs text-gh-muted mb-1.5">Highlights:</div>
                        <div
                          className="border-l-2 border-gh-border pl-2.5 text-xs text-gh-text leading-relaxed font-sans"
                        >
                          <div className="mb-1.5">
                            <span
                              className="text-gh-accent cursor-pointer font-mono text-[11px]"
                              onClick={() => onUserClick('p-chidambaram')}
                            >
                              @p-chidambaram
                            </span>{' '}
                            raised concern over §17(2) implications for non-resident TDS.
                          </div>
                          <div>
                            <span
                              className="text-gh-accent cursor-pointer font-mono text-[11px]"
                              onClick={() => onUserClick('mahua-moitra')}
                            >
                              @mahua-moitra
                            </span>{' '}
                            moved amendment #14 — defeated 187–298.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'files' && (
            <div className="bg-gh-surface border border-gh-border rounded-md overflow-hidden">
              <div className="px-3.5 py-2 border-b border-gh-border font-mono text-xs text-gh-muted flex justify-between">
                <span>income-tax-act-1961.txt</span>
                <span className="text-gh-green">+47</span>
                <span className="text-gh-red">−12</span>
              </div>
              <pre className="m-0 px-3.5 py-3 font-mono text-xs text-gh-text leading-7">
                {`  §17. Salary, perquisite and profits in lieu of salary defined.
- (2) "perquisite" includes —
-     (i) the value of rent-free accommodation provided to the assessee
-         by his employer; provided that where such accommodation is
-         situate in a city having population exceeding twenty-five lakhs,
+ (2) "perquisite" includes —
+     (i) the value of accommodation provided, valued as per Rule 3(1),
+         indexed annually to the Consumer Price Index for Industrial
+         Workers, with effect from 1st April 2025;
+     (ia) the value of any digital asset granted as part of remuneration,
+         valued at fair market price on date of vesting;`}
              </pre>
              <div className="p-2.5 border-t border-gh-border bg-gh-bg font-sans text-xs text-gh-text">
                <div className="font-mono text-[11px] text-gh-muted mb-1">
                  💬 <span className="text-gh-accent">@committee-chair-finance</span> commented on
                  line 4
                </div>
                Concern: tying §17(2)(i) to CPI-IW may create implementation lag — recommend annual
                notification window of 30 days.
              </div>
            </div>
          )}

          {tab === 'checks' && (
            <div className="bg-gh-surface border border-gh-border rounded-md">
              {[
                { name: 'Constitutional validity check', state: 'passed', detail: 'Articles 246, 265, 270 verified' },
                { name: 'Financial memorandum review', state: 'passed', detail: '₹2,400 Cr est. revenue impact certified by CGA' },
                { name: 'Delegated legislation review', state: 'warning', detail: 'broad rulemaking power granted under §295A — flag' },
                { name: 'Rajya Sabha concurrence required', state: 'pending', detail: 'awaiting Mar-Apr session vote' },
              ].map((c, i) => {
                const ic =
                  c.state === 'passed'
                    ? '✓'
                    : c.state === 'warning'
                      ? '⚠'
                      : c.state === 'pending'
                        ? '○'
                        : '✗';
                const col =
                  c.state === 'passed'
                    ? C.green
                    : c.state === 'warning'
                      ? C.yellow
                      : c.state === 'pending'
                        ? C.muted
                        : C.red;
                return (
                  <div
                    key={i}
                    className="px-3.5 py-3 flex items-center gap-3"
                    style={{ borderBottom: i < 3 ? `1px solid ${C.border2}` : 'none' }}
                  >
                    <span className="font-mono text-base" style={{ color: col }}>
                      {ic}
                    </span>
                    <div className="flex-1">
                      <div className="font-sans text-[13px] text-gh-text font-medium">{c.name}</div>
                      <div className="font-mono text-[11px] text-gh-muted mt-0.5">{c.detail}</div>
                    </div>
                    <span
                      className="font-mono text-[11px] px-2 py-0.5 rounded"
                      style={{ color: col, border: `1px solid ${col}44` }}
                    >
                      {c.state}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'commits' && (
            <div className="bg-gh-surface border border-gh-border rounded-md">
              {[
                { hash: 'a8f3c91', msg: 'gazette: notify amendment in part II §1', author: 'press-info-bureau', date: '34d' },
                { hash: 'f2d44a1', msg: 'fix: typo in Schedule II row 14', author: 'cbdt', date: '36d' },
                { hash: '7e9b002', msg: 'incorporate committee amendments §17, §43B', author: 'nirmala-sitharaman', date: '42d' },
                { hash: '3a1c5ee', msg: 'introduce: tax on virtual digital assets', author: 'cbdt', date: '52d' },
              ].map((c, i) => (
                <div
                  key={i}
                  className="px-3.5 py-2.5 flex items-center gap-3"
                  style={{ borderBottom: i < 3 ? `1px solid ${C.border2}` : 'none' }}
                >
                  <Avatar handle={c.author} size={20} />
                  <div className="flex-1">
                    <div className="font-sans text-[13px] text-gh-text">{c.msg}</div>
                    <div className="font-mono text-[11px] text-gh-muted mt-0.5">
                      <span
                        className="text-gh-accent cursor-pointer"
                        onClick={() => onUserClick(c.author)}
                      >
                        @{c.author}
                      </span>{' '}
                      committed {c.date} ago
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-gh-muted px-2 py-0.5 bg-gh-bg border border-gh-border rounded">
                    {c.hash}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-4">
            <div className="font-mono text-[11px] text-gh-muted font-semibold mb-2">Reviewers</div>
            <div className="h-px bg-gh-border mb-2" />
            {[
              { name: pr.ministry ?? 'Ministry', state: 'done', sub: 'Drafted bill' },
              { name: pr.state ? `${pr.state.toUpperCase()} Assembly` : 'Lok Sabha', state: passedLS ? 'approved' : 'pending', sub: pr.voteAyeLS ? `Passed ${pr.voteAyeLS}–${pr.voteNoLS}` : 'vote pending' },
              ...(!pr.state ? [{ name: 'Rajya Sabha', state: passedRS ? 'approved' : 'pending', sub: pr.voteAyeRS ? `Passed ${pr.voteAyeRS}–${pr.voteNoRS}` : 'vote pending' }] : []),
              { name: 'President of India', state: hasAssent ? 'done' : 'locked', sub: pr.assentDate ? `Assented ${pr.assentDate}` : 'awaiting both chambers' },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 text-xs">
                <span className="font-mono mt-px" style={{ color: stateColor(r.state) }}>
                  {r.state === 'done' || r.state === 'approved' ? '✓' : r.state === 'pending' ? '⟳' : '○'}
                </span>
                <div className="flex-1">
                  <div className="font-sans text-gh-text">{r.name}</div>
                  <div className="font-mono text-[10px] text-gh-muted">{r.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="font-mono text-[11px] text-gh-muted font-semibold mb-2">Labels</div>
            <div className="h-px bg-gh-border mb-2" />
            <div className="flex flex-wrap gap-1">
              {pr.labels.map((l) => (
                <Tag key={l} color={C.yellow}>{l}</Tag>
              ))}
              {pr.ministry && <Tag color={C.muted}>{pr.ministry}</Tag>}
            </div>
          </div>

          {pr.summary && (
            <div className="mb-4">
              <div className="font-mono text-[11px] text-gh-muted font-semibold mb-2">Summary</div>
              <div className="h-px bg-gh-border mb-2" />
              <div className="font-sans text-xs text-gh-text leading-relaxed">{pr.summary}</div>
            </div>
          )}

          {(pr.gazetteUrl || pr.sourceUrl) && (
            <div className="mb-4">
              <div className="font-mono text-[11px] text-gh-muted font-semibold mb-2">External Links</div>
              <div className="h-px bg-gh-border mb-2" />
              {pr.gazetteUrl && <a href={pr.gazetteUrl} target="_blank" rel="noopener noreferrer" className="block font-mono text-[11px] text-gh-accent mb-1">↗ eGazette</a>}
              {pr.sourceUrl && <a href={pr.sourceUrl} target="_blank" rel="noopener noreferrer" className="block font-mono text-[11px] text-gh-accent">↗ Lok Sabha Portal</a>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
