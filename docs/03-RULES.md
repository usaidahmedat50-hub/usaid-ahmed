# PakevFinder.com — Build Rules

These are binding rules for whoever (human or AI agent) writes code on this project. If a request conflicts with a rule below, flag the conflict instead of silently picking one side.

## 1. Data Integrity Rules

1. **Never invent a spec, price, or fact.** If a number isn't sourced, the field must be left empty — never filled with a plausible-looking placeholder.
2. **A vehicle isn't ready to publish just because a row exists in the database.** Before a vehicle goes live, it needs a real minimum data set — battery capacity, range, motor output, at least one charging speed figure, and ex-factory price — actually sourced, not a row of mostly-empty fields with "Not Disclosed" everywhere. A shorter published catalog with complete entries beats a longer one that looks unfinished; if a vehicle can't clear that bar yet, keep it in a draft/unpublished state rather than shipping it half-empty. See `04-DESIGN.md` §4 for how the UI should handle any field that's still genuinely unknown.
3. Price changes are logged as new rows in `vehicle_prices`, never as an `UPDATE` on an existing row. History must be preservable.
4. **Catalog scope vs. data source are different things.** It's fine to use a competitor's public model lineup as a checklist of *which vehicles exist in the market* (that's a fact, not their IP) — see the target catalog in `01-PRD.md` §5b. It is **not** fine to copy a competitor's specific published range/price/spec numbers into PakevFinder wholesale — source them independently (manufacturer press release, official distributor tariff, etc.) before publishing.
5. Same rule applies to charging-station data: build the `charging_stations` table from independent sources (operator sites, community submissions) — do not bulk-copy a competitor's station list, especially where their own Terms explicitly reserve that dataset against extraction.
6. **Never invent a physical address, phone number, or business registration detail.** Until there's a real one, leave it out of the footer, Terms, and Contact pages rather than filling in a placeholder that looks real — a fabricated address is a legal/trust problem, not a cosmetic gap.

## 2. Supabase / Backend Rules

1. `SUPABASE_SERVICE_ROLE_KEY` must never appear in any client bundle, `NEXT_PUBLIC_*` env var, or be logged to the browser console. Server-only usage (Route Handlers, server actions, scripts) only.
2. Row Level Security must be **enabled on every table**, with explicit policies — no table should ever be left with RLS disabled "temporarily."
3. Public roles get `SELECT` only. All `INSERT`/`UPDATE`/`DELETE` requires an authenticated role with an explicit `editor`/`admin` check, never just "authenticated."
4. Schema changes go through versioned SQL migration files (Supabase CLI migrations), not ad-hoc changes made only in the Studio UI, so the schema is reproducible and reviewable.
5. Do not run destructive migrations (`DROP TABLE`, `DROP COLUMN`, data-deleting `UPDATE`/`DELETE`) without an explicit, separate confirmation step — never bundle a destructive migration silently inside a feature change.

## 3. Frontend / Code Rules

1. TypeScript strict mode on. No `any` unless justified with a comment explaining why it's unavoidable.
2. Server Components by default; add `"use client"` only when the component needs interactivity, state, or browser APIs.
3. No client-side data fetching for content that could be server-rendered — this project's SEO/AEO strategy depends on real HTML being present at first paint.
4. Every vehicle/comparison page must render its core facts (name, key specs, price) in server-rendered markup — do not gate primary content behind a client-side loading spinner.
5. Reuse the shared component library / design tokens defined in `04-DESIGN.md` rather than one-off styling per page.
6. Keep the key/value `vehicle_specs` query logic centralized (one data-access layer, e.g. `lib/vehicles.ts`), not duplicated across pages — the pivot-to-typed-object logic should exist once.

## 4. Content & Editorial Rules

1. Articles/guides must be factually reviewed before publish — no auto-generated content published without a human check, especially anything involving prices, taxes, or duties (these are legally sensitive and change with policy).
2. Any claim about competitors (including PakNEV) must be factual and non-disparaging; do not publish comparative marketing that could be considered misleading advertising.
3. Disclaimer/Terms language must clarify: (a) prices are estimates and subject to change, (b) PakevFinder is not a dealer and does not guarantee third-party pricing, (c) on-road price estimates include stated assumptions (duties/taxes) that can change with policy.

## 5. Workflow / Process Rules

1. Feature work happens on branches; `main` is always deployable.
2. Any schema change ships with its migration file in the same commit/PR as the code that depends on it.

## 6. Things the Agent Should Never Do Unprompted

- Never disable RLS "to make it easier to test."
- Never seed the production database with placeholder/fake vehicles that look real (e.g., a fake "Tesla Model 5") — use obviously-fake seed data (e.g., "Test Vehicle Alpha") in dev/staging only.
- Never scrape a competitor's site (including PakNEV) to source PakevFinder's data. Use manufacturer/distributor primary sources.
