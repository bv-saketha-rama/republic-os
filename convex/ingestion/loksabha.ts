import { action } from '../_generated/server';
import { api } from '../_generated/api';

// GitHub raw URL — updated daily by the fetch-bills.yml GitHub Action.
// Set GITHUB_REPO in Convex dashboard env vars: e.g. "bv-saketha-rama/republic-os"
declare const process: { env: Record<string, string | undefined> };
const GITHUB_REPO = process.env.GITHUB_REPO ?? '';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/data`;

function mapStatus(s: string): string {
  const t = (s ?? '').toLowerCase();
  if (t.includes('assented') || t.includes('gazette') || t.includes('passed both')) return 'merged';
  if (t.includes('lapsed') || t.includes('withdrawn')) return 'lapsed';
  if (t.includes('committee') || t.includes('referred') || t.includes('select committee')) return 'in-review';
  if (t.includes('rajya sabha') || t.includes('rs consideration')) return 'in-review';
  if (t.includes('ordinance')) return 'ordinance';
  return 'open';
}

function mapStage(statusStr: string, committee?: string): string {
  const s = (statusStr ?? '').toLowerCase();
  if (s.includes('assented') || s.includes('gazette')) return 'Gazette Notification';
  if (s.includes('passed both')) return 'Passed — awaiting Presidential Assent';
  if (s.includes('rajya sabha')) return 'Rajya Sabha review';
  if (s.includes('committee')) return `Committee: ${committee ?? 'Standing Committee'}`;
  if (s.includes('introduced')) return 'First reading: Lok Sabha';
  return statusStr || 'Under consideration';
}

function slugify(name: string): string {
  return (name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface Bill {
  BillNo?: string;
  BillTitle?: string;
  BillStatus?: string;
  Ministry?: string;
  IntroducedDate?: string;
  CommitteeReferred?: string;
}

export const fetchAndStoreBills = action({
  args: {},
  handler: async (ctx) => {
    if (!GITHUB_REPO) {
      return { fetched: 0, message: 'Set GITHUB_REPO env var in Convex dashboard (e.g. "sakethram9999/republicos")' };
    }

    let bills: Bill[] = [];
    try {
      const res = await fetch(`${RAW_BASE}/bills.json`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`GitHub raw HTTP ${res.status}`);
      const json = await res.json() as { bills?: Bill[] };
      bills = json.bills ?? [];
    } catch (e) {
      console.error('Failed to fetch bills from GitHub:', e);
      return { fetched: 0, message: `GitHub fetch failed: ${e}` };
    }

    let fetched = 0;
    for (const bill of bills) {
      const billNo = bill.BillNo ?? '';
      const title = bill.BillTitle ?? '';
      if (!billNo || !title) continue;

      const id = `LS-${billNo.replace(/[^a-z0-9]/gi, '-')}`;
      const ministry = bill.Ministry ?? '';
      const statusRaw = bill.BillStatus ?? '';

      await ctx.runMutation(api.ingestion.upserts.upsertPR, {
        id,
        title,
        status: mapStatus(statusRaw),
        labels: ministry ? [slugify(ministry)] : [],
        stage: mapStage(statusRaw, bill.CommitteeReferred),
        author: ministry ? `${slugify(ministry)}-minister` : 'government',
        age: bill.IntroducedDate ? `Introduced ${bill.IntroducedDate}` : 'recent',
        conversations: 0,
        ministry: ministry || undefined,
        introducedDate: bill.IntroducedDate ?? undefined,
        loksabhaId: billNo,
        sourceUrl: `https://sansad.in/ls/bills/${billNo}`,
      });
      fetched++;
    }

    return { fetched, message: `Synced ${fetched} bills from GitHub data cache` };
  },
});

export const fetchAndStoreMembers = action({
  args: {},
  handler: async (ctx) => {
    if (!GITHUB_REPO) {
      return { fetched: 0, message: 'Set GITHUB_REPO env var in Convex dashboard' };
    }

    let members: Record<string, string>[] = [];
    try {
      const res = await fetch(`${RAW_BASE}/members.json`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`GitHub raw HTTP ${res.status}`);
      const json = await res.json() as { Members?: Record<string, string>[] };
      members = json.Members ?? [];
    } catch (e) {
      return { fetched: 0, message: `GitHub fetch failed: ${e}` };
    }

    let fetched = 0;
    for (const member of members) {
      const name = member.MemberName ?? member.Name ?? '';
      if (!name) continue;
      await ctx.runMutation(api.ingestion.upserts.upsertContributor, {
        handle: slugify(name),
        name,
        role: member.Designation ?? 'MP',
        party: member.Party ?? 'Independent',
        house: 'Lok Sabha',
        constituency: member.Constituency ?? undefined,
        state: member.State ? slugify(member.State) : undefined,
        loksabhaId: member.MemberID ?? undefined,
      });
      fetched++;
    }
    return { fetched, message: `Synced ${fetched} members from GitHub data cache` };
  },
});
