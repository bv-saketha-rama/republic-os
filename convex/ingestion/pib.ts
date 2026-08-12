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

function decodeText(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code: string) => {
      const base = code[0].toLowerCase() === 'x' ? 16 : 10;
      const parsed = Number.parseInt(base === 16 ? code.slice(1) : code, base);
      return Number.isNaN(parsed) ? '' : String.fromCodePoint(parsed);
    })
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function field(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decodeText(match[1]) : '';
}

function parseRSSItems(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  for (const match of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const block = match[1];
    items.push({
      title: field(block, 'title'),
      link: field(block, 'link'),
      pubDate: field(block, 'pubDate'),
      description: field(block, 'description'),
    });
  }
  return items;
}

function publicationDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export const fetchAndStoreReleases = action({
  args: {},
  handler: async (ctx) => {
    const fetchedAt = new Date().toISOString();
    let xml: string;
    try {
      const res = await fetch(PIB_RSS, { headers: { Accept: 'application/rss+xml, application/xml, text/xml' } });
      if (!res.ok) return { fetched: 0, skipped: 0, fetchedAt: null, message: `PIB RSS unavailable (${res.status})` };
      xml = await res.text();
    } catch (e) {
      console.error('PIB RSS error:', e);
      return { fetched: 0, skipped: 0, fetchedAt: null, message: 'PIB RSS unavailable' };
    }

    let items: RSSItem[];
    try {
      items = parseRSSItems(xml).slice(0, 30);
    } catch (e) {
      console.error('PIB RSS parse error:', e);
      return { fetched: 0, skipped: 0, fetchedAt: null, message: 'PIB RSS could not be parsed' };
    }

    const accepted = items.filter((item) => Boolean(item.title && item.link?.startsWith('https://')));
    const skipped = items.length - accepted.length;
    const byMonth: Record<string, { text: string }[]> = {};

    for (const item of accepted) {
      const title = item.title!;
      const url = item.link!;
      await ctx.runMutation(api.ingestion.upserts.upsertArticle, {
        url,
        title,
        outlet: 'Press Information Bureau',
        sourceKind: 'official',
        publishedAt: publicationDate(item.pubDate),
        fetchedAt,
        excerpt: item.description || undefined,
      });

      const date = item.pubDate ? new Date(item.pubDate) : new Date(fetchedAt);
      const sessionKey = Number.isNaN(date.getTime())
        ? new Date(fetchedAt).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
        : date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
      if (!byMonth[sessionKey]) byMonth[sessionKey] = [];
      byMonth[sessionKey].push({ text: title });
    }

    for (const [session, monthItems] of Object.entries(byMonth)) {
      const sections: Record<string, { text: string }[]> = {};
      for (const item of monthItems) {
        const cat = categoryFromTitle(item.text);
        if (!sections[cat]) sections[cat] = [];
        sections[cat].push(item);
      }
      await ctx.runMutation(api.ingestion.upserts.upsertChangelog, {
        session,
        range: session,
        stateId: undefined,
        sections,
      });
    }

    return {
      fetched: accepted.length,
      skipped,
      fetchedAt,
      message: `Fetched ${accepted.length} PIB releases; skipped ${skipped}`,
    };
  },
});
