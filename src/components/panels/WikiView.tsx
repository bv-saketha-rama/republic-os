import { useEffect, useState, type ReactNode } from 'react';
import { useWikiPages } from '@/hooks/useConvex';
import { C } from '@/lib/constants';

interface WikiViewProps { stateId?: string; }

// Minimal inline markdown: [text](slug-or-url), **bold**, *italic*.
function inline(text: string, onNav: (slug: string) => void): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const href = m[2];
      out.push(/^https:\/\//.test(href)
        ? <a key={k++} href={href} target="_blank" rel="noopener noreferrer" className="text-gh-accent underline">{m[1]}</a>
        : <button key={k++} onClick={() => onNav(href)} className="text-gh-accent underline bg-transparent border-none p-0 cursor-pointer font-inherit">{m[1]}</button>);
    } else if (m[3] !== undefined) out.push(<strong key={k++}>{m[3]}</strong>);
    else out.push(<em key={k++}>{m[4]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function WikiView({ stateId }: WikiViewProps) {
  const { data: pages, isLoading } = useWikiPages(stateId);
  const [activeSlug, setActiveSlug] = useState('home');
  useEffect(() => setActiveSlug('home'), [stateId]);

  if (isLoading) return <div className="p-6 font-mono text-gh-muted text-sm">Loading wiki…</div>;

  const home = pages.find((p) => p.slug === 'home') ?? pages[0];
  const active = pages.find((p) => p.slug === activeSlug) ?? home;

  if (!home && pages.length === 0) return (
    <div className="p-6 font-mono text-gh-muted text-sm">No wiki pages yet.</div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[400px]">
      {/* Sidebar */}
      <div className="md:border-r border-b md:border-b-0 border-gh-border px-4 py-5">
        <div className="font-mono text-[11px] text-gh-muted font-semibold mb-3">Pages</div>
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className="block w-full text-left px-2 py-1.5 rounded-md mb-0.5 font-mono text-[12px] bg-transparent border-none cursor-pointer"
            style={{ color: activeSlug === p.slug ? C.text : C.muted, background: activeSlug === p.slug ? C.surface2 : 'transparent' }}
          >
            {p.title.replace(/ — Wiki$/, '').replace(/^.*? — /, '')}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 py-5">
        {active ? (
          <>
            <div className="font-mono text-[11px] text-gh-muted mb-2">
              wiki / {active.slug}.md · Last updated {active.lastUpdated}
            </div>
            <div className="font-sans text-sm text-gh-text leading-relaxed">
              {active.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="font-sans text-[22px] text-gh-text mt-0 mb-2">{inline(line.slice(2), setActiveSlug)}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="font-sans text-base text-gh-text mt-4 mb-1">{inline(line.slice(3), setActiveSlug)}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="font-sans text-sm font-semibold text-gh-text mt-3 mb-1">{inline(line.slice(4), setActiveSlug)}</h3>;
                if (line.startsWith('- ')) return <div key={i} className="font-mono text-xs text-gh-accent py-0.5 pl-2">• {inline(line.slice(2), setActiveSlug)}</div>;
                if (line.match(/^\d+\./)) return <div key={i} className="font-sans text-sm text-gh-text py-0.5 pl-2">{inline(line, setActiveSlug)}</div>;
                if (line === '') return <div key={i} className="h-2" />;
                return <p key={i} className="m-0 mb-1">{inline(line, setActiveSlug)}</p>;
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
