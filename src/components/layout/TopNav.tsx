import { useState, useRef, useEffect } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { useNationalStats, useSearch } from '@/hooks/useConvex';
import { C } from '@/lib/constants';

interface TopNavProps {
  onSearch?: (query: string) => void;
  onLogo?: () => void;
  onPRClick?: (id: string) => void;
  onIssueClick?: (id: number) => void;
}

export function TopNav({ onLogo, onPRClick, onIssueClick }: TopNavProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: stats } = useNationalStats();
  const { data: results } = useSearch(query);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className="h-14 flex items-center px-5 gap-4 sticky top-0 z-50"
      style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}
    >
      <div
        onClick={onLogo}
        className="font-mono text-[15px] font-bold text-gh-text cursor-pointer flex items-center gap-2"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="3" fill="#f78166" />
          <path
            d="M7 7 L7 17 M7 7 L13 7 Q17 7 17 11 Q17 14 14 14 L7 14 M13 14 L17 17"
            stroke="#0d1117"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        RepublicOS
      </div>

      <div className="flex-1 min-w-0 max-w-[720px] relative" ref={ref}>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          placeholder="Search issues, bills, contributors, acts..."
          className="w-full h-8 bg-gh-bg border border-gh-border rounded-md pl-8 pr-10 text-gh-text font-mono text-xs outline-none focus:border-gh-accent"
        />
        <span className="absolute left-2.5 top-2 text-gh-muted font-mono">⌕</span>
        <span className="absolute right-2.5 top-1.5 font-mono text-[10px] text-gh-muted px-1.5 py-0.5 border border-gh-border rounded">
          /
        </span>

        {showResults && query.trim() && (results.prs.length > 0 || results.issues.length > 0) && (
          <div
            className="absolute top-10 left-0 right-0 rounded-md shadow-2xl z-50 overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            {results.prs.length > 0 && (
              <div>
                <div className="px-3 py-1.5 font-mono text-[10px] text-gh-muted border-b border-gh-border bg-gh-surface2">
                  Bills
                </div>
                {results.prs.slice(0, 4).map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => { onPRClick?.(pr.id); setShowResults(false); setQuery(''); }}
                    className="w-full text-left px-3 py-2 flex items-start gap-2 cursor-pointer border-none bg-transparent hover:bg-gh-surface2"
                  >
                    <span className="font-mono text-[11px] text-gh-muted mt-px">PR</span>
                    <div>
                      <div className="font-sans text-sm text-gh-text">{pr.title}</div>
                      <div className="font-mono text-[10px] text-gh-muted">#{pr.id} · {pr.status}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {results.issues.length > 0 && (
              <div>
                <div className="px-3 py-1.5 font-mono text-[10px] text-gh-muted border-b border-gh-border bg-gh-surface2">
                  Issues
                </div>
                {results.issues.slice(0, 4).map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => { onIssueClick?.(issue.id); setShowResults(false); setQuery(''); }}
                    className="w-full text-left px-3 py-2 flex items-start gap-2 cursor-pointer border-none bg-transparent hover:bg-gh-surface2"
                  >
                    <span className="font-mono text-[11px] text-gh-muted mt-px">●</span>
                    <div>
                      <div className="font-sans text-sm text-gh-text">{issue.title}</div>
                      <div className="font-mono text-[10px] text-gh-muted">#{issue.id} · {issue.state}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-[18px] font-mono text-[11px] text-gh-muted flex-shrink-0">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: C.green, boxShadow: `0 0 6px ${C.green}` }}
          />
          <span>
            Parliament: <span style={{ color: C.green }}>In Session</span>
          </span>
        </span>
        <span className="text-gh-border">│</span>
        <span>
          <span className="text-gh-text">{stats?.openBills ?? '—'}</span> open bills
        </span>
        <span className="text-gh-border">│</span>
        <span>
          Last merged: <span className="text-gh-text">{stats?.lastMergedAge ?? '—'}</span>
        </span>
      </div>
      <Avatar handle="rashtrapati-bhavan" size={26} />
    </div>
  );
}
