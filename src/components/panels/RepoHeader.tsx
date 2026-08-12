import { Button } from '@/components/ui/Button';
import { UserLink } from '@/components/ui/UserLink';
import { getPartyColor } from '@/api/static';
import { C } from '@/lib/constants';
import type { State } from '@/types';

interface RepoHeaderProps {
  state: State;
  isNational?: boolean;
  openCount?: number;
  prCount?: number;
  articleCount?: number;
  onClose?: () => void;
  onTab: (tab: string) => void;
  activeTab: string;
  onUserClick: (handle: string) => void;
}

export function RepoHeader({
  state,
  isNational = false,
  openCount,
  prCount,
  articleCount,
  onClose,
  onTab,
  activeTab,
  onUserClick,
}: RepoHeaderProps) {
  const tabs = [
    { id: 'code', label: 'Code', count: null },
    { id: 'issues', label: 'Issues', count: isNational ? openCount : state.open },
    { id: 'prs', label: 'Pull requests', count: isNational ? prCount : state.prs },
    { id: 'releases', label: 'Releases', count: null },
    { id: 'changelog', label: 'Changelog', count: null },
    { id: 'news', label: 'News & sources', count: articleCount },
    { id: 'wiki', label: 'Wiki', count: null },
    { id: 'discussions', label: 'Discussions', count: null },
    { id: 'insights', label: 'Insights', count: null },
  ];
  const partyColor = getPartyColor(state.party);

  return (
    <div className="border-b border-gh-border bg-gh-bg">
      <div className="px-6 pt-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 font-mono text-base font-medium">
            <span className="text-gh-muted">india</span>
            <span className="text-gh-muted">/</span>
            <span className="text-gh-text">{isNational ? 'national' : state.id}</span>
            <span className="ml-2 px-[7px] py-px rounded-full border border-gh-border text-[10px] text-gh-muted font-normal">Public</span>
          </div>
          {onClose && <Button icon="✕" size="sm" onClick={onClose}>Close</Button>}
        </div>
        {isNational ? (
          <div className="font-mono text-[11px] text-gh-muted mb-3.5">National scope · source-backed records</div>
        ) : (
          <div className="font-mono text-[11px] text-gh-muted mb-3.5">
            Maintained by <UserLink handle={state.maintainer} onClick={onUserClick} />
            <span> · </span>
            <span style={{ color: partyColor }}>{state.party}</span>
            <span> · Mandate expires {state.mandateExpires}</span>
          </div>
        )}
        <div className="flex gap-0 font-mono text-xs overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTab(t.id)}
              className="px-3 py-2 bg-transparent border-none font-mono text-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              style={{
                borderBottom: activeTab === t.id ? `2px solid ${C.accent}` : '2px solid transparent',
                color: activeTab === t.id ? C.text : C.muted,
                fontWeight: activeTab === t.id ? 600 : 400,
              }}
            >
              {t.label}
              {t.count != null && (
                <span className="px-1.5 rounded-full bg-gh-surface2 text-gh-muted text-[10px]">{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
