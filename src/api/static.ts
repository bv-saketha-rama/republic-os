import type { State, PR, Issue, Release, Contributor, ChangelogEntry } from '@/types';
import * as data from '@convex/data';

// Static data access layer.
// Replace these with Convex `useQuery(api.*)` calls when backend is live.

export function getStates(): State[] {
  return data.STATES;
}

export function getStateById(id: string): State | undefined {
  return data.STATES.find((s) => s.id === id);
}

export function getPRs(stateId?: string | null): PR[] {
  if (stateId === null) return data.PRS;
  if (stateId === 'mh') return data.MH_PRS;
  return data.MH_PRS;
}

export function getPRById(id: string): PR | undefined {
  return [...data.PRS, ...data.MH_PRS].find((p) => p.id === id);
}

export function getIssues(stateId?: string | null): Issue[] {
  if (!stateId || stateId === 'IN') return data.ISSUES;
  return data.ISSUES.filter((i) => i.state === stateId);
}

export function getIssueById(id: number): Issue | undefined {
  return data.ISSUES.find((i) => i.id === id);
}

export function getReleases(): Release[] {
  return data.RELEASES;
}

export function getContributorByHandle(handle: string): Contributor | undefined {
  return data.CONTRIBUTORS[handle];
}

export function getChangelog(): ChangelogEntry[] {
  return data.CHANGELOG_MH;
}

export function getPartyColor(party: string): string {
  return data.PARTY_COLORS[party] ?? '#7d8590';
}

export { data };
