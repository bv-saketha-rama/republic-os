import { query } from './_generated/server';
import { v } from 'convex/values';

export const getWikiPages = query({
  args: { stateId: v.optional(v.string()) },
  handler: async (ctx, { stateId }) => {
    return await ctx.db.query('wiki').filter((q) => q.eq(q.field('stateId'), stateId)).collect();
  },
});

export const getWikiPage = query({
  args: { stateId: v.optional(v.string()), slug: v.string() },
  handler: async (ctx, { stateId, slug }) => {
    return await ctx.db.query('wiki')
      .withIndex('by_state_slug', (q) => q.eq('stateId', stateId).eq('slug', slug))
      .first() ?? null;
  },
});
