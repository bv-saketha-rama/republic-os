import { query } from './_generated/server';
import { v } from 'convex/values';

export const getReleases = query({
  args: {
    stateId: v.optional(v.string()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  },
  handler: async (ctx, { stateId, year, month }) => {
    let releases = stateId
      ? await ctx.db.query('releases').filter((q) => q.eq(q.field('state'), stateId)).collect()
      : await ctx.db.query('releases').collect();

    if (year) releases = releases.filter((r) => r.year === year);
    if (month) releases = releases.filter((r) => r.month === month);

    return releases.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0));
  },
});
