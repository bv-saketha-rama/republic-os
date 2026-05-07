import { query } from './_generated/server';
import { v } from 'convex/values';

export const getPRs = query({
  args: {
    stateId: v.optional(v.string()),
    status: v.optional(v.string()),
    ministry: v.optional(v.string()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  },
  handler: async (ctx, { stateId, status, ministry, year, month }) => {
    let prs = stateId
      ? await ctx.db.query('pullRequests').withIndex('by_state', (q) => q.eq('state', stateId)).collect()
      : await ctx.db.query('pullRequests').collect();

    if (status && status !== 'all') prs = prs.filter((p) => p.status === status);
    if (ministry) prs = prs.filter((p) => p.ministry === ministry || p.labels.includes(ministry));
    if (year) prs = prs.filter((p) => p.year === year);
    if (month) prs = prs.filter((p) => p.month === month);

    return prs.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0));
  },
});

export const getPRById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db.query('pullRequests').withIndex('by_custom_id', (q) => q.eq('id', id)).first() ?? null;
  },
});

export const getPRYears = query({
  args: { stateId: v.optional(v.string()) },
  handler: async (ctx, { stateId }) => {
    const prs = stateId
      ? await ctx.db.query('pullRequests').withIndex('by_state', (q) => q.eq('state', stateId)).collect()
      : await ctx.db.query('pullRequests').collect();
    const years = [...new Set(prs.map((p) => p.year).filter(Boolean) as number[])].sort((a, b) => b - a);
    return years;
  },
});
