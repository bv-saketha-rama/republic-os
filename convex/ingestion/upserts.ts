// Shared upsert mutations used by ingestion actions
import { mutation } from '../_generated/server';
import { v } from 'convex/values';

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
    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        stage: args.stage,
        conversations: args.conversations,
        labels: args.labels,
      });
    } else {
      await ctx.db.insert('pullRequests', args);
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
        affidavit: 'Affidavit data loading…',
        stats: { opened: 0, merged: 0, closed: 0, mergeRate: 0, issuesRaised: 0, reviewsGiven: 0 },
        bio: `${args.role} · ${args.party} · ${args.house}`,
      });
    } else {
      await ctx.db.patch(existing._id, { role: args.role, party: args.party });
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
      await ctx.db.patch(existing._id, { sections: merged });
    } else {
      await ctx.db.insert('changelog', args);
    }
  },
});
