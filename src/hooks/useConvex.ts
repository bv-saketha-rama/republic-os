// Unified Convex query hooks replacing src/api/static.ts
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useStates() {
  const data = useQuery(api.states.getStates);
  return { data: data ?? [], isLoading: data === undefined };
}

export function useStateById(id: string | null) {
  const data = useQuery(api.states.getStateById, id ? { id } : 'skip');
  return { data: data ?? null, isLoading: data === undefined };
}

export function usePRs(stateId?: string | null, status?: string, year?: number, month?: number) {
  const args: { stateId?: string; status?: string; year?: number; month?: number } = {};
  if (stateId) args.stateId = stateId;
  if (status) args.status = status;
  if (year) args.year = year;
  if (month) args.month = month;
  const data = useQuery(api.prs.getPRs, args);
  return { data: data ?? [], isLoading: data === undefined };
}

export function usePRYears(stateId?: string | null) {
  const args = stateId ? { stateId } : {};
  const data = useQuery(api.prs.getPRYears, args);
  return { data: data ?? [], isLoading: data === undefined };
}

export function usePRById(id: string | null) {
  const data = useQuery(api.prs.getPRById, id ? { id } : 'skip');
  return { data: data ?? null, isLoading: data === undefined };
}

export function useIssues(stateId?: string | null, status?: string, label?: string, year?: number, month?: number) {
  const args: { stateId?: string; status?: string; label?: string; year?: number; month?: number } = {};
  if (stateId) args.stateId = stateId;
  if (status) args.status = status;
  if (label) args.label = label;
  if (year) args.year = year;
  if (month) args.month = month;
  const data = useQuery(api.issues.getIssues, args);
  return { data: data ?? [], isLoading: data === undefined };
}

export function useIssueById(id: number | null) {
  const data = useQuery(api.issues.getIssueById, id !== null ? { id } : 'skip');
  return { data: data ?? null, isLoading: data === undefined };
}

export function useReleases(stateId?: string | null, year?: number, month?: number) {
  const args: { stateId?: string; year?: number; month?: number } = {};
  if (stateId) args.stateId = stateId;
  if (year) args.year = year;
  if (month) args.month = month;
  const data = useQuery(api.releases.getReleases, args);
  return { data: data ?? [], isLoading: data === undefined };
}

export function useContributor(handle: string | null) {
  const data = useQuery(api.contributors.getContributorByHandle, handle ? { handle } : 'skip');
  return { data: data ?? null, isLoading: data === undefined };
}

export function useChangelog(stateId?: string | null, year?: number, month?: number) {
  const args: { stateId?: string; year?: number; month?: number } = {};
  if (stateId) args.stateId = stateId;
  if (year) args.year = year;
  if (month) args.month = month;
  const data = useQuery(api.changelog.getChangelog, args);
  return { data: data ?? [], isLoading: data === undefined };
}

export function useDiscussions(stateId?: string | null) {
  const args = stateId ? { stateId } : {};
  const data = useQuery(api.discussions.getDiscussions, args);
  return { data: data ?? [], isLoading: data === undefined };
}

export function useWikiPages(stateId?: string | null) {
  const args = stateId !== undefined ? { stateId: stateId ?? undefined } : {};
  const data = useQuery(api.wiki.getWikiPages, args);
  return { data: data ?? [], isLoading: data === undefined };
}

export function useNationalStats() {
  const data = useQuery(api.stats.getNationalStats);
  return { data: data ?? null, isLoading: data === undefined };
}

export function useSearch(q: string) {
  const data = useQuery(api.search.searchAll, q.trim() ? { q } : 'skip');
  return { data: data ?? { prs: [], issues: [] }, isLoading: data === undefined };
}
