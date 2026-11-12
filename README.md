# RepublicOS

India's governance layer, presented with a GitHub metaphor: states are repositories, bills are pull requests, parliamentary questions are issues.

Stack: Vite + React + TypeScript + Tailwind, with [Convex](https://convex.dev) as the backend.

## Setup

```bash
pnpm install
npx convex dev          # creates the deployment and writes VITE_CONVEX_URL to .env.local
pnpm dev                # in another terminal
```

First run only: open the Convex dashboard, run `seed:seedAll` to load the demo dataset (**fictional** states, issues, wiki). It refuses to run if ingested data exists; pass `{"force": true}` to wipe and reseed.

## Data pipeline

| Source | How | Where it lands |
|---|---|---|
| Lok Sabha / Rajya Sabha bills and members | `.github/workflows/fetch-bills.yml` (daily) commits `data/bills.json` and `data/members.json`; the Convex crons in `convex/crons.ts` read them from GitHub raw | `pullRequests`, `contributors` |
| PIB press releases | Convex cron reads the PIB RSS feed directly | `articles`, `changelog` |

Convex env var `GITHUB_REPO` (default `bv-saketha-rama/republic-os`) selects which repo the crons read from.

The workflow now **fails** if the API returns nothing, so a red run means the upstream API or its response shape changed. The field-name mapping in `convex/ingestion/loksabha.ts` accepts several name variants but has not been verified against a live response; check the first successful run's `data/bills.json`.

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm typecheck` checks both `src/` and `convex/`
