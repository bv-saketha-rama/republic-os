import { useState } from 'react';
import { Tag } from '@/components/ui/Tag';
import { Hash } from '@/components/ui/Hash';
import { useIssues, usePRYears } from '@/hooks/useConvex';
import { YearMonthFilter } from '@/components/ui/YearMonthFilter';
import { C } from '@/lib/constants';

interface IssuesViewProps {
  stateId?: string | null;
  onIssueClick: (id: number) => void;
  onUserClick: (handle: string) => void;
}

export function IssuesView({ stateId, onIssueClick, onUserClick }: IssuesViewProps) {
  const [tab, setTab] = useState<'open' | 'closed'>('open');
  const [year, setYear] = useState<number | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const { data: years } = usePRYears(stateId);
  const { data: issues } = useIssues(stateId, undefined, undefined, year, month);
  const filtered = issues.filter((i) => i.status === tab);
  const counts = { open: issues.filter((i) => i.status === 'open').length, closed: issues.filter((i) => i.status === 'closed').length };

  return (
    <div>
      <div className="px-6 py-3.5 border-b border-gh-border bg-gh-surface flex items-center gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => setTab('open')}
            className="bg-transparent border-none cursor-pointer font-sans text-[13px]"
            style={{ color: tab === 'open' ? C.text : C.muted, fontWeight: tab === 'open' ? 600 : 500 }}
          >
            <span className="text-gh-green mr-1">●</span>
            {counts.open} Open
          </button>
          <button
            onClick={() => setTab('closed')}
            className="bg-transparent border-none cursor-pointer font-sans text-[13px]"
            style={{ color: tab === 'closed' ? C.text : C.muted, fontWeight: tab === 'closed' ? 600 : 500 }}
          >
            <span className="text-gh-muted mr-1">✓</span>
            {counts.closed} Closed
          </button>
        </div>
        <div className="flex-1" />
        <YearMonthFilter
          years={years}
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
        <div className="flex gap-1.5 font-mono text-[11px]">
          {['Labels', 'Ministry', 'Session', 'Assignee', 'Milestone', 'Sort'].map((f) => (
            <button
              key={f}
              className="px-2 py-[3px] bg-transparent border border-gh-border rounded-md text-gh-muted font-mono text-[11px] cursor-pointer"
            >
              {f} ▾
            </button>
          ))}
        </div>
      </div>

      <div>
        {filtered.map((i) => (
          <div
            key={i.id}
            onClick={() => onIssueClick(i.id)}
            className="px-6 py-3 border-b border-gh-border2 cursor-pointer flex items-start gap-3 hover:bg-gh-surface transition-colors"
          >
            <span className="mt-0.5" style={{ color: i.status === 'open' ? C.green : C.muted }}>
              ●
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {i.labels.map((l) => (
                  <Tag
                    key={l}
                    color={
                      l === 'infrastructure'
                        ? C.blue
                        : l === 'agriculture'
                          ? C.green
                          : l === 'health'
                            ? C.purple
                            : l === 'education'
                              ? C.yellow
                              : l === 'environment'
                                ? C.green
                                : l === 'urban'
                                  ? C.accent
                                  : l === 'water'
                                    ? C.blue
                                    : C.muted
                    }
                  >
                    {l}
                  </Tag>
                ))}
                <span className="font-sans text-sm font-medium text-gh-text">{i.title}</span>
                <Hash>#{i.id}</Hash>
              </div>
              <div className="font-mono text-[11px] text-gh-muted mt-1">
                Raised by{' '}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onUserClick(i.author);
                  }}
                  className="text-gh-accent cursor-pointer"
                >
                  @{i.author}
                </span>
                <span> · Session {i.session}</span>
                <span> · {i.sessionsOpen} sessions without resolution</span>
                {i.stale && <span className="text-gh-yellow"> · stale</span>}
                <span> · {i.comments} comments</span>
              </div>
              <div className="font-mono text-[10px] text-gh-muted mt-0.5">
                Last activity: {i.lastActivity}{' '}
                {i.stale && <span className="text-gh-yellow">· stale</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
