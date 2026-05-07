import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import { useIssueById } from '@/hooks/useConvex';
import { C } from '@/lib/constants';

interface IssueDetailProps {
  issueId: number;
  onBack: () => void;
  onUserClick: (handle: string) => void;
}

export function IssueDetail({ issueId, onBack, onUserClick }: IssueDetailProps) {
  const { data: issue, isLoading } = useIssueById(issueId);
  if (isLoading) return <div className="p-8 font-mono text-gh-muted text-sm">Loading issue…</div>;
  if (!issue) return null;

  return (
    <div>
      <div className="px-6 pt-4 pb-3.5 border-b border-gh-border">
        <button
          onClick={onBack}
          className="bg-transparent border-none text-gh-muted font-mono text-[11px] cursor-pointer mb-2"
        >
          ← back to issues
        </button>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-full bg-gh-green text-white font-mono text-[11px] font-semibold">
            ● Open
          </span>
          <div className="font-sans text-[22px] font-semibold text-gh-text">
            {issue.title} <span className="text-gh-muted font-normal">#{issue.id}</span>
          </div>
        </div>
        <div className="font-mono text-[11px] text-gh-muted mt-2">
          <span className="text-gh-accent cursor-pointer" onClick={() => onUserClick(issue.author)}>
            @{issue.author}
          </span>{' '}
          opened this issue {issue.lastActivity} · Session {issue.session} · {issue.comments}{' '}
          comments
          {issue.stale && (
            <span className="text-gh-yellow"> · 🤖 stale-bot: no activity in {issue.lastActivity}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_240px] gap-6 px-6 py-5">
        <div>
          <div className="bg-gh-surface border border-gh-border rounded-md mb-4">
            <div className="px-3.5 py-2 border-b border-gh-border bg-gh-surface2 font-mono text-[11px] text-gh-muted flex justify-between">
              <span>
                <span
                  className="text-gh-accent cursor-pointer"
                  onClick={() => onUserClick(issue.author)}
                >
                  @{issue.author}
                </span>{' '}
                · author · opened {issue.lastActivity}
              </span>
              <span>···</span>
            </div>
            <div className="px-3.5 py-3.5 font-sans text-sm text-gh-text leading-relaxed">
              {issue.description
                ? <p className="m-0">{issue.description}</p>
                : <p className="m-0 text-gh-muted italic">No description provided.</p>
              }
              {issue.source && (
                <p className="m-0 mt-2.5 font-mono text-[11px] text-gh-muted">
                  Source: <span className="text-gh-accent">{issue.source}</span>
                  {issue.ministryRef && ` · ${issue.ministryRef}`}
                </p>
              )}
            </div>
          </div>

          <div
            className="rounded-md mb-4"
            style={{ background: '#1c2734', border: `1px solid ${C.blue}66` }}
          >
            <div className="px-3.5 py-2 border-b border-gh-border font-mono text-[11px] text-gh-blue flex items-center gap-1.5">
              <span>📌</span>
              <span>Pinned · Government Response</span>
              <span className="text-gh-muted ml-auto">2 sessions ago</span>
            </div>
            <div className="px-3.5 py-3.5 font-sans text-[13px] text-gh-text leading-relaxed">
              <div className="font-mono text-[11px] text-gh-muted mb-2">
                <span
                  className="text-gh-accent cursor-pointer"
                  onClick={() => onUserClick('pwd-maharashtra')}
                >
                  @pwd-maharashtra
                </span>{' '}
                · official
              </div>
              ₹3,400 Cr allocated under Marathwada Roads Package III in FY24-25 budget. Tendering
              for 2,107 km completed; physical progress 31% as of Mar 2025. Detailed status table
              tabled in House on 14 Mar 2025.
            </div>
          </div>

          {[
            {
              author: 'devendra-fadnavis',
              when: '23 days ago',
              text: 'Will personally review district-wise progress with PWD secretary. Schedule a site visit to Beed–Latur stretch this Friday.',
            },
            {
              author: 'jayant-patil',
              when: '12 days ago',
              text: 'Site visit cancelled twice. Same pattern as 2021–22. Suggest the issue be tagged @india/cag for performance audit.',
            },
            {
              author: 'press-trust-of-india',
              when: '4 days ago',
              text: 'Filed RTI #MH-2025-PWD-7821 — response received. Will share data shortly.',
            },
          ].map((c, i) => (
            <div key={i} className="bg-gh-surface border border-gh-border rounded-md mb-3">
              <div className="px-3.5 py-2 border-b border-gh-border2 bg-gh-surface2 font-mono text-[11px] text-gh-muted flex justify-between">
                <span>
                  <span
                    className="text-gh-accent cursor-pointer"
                    onClick={() => onUserClick(c.author)}
                  >
                    @{c.author}
                  </span>{' '}
                  · {c.when}
                </span>
                <span>···</span>
              </div>
              <div className="px-3.5 py-3 font-sans text-[13px] text-gh-text leading-relaxed">
                {c.text}
              </div>
            </div>
          ))}
        </div>

        <div>
          {[
            {
              title: 'Labels',
              body: (
                <div className="flex flex-wrap gap-1">
                  {issue.labels.map((l) => (
                    <Tag key={l} color={C.blue}>
                      {l}
                    </Tag>
                  ))}
                  <Tag color={C.yellow}>stale</Tag>
                </div>
              ),
            },
            {
              title: 'Assignee',
              body: (
                <div className="font-mono text-xs">
                  <span
                    className="text-gh-accent cursor-pointer"
                    onClick={() => onUserClick('pwd-maharashtra')}
                  >
                    @pwd-maharashtra
                  </span>
                </div>
              ),
            },
            {
              title: 'Milestone',
              body: (
                <div className="font-sans text-xs text-gh-text">
                  Marathwada Package III · FY24–25
                </div>
              ),
            },
            {
              title: 'Linked PRs',
              body: (
                <div className="font-mono text-xs">
                  <span className="text-gh-accent cursor-pointer">#PR-MH-1142</span> Motor Vehicles
                  Amdt
                </div>
              ),
            },
            {
              title: 'Participants',
              body: (
                <div className="flex flex-wrap gap-1">
                  {[
                    'supriya-sule',
                    'devendra-fadnavis',
                    'jayant-patil',
                    'pwd-maharashtra',
                    'press-trust-of-india',
                  ].map((h) => (
                    <Avatar key={h} handle={h} size={22} />
                  ))}
                </div>
              ),
            },
          ].map((s, i) => (
            <div key={i} className="mb-4">
              <div className="font-mono text-[11px] text-gh-muted font-semibold mb-2">{s.title}</div>
              <div className="h-px bg-gh-border mb-2" />
              {s.body}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
