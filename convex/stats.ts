import { query } from './_generated/server';

export const getNationalStats = query({
  args: {},
  handler: async (ctx) => {
    const countStatus = async (table: 'pullRequests' | 'issues', status: string) =>
      (await ctx.db.query(table).withIndex('by_status', (q) => q.eq('status', status)).collect()).length;

    const [open, inReview, draft, openIssues, merged, recentArticles] = await Promise.all([
      countStatus('pullRequests', 'open'),
      countStatus('pullRequests', 'in-review'),
      countStatus('pullRequests', 'draft'),
      countStatus('issues', 'open'),
      ctx.db.query('pullRequests').withIndex('by_status', (q) => q.eq('status', 'merged')).collect(),
      ctx.db.query('articles').order('desc').take(50),
    ]);

    // "Last merged" = most recently introduced merged bill by year/month, not insertion order.
    const lastMerged = [...merged].sort(
      (a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0) || b._creationTime - a._creationTime
    )[0];
    const newestFetchedAt = recentArticles.reduce<string | null>(
      (best, art) => (best === null || art.fetchedAt > best ? art.fetchedAt : best),
      null
    );
    return {
      openBills: open + inReview + draft,
      openIssues,
      lastMergedTitle: lastMerged?.title ?? null,
      lastMergedAge: lastMerged?.age ?? null,
      newestArticleFetchedAt: newestFetchedAt,
    };
  },
});
