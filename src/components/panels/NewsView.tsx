import { useMemo, useState } from 'react';
import { useArticles } from '@/hooks/useConvex';
import { C } from '@/lib/constants';
import type { Article } from '@/types';

interface NewsViewProps {
  stateId?: string | null;
}

type SourceFilter = 'all' | Article['sourceKind'];

const sourceMeta: Record<Article['sourceKind'], { label: string; color: string }> = {
  official: { label: 'Official', color: C.green },
  primary: { label: 'Primary', color: C.blue },
  reported: { label: 'Reported', color: C.purple },
};

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
}

function freshnessLabel(value?: string) {
  if (!value) return 'No source sync yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Freshness unavailable';
  return `Last fetched ${new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date)}`;
}
export function NewsView({ stateId }: NewsViewProps) {
  const [filter, setFilter] = useState<SourceFilter>('all');
  const { data: articles, isLoading } = useArticles(stateId);
  const filtered = useMemo(
    () => filter === 'all' ? articles : articles.filter((article) => article.sourceKind === filter),
    [articles, filter],
  );
  const newestFetchedAt = articles.reduce<string | undefined>(
    (latest, article) => !latest || article.fetchedAt > latest ? article.fetchedAt : latest,
    undefined,
  );
  const stale = newestFetchedAt
    ? Date.now() - new Date(newestFetchedAt).getTime() > 48 * 60 * 60 * 1000
    : false;

  return (
    <section aria-labelledby="news-heading" className="px-6 py-5">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="font-mono text-[11px] text-gh-muted mb-1">// provenance</div>
          <h2 id="news-heading" className="m-0 font-sans text-lg font-semibold text-gh-text">News &amp; sources</h2>
          <p className="m-0 mt-1 font-sans text-xs text-gh-muted">Official releases and primary sources, with reported material clearly marked.</p>
        </div>
        <div className={`font-mono text-[11px] ${stale ? 'text-gh-yellow' : 'text-gh-muted'}`}>
          {stale ? 'Stale feed · ' : ''}{freshnessLabel(newestFetchedAt)}
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-5" role="group" aria-label="Filter sources">
        {(['all', 'official', 'primary', 'reported'] as const).map((kind) => {
          const selected = filter === kind;
          const label = kind === 'all' ? 'All' : sourceMeta[kind].label;
          const color = kind === 'all' ? C.text : sourceMeta[kind].color;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => setFilter(kind)}
              aria-pressed={selected}
              className="px-2.5 py-[3px] rounded-md font-mono text-[11px] cursor-pointer"
              style={{
                border: `1px solid ${selected ? color : C.border}`,
                background: selected ? `${color}22` : 'transparent',
                color: selected ? color : C.muted,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {isLoading && <div className="py-10 text-center font-mono text-xs text-gh-muted">Loading source records…</div>}
      {!isLoading && filtered.length === 0 && (
        <div className="rounded-md border border-gh-border bg-gh-surface px-5 py-8 text-center">
          <div className="font-sans text-sm text-gh-text">{articles.length === 0 ? 'This feed has not synced yet.' : 'No source matches this filter.'}</div>
          <div className="mt-1 font-mono text-[11px] text-gh-muted">Source records appear here when a configured feed succeeds.</div>
        </div>
      )}
      <div className="grid gap-3">
        {filtered.map((article) => {
          const meta = sourceMeta[article.sourceKind];
          return (
            <article
              key={article.id}
              className="rounded-md bg-gh-surface border border-gh-border p-4"
              style={{ borderLeft: `3px solid ${meta.color}` }}
            >
              <div className="flex items-center gap-2 flex-wrap font-mono text-[10px] text-gh-muted">
                <span className="text-gh-text font-semibold">{article.outlet}</span>
                <span className="px-1.5 py-0.5 rounded-full" style={{ color: meta.color, border: `1px solid ${meta.color}66` }}>{meta.label}</span>
                {formatDate(article.publishedAt) && <span>Published {formatDate(article.publishedAt)}</span>}
              </div>
              <h3 className="m-0 mt-2 font-sans text-[15px] font-semibold leading-snug text-gh-text">{article.title}</h3>
              {article.excerpt && <p className="m-0 mt-2 font-sans text-xs leading-relaxed text-gh-muted">{article.excerpt}</p>}
              <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                <span className="font-mono text-[10px] text-gh-muted">Fetched {formatDate(article.fetchedAt)}</span>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-gh-accent hover:underline">Open source ↗</a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
