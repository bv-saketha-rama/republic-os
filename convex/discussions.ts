import { query } from './_generated/server';
import { v } from 'convex/values';

export const getDiscussions = query({
  args: { stateId: v.optional(v.string()) },
  handler: async (ctx, { stateId }) => {
    if (stateId) {
      return await ctx.db.query('discussions').withIndex('by_state', (q) => q.eq('stateId', stateId)).collect();
    }
    return await ctx.db.query('discussions').collect();
  },
});
