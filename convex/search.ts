import { query } from './_generated/server';
import { v } from 'convex/values';

export const searchAll = query({
  args: { q: v.string() },
  handler: async (ctx, { q }) => {
    if (!q.trim()) return { prs: [], issues: [] };

    const [prs, issues] = await Promise.all([
      ctx.db.query('pullRequests').withSearchIndex('search_title', (s) => s.search('title', q)).take(8),
      ctx.db.query('issues').withSearchIndex('search_title', (s) => s.search('title', q)).take(8),
    ]);

    return { prs, issues };
  },
});
