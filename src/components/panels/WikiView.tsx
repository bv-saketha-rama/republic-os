import { useState } from 'react';
import { useWikiPages } from '@/hooks/useConvex';
import { C } from '@/lib/constants';

interface WikiViewProps { stateId?: string; }

export function WikiView({ stateId }: WikiViewProps) {
  const { data: pages, isLoading } = useWikiPages(stateId);
  const [activeSlug, setActiveSlug] = useState('home');

  if (isLoading) return <div className="p-6 font-mono text-gh-muted text-sm">Loading wiki…</div>;

  const home = pages.find((p) => p.slug === 'home') ?? pages[0];
  const active = pages.find((p) => p.slug === activeSlug) ?? home;

  if (!home && pages.length === 0) return (
    <div className="p-6 font-mono text-gh-muted text-sm">No wiki pages yet.</div>
  );

  return (
    <div className="grid grid-cols-[220px_1fr] min-h-[400px]">
      {/* Sidebar */}
      <div className="border-r border-gh-border px-4 py-5">
        <div className="font-mono text-[11px] text-gh-muted font-semibold mb-3">Pages</div>
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className="block w-full text-left px-2 py-1.5 rounded-md mb-0.5 font-mono text-[12px] bg-transparent border-none cursor-pointer"
            style={{ color: activeSlug === p.slug ? C.text : C.muted, background: activeSlug === p.slug ? C.surface2 : 'transparent' }}
          >
            {p.title.replace(' — Wiki', '').replace('india/maharashtra — ', '').replace('india — ', '')}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        {active ? (
          <>
            <div className="font-mono text-[11px] text-gh-muted mb-2">
              wiki / {active.slug}.md · Last updated {active.lastUpdated}
            </div>
            <div className="font-sans text-sm text-gh-text leading-relaxed">
              {active.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="font-sans text-[22px] text-gh-text mt-0 mb-2">{line.slice(2)}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="font-sans text-base text-gh-text mt-4 mb-1">{line.slice(3)}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="font-sans text-sm font-semibold text-gh-text mt-3 mb-1">{line.slice(4)}</h3>;
                if (line.startsWith('- ')) return <div key={i} className="font-mono text-xs text-gh-accent py-0.5 pl-2">• {line.slice(2)}</div>;
                if (line.match(/^\d+\./)) return <div key={i} className="font-sans text-sm text-gh-text py-0.5 pl-2">{line}</div>;
                if (line === '') return <div key={i} className="h-2" />;
                return <p key={i} className="m-0 mb-1">{line}</p>;
              })}
            </div>
          </>
        ) : (
          <div className="font-mono text-gh-muted text-sm">Select a page from the sidebar.</div>
        )}
      </div>
    </div>
  );
}
