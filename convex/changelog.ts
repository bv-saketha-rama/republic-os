import { query } from './_generated/server';
import { v } from 'convex/values';

export const getChangelog = query({
  args: {
    stateId: v.optional(v.string()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  },
  handler: async (ctx, { stateId, year, month }) => {
    let entries = stateId
      ? await ctx.db.query('changelog').withIndex('by_state', (q) => q.eq('stateId', stateId)).collect()
      : await ctx.db.query('changelog').collect();

    if (year) entries = entries.filter((e) => e.year === year);
    if (month) entries = entries.filter((e) => e.month === month);

    return entries.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0));
  },
});
