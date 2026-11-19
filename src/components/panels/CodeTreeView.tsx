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
    { type: 'dir', name: 'acts', last: latestRelease ? `latest: ${latestRelease.title}` : 'no releases yet', age: latestRelease?.date ?? '' },
    { type: 'dir', name: 'gazettes', last: latestGazette ? `latest notification ${latestGazette.gazetteNo}` : 'no gazette notifications yet', age: latestGazette?.date ?? '' },
    { type: 'file', name: 'README.md', last: state ? `${state.name} · ${state.capital ?? '—'} · ${state.population ?? '—'} pop.` : 'Republic of India', age: '' },
    { type: 'file', name: 'CODEOWNERS', last: state ? `@india/${stateId}/cabinet · ${state.maintainer}` : 'Union Cabinet', age: '' },
    { type: 'file', name: '.governance.yml', last: state ? `health: ${state.health} · resolveRate: ${state.resolveRate}` : '—', age: '' },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="bg-gh-surface border border-gh-border rounded-md overflow-hidden">
        <div className="px-3.5 py-2 border-b border-gh-border font-mono text-[11px] text-gh-muted flex items-center gap-2.5">
          <span className="text-gh-text">main</span> <span>↓</span>
          <span>·</span>
          <span>{files.length} items</span>
          {latestRelease && <span className="ml-auto text-gh-muted">latest release {latestRelease.date}</span>}
        </div>
        {files.map((f, i) => (
          <div
            key={i}
            className="px-3.5 py-2 flex items-center gap-2.5 font-mono text-xs text-gh-text flex-wrap"
            style={{ borderBottom: i < files.length - 1 ? `1px solid ${C.border2}` : 'none' }}
          >
            <span style={{ color: f.type === 'dir' ? C.blue : C.muted }}>
              {f.type === 'dir' ? '▸' : '▭'}
            </span>
            <span className="min-w-[120px] sm:min-w-[200px]" style={{ color: f.type === 'dir' ? C.accent : C.text }}>
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
