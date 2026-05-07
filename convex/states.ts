import { query } from './_generated/server';
import { v } from 'convex/values';

export const getStates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('states').collect();
  },
});

export const getStateById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const results = await ctx.db.query('states').withIndex('by_custom_id', (q) => q.eq('id', id)).first();
    return results ?? null;
  },
});
