import { useState, useEffect } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { ChoroplethMap } from '@/components/map/ChoroplethMap';
import { HoverCard } from '@/components/map/HoverCard';
import { RepoHeader } from '@/components/panels/RepoHeader';
import { ChangelogView } from '@/components/panels/ChangelogView';
import { IssuesView } from '@/components/panels/IssuesView';
import { PRsView } from '@/components/panels/PRsView';
import { ReleasesView } from '@/components/panels/ReleasesView';
import { CodeTreeView } from '@/components/panels/CodeTreeView';
import { WikiView } from '@/components/panels/WikiView';
import { DiscussionsView } from '@/components/panels/DiscussionsView';
import { InsightsView } from '@/components/panels/InsightsView';
import { PRDetail } from '@/components/details/PRDetail';
import { IssueDetail } from '@/components/details/IssueDetail';
import { ContributorProfile } from '@/components/details/ContributorProfile';
import { useStates, useStateById } from '@/hooks/useConvex';
import { C } from '@/lib/constants';
import type { PanelTab, AppView } from '@/types';

const INDIA_STATE = {
  id: 'IN',
  name: 'India',
  maintainer: 'narendra-modi',
  party: 'BJP',
  mandateExpires: 'Jun 2029',
  open: 1247,
  prs: 47,
  acts: 12480,
  lastMerged: '3h ago',
  lastTitle: 'Income Tax Amendment Bill 2025',
  health: 'amber' as const,
  resolveRate: 0.65,
};

export function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<{ id: string; x: number; y: number } | null>(null);
  const [activeTab, setActiveTab] = useState<PanelTab>('changelog');
  const [view, setView] = useState<AppView>({ kind: 'repo' });
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { data: statesData } = useStates();
  const { data: stateData } = useStateById(selected !== 'IN' ? selected : null);

  const stateObj = selected === 'IN' ? INDIA_STATE : stateData;

  const selectState = (id: string) => {
    setSelected(id);
    setActiveTab('changelog');
    setView({ kind: 'repo' });
  };

  const selectNational = () => {
    setSelected('IN');
    setActiveTab('prs');
    setView({ kind: 'repo' });
  };

  const goToPR = (prId: string) => setView({ kind: 'pr', id: prId });
  const goToIssue = (id: number) => setView({ kind: 'issue', id: String(id) });
  const goToUser = (handle: string) => setView({ kind: 'profile', handle });
  const backToRepo = () => setView({ kind: 'repo' });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelected(null);
        setView({ kind: 'repo' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const panelOpen = !!(selected && stateObj);

  // Desktop: map 35% left / panel 65% right (flex-row)
  // Mobile: map top / panel bottom (flex-col); map collapses when panel open
  const mapStyle = isMobile
    ? {
        height: panelOpen ? '38vh' : '100%',
        width: '100%',
        borderBottom: panelOpen ? `1px solid ${C.border}` : 'none',
        flexShrink: 0,
      }
    : {
        width: panelOpen ? '35%' : '100%',
        borderRight: panelOpen ? `1px solid ${C.border}` : 'none',
      };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gh-bg">
      <TopNav
        onLogo={() => { setSelected(null); setView({ kind: 'repo' }); }}
        onPRClick={(id) => { setView({ kind: 'pr', id }); if (!selected) setSelected('IN'); }}
        onIssueClick={(id) => { setView({ kind: 'issue', id: String(id) }); if (!selected) setSelected('IN'); }}
      />

      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Map pane */}
        <div
          className="relative bg-gh-bg flex flex-col transition-all duration-400 ease-[cubic-bezier(.4,0,.2,1)]"
          style={mapStyle}
        >
          {/* Map header — hide on mobile when panel is open to save space */}
          {(!isMobile || !panelOpen) && (
            <div className="flex-shrink-0 px-5 py-3.5 flex items-center justify-between border-b border-gh-border">
              <div>
                <div className="font-mono text-[11px] text-gh-muted mb-0.5">$ ls /india/states</div>
                <div className="font-mono text-[13px] text-gh-text">
                  <span className="text-gh-accent">30</span> repositories · governance health
                </div>
              </div>
              <button
                onClick={selectNational}
                className="px-3 py-[5px] bg-gh-surface2 border border-gh-border rounded-md text-gh-text font-mono text-[11px] cursor-pointer"
              >
                <span className="text-gh-accent">india</span>
                <span className="text-gh-muted">/</span>main →
              </button>
            </div>
          )}

          {/* SVG fills all remaining space */}
          <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden p-2">
            <ChoroplethMap
              data={statesData}
              onSelect={selectState}
              selected={selected}
              hovered={hovered?.id ?? null}
              setHovered={setHovered}
            />
          </div>

          {/* Legend — hide on mobile when panel is open */}
          {(!isMobile || !panelOpen) && (
            <div className="flex-shrink-0 px-5 py-2.5 border-t border-gh-border flex gap-3 font-mono text-[10px] text-gh-muted items-center flex-wrap">
              <span className="text-gh-text font-semibold">// legend</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-sm mr-1 align-middle" style={{ background: '#1f6f3a' }} />healthy</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-sm mr-1 align-middle" style={{ background: '#9e6a00' }} />degraded</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-sm mr-1 align-middle" style={{ background: '#7d2424' }} />critical</span>
              {!isMobile && (
                <span className="ml-auto text-gh-muted">
                  Tip: hover, click.{' '}
                  <kbd className="bg-gh-surface2 px-1.5 py-px rounded border border-gh-border">esc</kbd>{' '}
                  to close.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Repo panel */}
        {panelOpen && (
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden animate-slideIn">
            {view.kind === 'repo' && (
              <>
                <RepoHeader
                  state={stateObj}
                  onClose={() => setSelected(null)}
                  onTab={(tab) => setActiveTab(tab as PanelTab)}
                  activeTab={activeTab}
                  onUserClick={goToUser}
                />
                {activeTab === 'changelog' && (
                  <ChangelogView
                    stateId={selected === 'IN' ? undefined : selected}
                    onUserClick={goToUser}
                    onIssueClick={goToIssue}
                    onPRClick={goToPR}
                  />
                )}
                {activeTab === 'issues' && (
                  <IssuesView
                    stateId={selected === 'IN' ? null : selected}
                    onIssueClick={goToIssue}
                    onUserClick={goToUser}
                  />
                )}
                {activeTab === 'prs' && (
                  <PRsView
                    stateId={selected === 'IN' ? null : selected}
                    onPRClick={goToPR}
                    onUserClick={goToUser}
                  />
                )}
                {activeTab === 'releases' && <ReleasesView stateId={selected === 'IN' ? null : selected} />}
                {activeTab === 'code' && <CodeTreeView stateId={selected} />}
                {activeTab === 'wiki' && <WikiView stateId={selected === 'IN' ? undefined : selected} />}
                {activeTab === 'discussions' && <DiscussionsView stateId={selected === 'IN' ? undefined : selected} />}
                {activeTab === 'insights' && <InsightsView state={stateObj} />}
              </>
            )}
            {view.kind === 'pr' && view.id && (
              <PRDetail
                prId={view.id}
                onBack={() => { setView({ kind: 'repo' }); setActiveTab('prs'); }}
                onUserClick={goToUser}
              />
            )}
            {view.kind === 'issue' && view.id && (
              <IssueDetail
                issueId={parseInt(view.id)}
                onBack={() => { setView({ kind: 'repo' }); setActiveTab('issues'); }}
                onUserClick={goToUser}
              />
            )}
            {view.kind === 'profile' && view.handle && (
              <ContributorProfile
                handle={view.handle}
                onBack={backToRepo}
                onUserClick={goToUser}
              />
            )}
          </div>
        )}
      </div>

      {!selected && <HoverCard hovered={hovered} data={statesData} />}
    </div>
  );
}
