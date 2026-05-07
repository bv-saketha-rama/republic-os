import { useState } from 'react';
import { useReleases, usePRYears } from '@/hooks/useConvex';
import { YearMonthFilter } from '@/components/ui/YearMonthFilter';
import { C } from '@/lib/constants';

interface ReleasesViewProps { stateId?: string | null; }

export function ReleasesView({ stateId }: ReleasesViewProps) {
  const [year, setYear] = useState<number | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const { data: years } = usePRYears(stateId);
  const { data: releases } = useReleases(stateId, year, month);

  return (
    <div>
      <div className="px-6 py-3 border-b border-gh-border bg-gh-surface flex justify-end">
        <YearMonthFilter years={years} year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />
      </div>
      <div className="px-6 py-5">
      {releases.map((r, i) => (
        <div key={i} className="grid grid-cols-[180px_1fr] gap-6 py-5 border-b border-gh-border">
          <div>
            <div
              className="font-mono text-lg font-semibold"
              style={{
                color: r.yanked ? C.muted : C.text,
                textDecoration: r.yanked ? 'line-through' : 'none',
              }}
            >
              {r.tag}
            </div>
            {r.latest && (
              <div className="mt-2 inline-block px-2 py-0.5 bg-gh-green text-gh-bg rounded-full font-mono text-[10px] font-semibold">
                Latest
              </div>
            )}
            {r.yanked && (
              <div className="mt-2 inline-block px-2 py-0.5 bg-gh-red text-gh-bg rounded-full font-mono text-[10px] font-semibold">
                yanked
              </div>
            )}
            {r.ordinance && (
              <div className="mt-2 inline-block px-2 py-0.5 bg-gh-purple text-gh-bg rounded-full font-mono text-[10px] font-semibold">
                pre-release
              </div>
            )}
          </div>
          <div>
            <div className="font-sans text-lg font-semibold text-gh-text">{r.title}</div>
            <div className="font-mono text-[11px] text-gh-muted mt-1.5">
              Released {r.date} · merged via <span className="text-gh-accent">#{r.pr}</span> ·{' '}
              {r.assets} assets
            </div>
            {r.yanked && (
              <div
                className="mt-2.5 p-2.5 rounded-md font-sans text-xs text-gh-text"
                style={{ background: '#3d1418', border: `1px solid ${C.red}44` }}
              >
                <span className="text-gh-red">⚠ </span>
                {r.yankReason}
              </div>
            )}
            {r.ordinance && (
              <div
                className="mt-2.5 p-2.5 rounded-md font-sans text-xs text-gh-text"
                style={{ background: '#2d1b4d', border: `1px solid ${C.purple}44` }}
              >
                <span className="text-gh-purple">⚡ </span>
                Expires in {r.expiresIn} unless followed by a bill.
              </div>
            )}
            {r.notes && (
              <div className="mt-2.5 font-sans text-[13px] text-gh-text leading-relaxed">
                {r.notes}
              </div>
            )}
            <div className="mt-2.5 font-mono text-[11px] text-gh-accent cursor-pointer">
              See full release notes ↗
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
