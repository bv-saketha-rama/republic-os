import { action } from '../_generated/server';
import { api } from '../_generated/api';

const PIB_RSS = 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3';

function categoryFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('launch') || t.includes('introduces') || t.includes('new scheme') || t.includes('inaugurate')) return 'Added';
  if (t.includes('amend') || t.includes('revise') || t.includes('modify') || t.includes('update')) return 'Changed';
  if (t.includes('repeal') || t.includes('withdraw') || t.includes('discontinue') || t.includes('abolish')) return 'Removed';
  if (t.includes('security') || t.includes('cyber') || t.includes('cag') || t.includes('audit')) return 'Security';
  if (t.includes('fix') || t.includes('correction') || t.includes('corrigendum') || t.includes('clarif')) return 'Fixed';
  return 'Added';
}

interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
}

function parseRSSItems(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const block = match[1];
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ?? block.match(/<title>(.*?)<\/title>/)?.[1] ?? '';
    const link = block.match(/<link>(.*?)<\/link>/)?.[1] ?? '';
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? '';
    items.push({ title: title.trim(), link: link.trim(), pubDate: pubDate.trim() });
  }
  return items;
}

export const fetchAndStoreReleases = action({
  args: {},
  handler: async (ctx) => {
    let fetched = 0;
    let items: RSSItem[] = [];

    try {
      const res = await fetch(PIB_RSS, { headers: { Accept: 'application/rss+xml, application/xml, text/xml' } });
      if (res.ok) {
        const xml = await res.text();
        items = parseRSSItems(xml);
      }
    } catch (e) {
      console.error('PIB RSS error:', e);
      return { fetched: 0, message: 'PIB RSS unavailable' };
    }

    // Group into sessions by month
    const byMonth: Record<string, { text: string; ref?: string; kind?: 'pr' | 'issue' }[]> = {};

    for (const item of items.slice(0, 30)) {
      if (!item.title) continue;
      const date = item.pubDate ? new Date(item.pubDate) : new Date();
      const sessionKey = date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
      if (!byMonth[sessionKey]) byMonth[sessionKey] = [];

      byMonth[sessionKey].push({
        text: item.title,
        ref: item.link ?? undefined,
      });
      fetched++;
    }

    // Upsert as changelog entries
    for (const [session, items] of Object.entries(byMonth)) {
      const sections: Record<string, { text: string; ref?: string; kind?: 'pr' | 'issue'; refLabel?: string }[]> = {};
      for (const item of items) {
        const cat = categoryFromTitle(item.text);
        if (!sections[cat]) sections[cat] = [];
        sections[cat].push({ text: item.text, ref: item.ref });
      }
      await ctx.runMutation(api.ingestion.upserts.upsertChangelog, {
        session,
        range: session,
        stateId: undefined,
        sections,
      });
    }

    return { fetched, message: `Fetched ${fetched} PIB releases` };
  },
});
