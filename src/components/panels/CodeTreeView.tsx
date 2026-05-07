import { useReleases, useStateById } from '@/hooks/useConvex';
import { C } from '@/lib/constants';

interface CodeTreeViewProps {
  stateId: string;
}

export function CodeTreeView({ stateId }: CodeTreeViewProps) {
  const { data: releases } = useReleases(stateId);
  const { data: state } = useStateById(stateId === 'IN' ? null : stateId);

  const latestRelease = releases.find((r) => !r.yanked && !r.ordinance);
  const latestGazette = releases.find((r) => r.gazetteNo);

  const files = [
    { type: 'dir', name: 'constitution', last: 'Constitution of India · 7th Schedule', age: '76 years ago' },
    { type: 'dir', name: 'acts', last: latestRelease ? `merged ${latestRelease.title}` : 'merged last Act', age: latestRelease?.date ?? '—' },
    { type: 'dir', name: 'rules', last: 'Subsidiary legislation & rules', age: '—' },
    { type: 'dir', name: 'schemes', last: `${state?.acts ?? releases.length} active central/state schemes`, age: '—' },
    { type: 'dir', name: 'budgets', last: `FY25-26 demands for grants`, age: '38 days ago' },
    { type: 'dir', name: 'gazettes', last: latestGazette ? `commit ${latestRelease?.gazetteNo ?? latestGazette.gazetteNo}` : 'gazette notifications', age: latestRelease?.date ?? '5 days ago' },
    { type: 'file', name: 'CONTRIBUTING.md', last: '7th Schedule — State List', age: '4 months ago' },
    { type: 'file', name: 'README.md', last: state ? `${state.name} · ${state.capital ?? 'Capital'} · ${state.population ?? '—'} pop.` : 'state README', age: '1 year ago' },
    { type: 'file', name: 'CODEOWNERS', last: `@india/${stateId}/cabinet · ${state?.maintainer ?? ''}`, age: '6 months ago' },
    { type: 'file', name: '.governance.yml', last: `health: ${state?.health ?? '—'} · resolveRate: ${state?.resolveRate ?? '—'}`, age: '—' },
    { type: 'file', name: 'LICENSE', last: 'GoI · Republic of India · 1950', age: '76 years ago' },
  ];

  return (
    <div className="p-6">
      <div className="bg-gh-surface border border-gh-border rounded-md overflow-hidden">
        <div className="px-3.5 py-2 border-b border-gh-border font-mono text-[11px] text-gh-muted flex items-center gap-2.5">
          <span className="text-gh-text">main</span> <span>↓</span>
          <span>·</span>
          <span>{files.length} items</span>
          <span className="ml-auto text-gh-muted">commit b2e1f04 · 5 days ago</span>
        </div>
        {files.map((f, i) => (
          <div
            key={i}
            className="px-3.5 py-2 flex items-center gap-2.5 font-mono text-xs text-gh-text cursor-pointer hover:bg-gh-surface2 transition-colors"
            style={{ borderBottom: i < files.length - 1 ? `1px solid ${C.border2}` : 'none' }}
          >
            <span style={{ color: f.type === 'dir' ? C.blue : C.muted }}>
              {f.type === 'dir' ? '▸' : '▭'}
            </span>
            <span className="min-w-[200px]" style={{ color: f.type === 'dir' ? C.accent : C.text }}>
              {f.name}
            </span>
            <span className="flex-1 text-gh-muted text-[11px] font-sans">{f.last}</span>
            <span className="text-gh-muted text-[11px]">{f.age}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
