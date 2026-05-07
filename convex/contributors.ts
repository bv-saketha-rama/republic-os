import { query } from './_generated/server';
import { v } from 'convex/values';

export const getContributorByHandle = query({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    return await ctx.db.query('contributors').withIndex('by_handle', (q) => q.eq('handle', handle)).first() ?? null;
  },
});

export const getContributors = query({
  args: { state: v.optional(v.string()), party: v.optional(v.string()) },
  handler: async (ctx, { state, party }) => {
    let contributors = await ctx.db.query('contributors').collect();
    if (state) contributors = contributors.filter((c) => c.state === state);
    if (party) contributors = contributors.filter((c) => c.party === party);
    return contributors;
  },
});
