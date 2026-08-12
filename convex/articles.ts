import { query } from './_generated/server';
import { v } from 'convex/values';

const articleArgs = {
  stateId: v.optional(v.string()),
  sourceKind: v.optional(v.union(v.literal('official'), v.literal('primary'), v.literal('reported'))),
  relationKey: v.optional(v.string()),
};

function newestFirst<T extends { publishedAt?: string; fetchedAt: string }>(articles: T[]) {
  return articles.sort((a, b) =>
    (b.publishedAt ?? b.fetchedAt).localeCompare(a.publishedAt ?? a.fetchedAt) || b.fetchedAt.localeCompare(a.fetchedAt)
  );
}

export const getArticles = query({
  args: articleArgs,
  handler: async (ctx, { stateId, sourceKind, relationKey }) => {
    let articles = await ctx.db.query('articles').collect();
    articles = stateId
      ? articles.filter((article) => article.stateId === stateId || article.stateId === undefined)
      : articles.filter((article) => article.stateId === undefined);
    if (sourceKind) articles = articles.filter((article) => article.sourceKind === sourceKind);
    if (relationKey) articles = articles.filter((article) => article.relationKey === relationKey);
    return newestFirst(articles);
  },
});

export const getArticlesByRelation = query({
  args: { relationKey: v.string() },
  handler: async (ctx, { relationKey }) => {
    const articles = await ctx.db.query('articles').withIndex('by_relation', (q) => q.eq('relationKey', relationKey)).collect();
    return newestFirst(articles);
  },
});
