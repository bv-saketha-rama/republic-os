// Shared upsert mutations used by ingestion actions
import { mutation } from '../_generated/server';
import { v } from 'convex/values';

// Parse a date-ish string ("2025-08-11", "11/08/2025", "November 2026") into year + month (1-12).
function yearMonth(input?: string): { year?: number; month?: number } {
  if (!input) return {};
  let d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    const m = input.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/); // DD/MM/YYYY
    if (m) d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    else d = new Date(`1 ${input}`); // "November 2026"
  }
  if (Number.isNaN(d.getTime())) return {};
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export const upsertPR = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    status: v.string(),
    labels: v.array(v.string()),
    stage: v.string(),
    author: v.string(),
    age: v.string(),
    conversations: v.number(),
    gazette: v.optional(v.string()),
    state: v.optional(v.string()),
    ministry: v.optional(v.string()),
    introducedDate: v.optional(v.string()),
    loksabhaId: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('pullRequests').withIndex('by_custom_id', (q) => q.eq('id', args.id)).first();
    const ym = yearMonth(args.introducedDate);
    if (existing) {
      // Update every mutable field; never overwrite with undefined.
      const patch: Record<string, unknown> = {
        title: args.title,
        status: args.status,
        stage: args.stage,
        conversations: args.conversations,
        labels: args.labels,
        author: args.author,
        age: args.age,
      };
      for (const k of ['gazette', 'state', 'ministry', 'introducedDate', 'loksabhaId', 'sourceUrl', 'summary'] as const) {
        if (args[k] !== undefined) patch[k] = args[k];
      }
      if (ym.year !== undefined) { patch.year = ym.year; patch.month = ym.month; }
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert('pullRequests', { ...args, ...ym });
    }
  },
});

export const upsertContributor = mutation({
  args: {
    handle: v.string(),
    name: v.string(),
    role: v.string(),
    party: v.string(),
    house: v.string(),
    constituency: v.optional(v.string()),
    state: v.optional(v.string()),
    loksabhaId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('contributors').withIndex('by_handle', (q) => q.eq('handle', args.handle)).first();
    if (!existing) {
      await ctx.db.insert('contributors', {
        ...args,
        orgs: [],
        affidavit: 'Affidavit data not yet available',
        stats: { opened: 0, merged: 0, closed: 0, mergeRate: 0, issuesRaised: 0, reviewsGiven: 0 },
        bio: `${args.role} · ${args.party} · ${args.house}`,
      });
    } else {
      await ctx.db.patch(existing._id, {
        name: args.name,
        role: args.role,
        party: args.party,
        house: args.house,
        constituency: args.constituency ?? existing.constituency,
        state: args.state ?? existing.state,
      });
    }
  },
});

export const upsertChangelog = mutation({
  args: {
    session: v.string(),
    range: v.string(),
    stateId: v.optional(v.string()),
    sections: v.record(
      v.string(),
      v.array(v.object({
        text: v.string(),
        ref: v.optional(v.string()),
        kind: v.optional(v.union(v.literal('pr'), v.literal('issue'))),
        refLabel: v.optional(v.string()),
      }))
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('changelog').withIndex('by_session', (q) => q.eq('session', args.session)).first();
    if (existing) {
      // Merge new items into existing sections
      const merged = { ...existing.sections };
      for (const [cat, items] of Object.entries(args.sections)) {
        if (!merged[cat]) merged[cat] = [];
        const existingTexts = new Set(merged[cat].map((i) => i.text));
        for (const item of items) {
          if (!existingTexts.has(item.text)) merged[cat].push(item);
        }
      }
      await ctx.db.patch(existing._id, { sections: merged, ...yearMonth(args.session) });
    } else {
      await ctx.db.insert('changelog', { ...args, ...yearMonth(args.session) });
    }
  },
});
export const upsertArticle = mutation({
  args: {
    id: v.optional(v.string()),
    url: v.string(),
    title: v.string(),
    outlet: v.string(),
    sourceKind: v.union(v.literal('official'), v.literal('primary'), v.literal('reported')),
    publishedAt: v.optional(v.string()),
    fetchedAt: v.string(),
    excerpt: v.optional(v.string()),
    stateId: v.optional(v.string()),
    relationKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.url.startsWith('https://')) throw new Error('Article URL must use HTTPS');
    const existing = await ctx.db.query('articles').withIndex('by_url', (q) => q.eq('url', args.url)).first();
    const fields = {
      url: args.url,
      title: args.title,
      outlet: args.outlet,
      sourceKind: args.sourceKind,
      publishedAt: args.publishedAt,
      fetchedAt: args.fetchedAt,
      excerpt: args.excerpt,
      stateId: args.stateId,
      relationKey: args.relationKey,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return existing.id;
    }
    const id = args.id ?? `article:${args.url}`;
    await ctx.db.insert('articles', { id, ...fields });
    return id;
  },
});
