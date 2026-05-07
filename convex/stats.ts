import { query } from './_generated/server';

export const getNationalStats = query({
  args: {},
  handler: async (ctx) => {
    const [openPRs, mergedPRs, openIssues] = await Promise.all([
      ctx.db.query('pullRequests').filter((q) =>
        q.or(q.eq(q.field('status'), 'open'), q.eq(q.field('status'), 'in-review'), q.eq(q.field('status'), 'draft'))
      ).collect(),
      ctx.db.query('pullRequests').filter((q) =>
        q.eq(q.field('status'), 'merged')
      ).order('desc').take(1),
      ctx.db.query('issues').filter((q) => q.eq(q.field('status'), 'open')).collect(),
    ]);

    const lastMerged = mergedPRs[0];
    return {
      openBills: openPRs.length,
      openIssues: openIssues.length,
      lastMergedTitle: lastMerged?.title ?? null,
      lastMergedAge: lastMerged?.age ?? null,
    };
  },
});
