import { query } from './_generated/server';
import { v } from 'convex/values';

export const getIssues = query({
  args: {
    stateId: v.optional(v.string()),
    status: v.optional(v.string()),
    label: v.optional(v.string()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  },
  handler: async (ctx, { stateId, status, label, year, month }) => {
    let issues = stateId && stateId !== 'IN'
      ? await ctx.db.query('issues').withIndex('by_state', (q) => q.eq('state', stateId)).collect()
      : await ctx.db.query('issues').collect();

    if (status && status !== 'all') issues = issues.filter((i) => i.status === status);
    if (label) issues = issues.filter((i) => i.labels.includes(label));
    if (year) issues = issues.filter((i) => i.year === year);
    if (month) issues = issues.filter((i) => i.month === month);

    return issues.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0));
  },
});

export const getIssueById = query({
  args: { id: v.number() },
  handler: async (ctx, { id }) => {
    return await ctx.db.query('issues').withIndex('by_custom_id', (q) => q.eq('id', id)).first() ?? null;
  },
});
