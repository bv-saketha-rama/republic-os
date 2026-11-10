import { action } from '../_generated/server';
import { api } from '../_generated/api';

// GitHub raw URL — updated daily by the fetch-bills.yml GitHub Action.
// Override with GITHUB_REPO in Convex dashboard env vars (e.g. "owner/repo").
declare const process: { env: Record<string, string | undefined> };
const GITHUB_REPO = process.env.GITHUB_REPO || 'bv-saketha-rama/republic-os';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/data`;
const BATCH = 20;

// The Lok Sabha API field names are not documented; accept common variants.
function pick(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const hit = Object.keys(obj).find((o) => o.toLowerCase() === k.toLowerCase());
    const val = hit ? obj[hit] : undefined;
    if (val !== undefined && val !== null && String(val).trim() !== '') return String(val).trim();
  }
  return '';
}

async function inBatches<T>(items: T[], fn: (item: T) => Promise<boolean>): Promise<number> {
  let ok = 0;
  for (let i = 0; i < items.length; i += BATCH) {
    const results = await Promise.all(items.slice(i, i + BATCH).map(fn));
    ok += results.filter(Boolean).length;
  }
  return ok;
}

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

type Bill = Record<string, unknown>;

export const fetchAndStoreBills = action({
  args: {},
  handler: async (ctx) => {
    let bills: Bill[] = [];
    try {
      const res = await fetch(`${RAW_BASE}/bills.json`, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`GitHub raw HTTP ${res.status}`);
      const json = await res.json() as { bills?: Bill[] };
      bills = json.bills ?? [];
    } catch (e) {
      console.error('Failed to fetch bills from GitHub:', e);
      return { fetched: 0, message: `GitHub fetch failed: ${e}` };
    }
    if (bills.length === 0) return { fetched: 0, message: 'bills.json is empty — check the fetch-bills workflow' };

    const fetched = await inBatches(bills, async (bill) => {
      const billNo = pick(bill, ['BillNo', 'BillNumber', 'bill_no', 'billNo']);
      const title = pick(bill, ['BillTitle', 'BillName', 'Title', 'bill_title']);
      if (!billNo || !title) return false;

      const isRS = pick(bill, ['House']).toUpperCase().startsWith('R');
      const prefix = isRS ? 'RS' : 'LS';
      const year = pick(bill, ['BillYear', 'Year']);
      const id = `${prefix}-${billNo.replace(/\//g, '_').replace(/[^a-z0-9_]/gi, '-')}${year && !billNo.includes(year) ? `-${year}` : ''}`;
      const ministry = pick(bill, ['Ministry', 'MinistryName']);
      const statusRaw = pick(bill, ['BillStatus', 'Status']);
      const introduced = pick(bill, ['IntroducedDate', 'DateOfIntroduction', 'IntroductionDate']);
      const committee = pick(bill, ['CommitteeReferred', 'Committee']);
      const author = ministry ? `${slugify(ministry)}-minister` : 'government';

      if (ministry) {
        await ctx.runMutation(api.ingestion.upserts.upsertContributor, {
          handle: author,
          name: `Minister, ${ministry}`,
          role: 'Minister',
          party: 'Government',
          house: isRS ? 'Rajya Sabha' : 'Lok Sabha',
        });
      }
      await ctx.runMutation(api.ingestion.upserts.upsertPR, {
        id,
        title,
        status: mapStatus(statusRaw),
        labels: ministry ? [slugify(ministry)] : [],
        stage: mapStage(statusRaw, committee || undefined),
        author,
        age: introduced ? `Introduced ${introduced}` : 'recent',
        conversations: 0,
        ministry: ministry || undefined,
        introducedDate: introduced || undefined,
        loksabhaId: billNo,
        sourceUrl: isRS ? 'https://sansad.in/rs/legislation/bills' : 'https://sansad.in/ls/legislation/bills',
      });
      return true;
    });

    return { fetched, message: `Synced ${fetched}/${bills.length} bills from GitHub data cache` };
  },
});

export const fetchAndStoreMembers = action({
  args: {},
  handler: async (ctx) => {
    let members: Record<string, unknown>[] = [];
    try {
      const res = await fetch(`${RAW_BASE}/members.json`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`GitHub raw HTTP ${res.status}`);
      const json = await res.json() as { Members?: Record<string, unknown>[] };
      members = json.Members ?? [];
    } catch (e) {
      return { fetched: 0, message: `GitHub fetch failed: ${e}` };
    }

    if (members.length === 0) return { fetched: 0, message: 'members.json is empty — check the fetch-bills workflow' };
    const fetched = await inBatches(members, async (member) => {
      const name = pick(member, ['MemberName', 'Name', 'MPName']);
      if (!name) return false;
      const state = pick(member, ['State', 'StateName']);
      await ctx.runMutation(api.ingestion.upserts.upsertContributor, {
        handle: slugify(name),
        name,
        role: pick(member, ['Designation']) || 'MP',
        party: pick(member, ['Party', 'PartyName']) || 'Independent',
        house: 'Lok Sabha',
        constituency: pick(member, ['Constituency', 'ConstituencyName']) || undefined,
        state: state ? slugify(state) : undefined,
        loksabhaId: pick(member, ['MemberID', 'MemberId', 'MPCode']) || undefined,
      });
      return true;
    });
    return { fetched, message: `Synced ${fetched} members from GitHub data cache` };
  },
});
