import { useState } from 'react';
import { Tag } from '@/components/ui/Tag';
import { Hash } from '@/components/ui/Hash';
import { usePRs, usePRYears } from '@/hooks/useConvex';
import { YearMonthFilter } from '@/components/ui/YearMonthFilter';
import { C, STATUS } from '@/lib/constants';

interface PRsViewProps {
  stateId?: string | null;
  onPRClick: (id: string) => void;
  onUserClick: (handle: string) => void;
}

export function PRsView({ stateId, onPRClick, onUserClick }: PRsViewProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const [year, setYear] = useState<number | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const { data: years } = usePRYears(stateId);
  const { data: all } = usePRs(stateId, filter ?? undefined, year, month);
  const filters = [
    { id: 'draft', label: 'Draft', color: C.muted },
    { id: 'open', label: 'Open', color: C.blue },
    { id: 'in-review', label: 'In Review', color: C.yellow },
    { id: 'changes-requested', label: 'Changes Requested', color: C.red },
    { id: 'merged', label: 'Merged', color: C.purple },
    { id: 'closed', label: 'Closed', color: C.red },
    { id: 'lapsed', label: 'Lapsed', color: C.muted },
  ];
  const filtered = all;

  const borderColor = (st: string) => {
    const map: Record<string, string> = {
      open: C.blue,
      draft: C.muted,
      'in-review': C.yellow,
      'changes-requested': C.red,
      merged: C.green,
      closed: C.red,
      lapsed: C.muted,
      ordinance: C.purple,
    };
    return map[st] || C.border;
  };

  return (
    <div>
      <div className="px-6 py-3.5 border-b border-gh-border bg-gh-surface flex items-center gap-2 flex-wrap justify-between">
        <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className="px-2.5 py-[3px] rounded-md font-mono text-[11px] cursor-pointer"
          style={{
            border: `1px solid ${filter === null ? C.text : C.border}`,
            background: filter === null ? C.surface2 : 'transparent',
            color: filter === null ? C.text : C.muted,
          }}
        >
          All
        </button>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(filter === f.id ? null : f.id)}
            className="px-2.5 py-[3px] rounded-md font-mono text-[11px] cursor-pointer"
            style={{
              border: `1px solid ${filter === f.id ? f.color : C.border}`,
              background: filter === f.id ? `${f.color}22` : 'transparent',
              color: filter === f.id ? f.color : C.muted,
            }}
          >
            {STATUS[f.id]?.icon} {f.label}
          </button>
        ))}
        </div>
        <YearMonthFilter
          years={years}
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
      </div>

      <div>
        {filtered.map((pr) => (
          <div
            key={pr.id}
            onClick={() => onPRClick(pr.id)}
            className="px-6 py-3 pl-5 border-b border-gh-border2 cursor-pointer flex items-start gap-3 hover:bg-gh-surface transition-colors"
            style={{ borderLeft: `4px solid ${borderColor(pr.status)}` }}
          >
            <span
              className="mt-0.5 font-mono text-[13px]"
              style={{ color: borderColor(pr.status) }}
            >
              {STATUS[pr.status]?.icon}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {pr.labels.map((l) => (
                  <Tag
                    key={l}
                    color={l === 'money-bill' ? C.yellow : l === 'hotfix' ? C.purple : C.blue}
                  >
                    {l}
                  </Tag>
                ))}
                <span className="font-sans text-sm font-medium text-gh-text">{pr.title}</span>
                <Hash>#{pr.id}</Hash>
              </div>
              <div className="font-mono text-[11px] text-gh-muted mt-1">
                Opened by{' '}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onUserClick(pr.author);
                  }}
                  className="text-gh-accent cursor-pointer"
                >
                  @{pr.author}
                </span>
                <span> · {pr.age}</span>
                <span> · {pr.stage}</span>
                <span> · {pr.conversations} conversations</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
