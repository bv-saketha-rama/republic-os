import { C } from '@/lib/constants';
import type { Article } from '@/types';

interface SourceCardProps {
  article?: Article;
  url: string;
  outlet: string;
  label?: string;
}

export function SourceCard({ article, url, outlet, label = 'Open source ↗' }: SourceCardProps) {
  const sourceKind = article?.sourceKind;
  const accent = sourceKind === 'official' ? C.green : sourceKind === 'reported' ? C.purple : C.blue;
  return (
    <div className="rounded-md bg-gh-surface border border-gh-border px-3 py-2.5" style={{ borderLeft: `3px solid ${accent}` }}>
      <div className="font-mono text-[10px] text-gh-muted">{outlet}{sourceKind ? ` · ${sourceKind}` : ''}</div>
      {article?.title && <div className="mt-1 font-sans text-xs text-gh-text">{article.title}</div>}
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-block font-mono text-[11px] text-gh-accent hover:underline">{label}</a>
    </div>
  );
}
