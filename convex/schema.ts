import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  states: defineTable({
    id: v.string(),
    name: v.string(),
    maintainer: v.string(),
    party: v.string(),
    mandateExpires: v.string(),
    open: v.number(),
    prs: v.number(),
    acts: v.number(),
    lastMerged: v.string(),
    lastTitle: v.string(),
    health: v.union(v.literal('healthy'), v.literal('amber'), v.literal('critical')),
    resolveRate: v.number(),
    // extended fields
    capital: v.optional(v.string()),
    population: v.optional(v.string()),
    gdp: v.optional(v.string()),
    cmHandle: v.optional(v.string()),
    assemblySeats: v.optional(v.number()),
    sourceUrl: v.optional(v.string()),
    lastSynced: v.optional(v.string()),
  }).index('by_custom_id', ['id']),

  pullRequests: defineTable({
    id: v.string(),
    state: v.optional(v.string()),
    status: v.string(),
    labels: v.array(v.string()),
    title: v.string(),
    author: v.string(),
    age: v.string(),
    stage: v.string(),
    conversations: v.number(),
    gazette: v.optional(v.string()),
    // extended fields
    loksabhaId: v.optional(v.string()),
    rajyasabhaId: v.optional(v.string()),
    ministry: v.optional(v.string()),
    committeeReport: v.optional(v.string()),
    gazetteUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    voteAyeLS: v.optional(v.number()),
    voteNoLS: v.optional(v.number()),
    voteAbstainLS: v.optional(v.number()),
    voteAyeRS: v.optional(v.number()),
    voteNoRS: v.optional(v.number()),
    voteAbstainRS: v.optional(v.number()),
    introducedDate: v.optional(v.string()),
    passedDate: v.optional(v.string()),
    assentDate: v.optional(v.string()),
    summary: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
    loksabhaSession: v.optional(v.string()),
  }).index('by_custom_id', ['id'])
    .index('by_state', ['state'])
    .index('by_status', ['status'])
    .index('by_year', ['year'])
    .searchIndex('search_title', { searchField: 'title', filterFields: ['state', 'status'] }),

  issues: defineTable({
    id: v.number(),
    state: v.string(),
    status: v.union(v.literal('open'), v.literal('closed')),
    labels: v.array(v.string()),
    title: v.string(),
    author: v.string(),
    session: v.number(),
    sessionsOpen: v.number(),
    stale: v.boolean(),
    comments: v.number(),
    lastActivity: v.string(),
    // extended fields
    source: v.optional(v.string()),
    ministryRef: v.optional(v.string()),
    description: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  }).index('by_custom_id', ['id'])
    .index('by_state', ['state'])
    .index('by_status', ['status'])
    .searchIndex('search_title', { searchField: 'title', filterFields: ['state', 'status'] }),

  releases: defineTable({
    tag: v.string(),
    latest: v.boolean(),
    title: v.string(),
    date: v.string(),
    pr: v.string(),
    assets: v.number(),
    notes: v.string(),
    yanked: v.boolean(),
    yankReason: v.optional(v.string()),
    ordinance: v.boolean(),
    expiresIn: v.optional(v.string()),
    // extended fields
    gazetteNo: v.optional(v.string()),
    gazetteUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    state: v.optional(v.string()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  }).index('by_tag', ['tag'])
    .index('by_year', ['year']),

  contributors: defineTable({
    handle: v.string(),
    name: v.string(),
    role: v.string(),
    party: v.string(),
    orgs: v.array(v.string()),
    house: v.string(),
    affidavit: v.string(),
    stats: v.object({
      opened: v.number(),
      merged: v.number(),
      closed: v.number(),
      mergeRate: v.number(),
      issuesRaised: v.number(),
      reviewsGiven: v.number(),
    }),
    bio: v.string(),
    // extended fields
    constituency: v.optional(v.string()),
    state: v.optional(v.string()),
    elected: v.optional(v.string()),
    tenure: v.optional(v.string()),
    affidavitUrl: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    loksabhaId: v.optional(v.string()),
  }).index('by_handle', ['handle']),

  changelog: defineTable({
    session: v.string(),
    range: v.string(),
    stateId: v.optional(v.string()),
    sections: v.record(
      v.string(),
      v.array(
        v.object({
          text: v.string(),
          ref: v.optional(v.string()),
          kind: v.optional(v.union(v.literal('pr'), v.literal('issue'))),
          refLabel: v.optional(v.string()),
        })
      )
    ),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  }).index('by_session', ['session'])
    .index('by_state', ['stateId'])
    .index('by_year', ['year']),

  discussions: defineTable({
    id: v.string(),
    stateId: v.optional(v.string()),
    category: v.string(),
    title: v.string(),
    author: v.string(),
    body: v.optional(v.string()),
    replies: v.number(),
    views: v.number(),
    lastActivity: v.string(),
    pinned: v.optional(v.boolean()),
    answered: v.optional(v.boolean()),
    sourceUrl: v.optional(v.string()),
  }).index('by_custom_id', ['id'])
    .index('by_state', ['stateId']),

  wiki: defineTable({
    stateId: v.optional(v.string()),
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    lastUpdated: v.string(),
    author: v.string(),
  }).index('by_state_slug', ['stateId', 'slug']),

  stats: defineTable({
    key: v.string(),
    value: v.number(),
    label: v.optional(v.string()),
    updatedAt: v.string(),
  }).index('by_key', ['key']),
});
