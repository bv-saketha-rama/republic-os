import { useState } from 'react';
import { Hash } from '@/components/ui/Hash';
import { useChangelog, usePRYears } from '@/hooks/useConvex';
import { YearMonthFilter } from '@/components/ui/YearMonthFilter';
import { C } from '@/lib/constants';

interface ChangelogViewProps {
  stateId?: string;
  onUserClick: (handle: string) => void;
  onIssueClick: (id: number) => void;
  onPRClick: (id: string) => void;
}

export function ChangelogView({ stateId, onIssueClick, onPRClick }: ChangelogViewProps) {
  const [filter, setFilter] = useState('All');
  const [year, setYear] = useState<number | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const cats = ['All', 'Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'];
  const catColor: Record<string, string> = {
    Added: C.green,
    Changed: C.blue,
    Deprecated: C.yellow,
    Removed: C.red,
    Fixed: C.purple,
    Security: C.accent,
  };

  const { data: years } = usePRYears(stateId);
  const { data: changelog } = useChangelog(stateId, year, month);

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="font-sans text-sm text-gh-muted">Category:</div>
          <div className="flex gap-1.5 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="px-2.5 py-[3px] rounded-md font-mono text-[11px] cursor-pointer"
              style={{
                border: `1px solid ${filter === c ? catColor[c] || C.text : C.border}`,
                background: filter === c ? `${catColor[c] || C.text}22` : 'transparent',
                color: filter === c ? catColor[c] || C.text : C.muted,
              }}
            >
              {c}
            </button>
          ))}
          </div>
        </div>
        <YearMonthFilter years={years} year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />
      </div>

      {changelog.map((s, idx) => (
        <div key={idx} className="mb-8">
          <div className="font-mono text-lg font-semibold text-gh-text pb-2 border-b border-gh-border mb-4">
            <span className="text-gh-muted">## </span>
            {s.session}
            <span className="text-gh-muted font-normal text-sm"> · {s.range}</span>
          </div>
          {Object.entries(s.sections).map(([cat, items]) => {
            if (filter !== 'All' && filter !== cat) return null;
            return (
              <div key={cat} className="mb-4">
                <div
                  className="font-mono text-[13px] font-semibold mb-2"
                  style={{ color: catColor[cat] || C.text }}
                >
                  <span className="text-gh-muted">### </span>
                  {cat}
                </div>
                <ul className="list-none p-0 m-0">
                  {items?.map((it, i) => {
                    const ref = it.ref;
                    return (
                      <li
                        key={i}
                        className="font-sans text-[13px] text-gh-text py-1 pl-4 relative leading-relaxed"
                      >
                        <span className="absolute left-0 text-gh-muted font-mono">·</span>
                        {it.text}
                        {ref && (
                          <>
                            <span className="text-gh-muted"> — </span>
                            <Hash
                              onClick={() =>
                                it.kind === 'issue'
                                  ? onIssueClick(parseInt(ref))
                                  : onPRClick(
                                      ref.startsWith('PR-')
                                        ? ref
                                        : ref.replace(/[^\w-]/g, '')
                                    )
                              }
                            >
                              {it.refLabel ||
                                (it.kind === 'issue'
                                  ? `closes issue #${ref}`
                                  : `merged #${ref}`)}
                            </Hash>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
