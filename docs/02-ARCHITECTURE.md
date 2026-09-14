# PakevFinder.com — Architecture Document

**Version:** 1.0
**Stack:** Next.js (App Router) + Supabase + Tailwind CSS + Vercel

---

## 1. High-Level Stack

- **Frontend/Framework:** Next.js 14+ (App Router), React Server Components by default, Client Components only where interactivity is required (compare selector, filters, calculators).
- **Styling:** Tailwind CSS, shared design tokens (see `04-DESIGN.md`).
- **Backend/Data:** Supabase (Postgres + Auth + Storage + Row Level Security). No separate custom backend server for Phase 1 — Next.js Server Components / Route Handlers talk to Supabase directly (service-role key only ever used server-side).
- **Hosting:** Vercel (Next.js native ISR/SSG support) — or any Node host if Vercel is not preferred, but ISR strategy assumes edge/CDN caching.
- **Images:** Supabase Storage (or a CDN-fronted bucket) for vehicle images; `next/image` for optimization.
- **Search:** Postgres full-text search (`tsvector`) to start — no need for Algolia/Meilisearch at this catalog size.
- **Routing + geocoding:** OpenRouteService free tier for both — it has its own geocoding endpoint (built on OpenStreetMap data) alongside routing, so one provider/API key covers the whole route planner rather than needing a separate geocoder.
- **Charging station seed data:** Open Charge Map (a free, open, community-sourced global EV charging database) as a possible seed source for `charging_stations`, on top of your own research and community submissions — check its Pakistan coverage and its attribution requirements (typically ODbL-style) before importing.

## 2. Why This Stack

- Supabase gives Postgres (relational integrity matters here — price history, brand/category relationships are relational, not document-shaped), Auth (for a future admin/editor login), and Storage in one place with generous free tier — matches solo-founder budget constraints.
- Next.js App Router lets vehicle/compare pages be statically generated or ISR'd, which is critical for the SEO/AEO strategy in the PRD — static HTML with JSON-LD is what search and AI crawlers reward.

## 3. Core Data Model (Supabase / Postgres)

```
brands
  id (uuid, pk)
  name (text)
  slug (text, unique)
  logo_url (text)
  country (text)
  created_at

vehicles
  id (uuid, pk)
  brand_id (fk -> brands.id)
  name (text)
  slug (text, unique)
  body_type (enum: sedan, suv, hatchback, pickup, microcar)
  powertrain (enum: bev, phev, reev, hev)
  status (enum: available, upcoming, discontinued)
  hero_image_url (text)
  summary (text)          -- short AEO direct-answer blurb
  created_at, updated_at

vehicle_specs
  id (uuid, pk)
  vehicle_id (fk -> vehicles.id)
  spec_key (text)          -- e.g. 'wltp_range_km', 'battery_kwh', 'dc_fast_charge_kw', 'seats'
  spec_value (text)        -- store as text, cast in app layer; keeps schema flexible per powertrain type
  unit (text)
  source_url (text, nullable)  -- optional, for your own reference when entering data
  updated_at (timestamptz)

vehicle_prices
  id (uuid, pk)
  vehicle_id (fk -> vehicles.id)
  price_type (enum: ex_factory, on_road_estimate)
  amount_pkr (numeric)
  effective_date (date)     -- append-only log, never overwritten
  source_url (text, nullable)
  created_at

categories
  id (uuid, pk)
  name (text)
  slug (text, unique)
  -- vehicles can be tagged into categories via a join table if many-to-many is needed

vehicle_categories (join table, if needed)
  vehicle_id (fk)
  category_id (fk)

articles
  id (uuid, pk)
  title, slug, body (markdown or rich text), excerpt
  published_at
  author (text)

comparisons (optional — can be computed on the fly instead of stored)
  id (uuid, pk)
  vehicle_a_id (fk), vehicle_b_id (fk)
  slug (text, unique)       -- e.g. byd-seal-vs-tesla-model-3, for canonical SEO URLs

charging_stations
  id (uuid, pk)
  name (text)
  network_operator (text)          -- nullable; independent stations exist
  latitude, longitude (numeric)
  city (text)
  connector_types (text[])         -- e.g. {CCS2, Type2, GB/T}
  power_kw (numeric)
  status (enum: active, inactive)
  submitted_by (text, nullable)    -- for community submissions
  source_url (text, nullable)
  updated_at (timestamptz)
  created_at

charging_station_submissions (queue for community "Get Listed" style submissions before they're promoted into charging_stations)
  id (uuid, pk)
  submitted_data (jsonb)
  status (enum: pending, approved, rejected)
  submitter_contact (text, nullable)
  created_at
```

### Route planner data approach

Phase 1 does **not** need a routing engine or live traffic data. A useful v1, modeled on the kind of output a shopper actually needs (distance, duration, and which chargers sit along the way):

1. User types an origin and destination as free text; geocode both to coordinates via **OpenRouteService's geocoding endpoint** (same provider/key as the routing call below — no second geocoding service needed) — or lets them pick a vehicle (or enter its range directly).
2. Compute road distance and duration via OpenRouteService's routing endpoint (free for reasonable volumes, no card required, gives real road distance/duration — not straight-line). Wrap both calls behind a single internal module (e.g. `lib/routing.ts`) so swapping to a paid provider (Google/Mapbox Directions) later is a one-file change, not a rewrite, once usage or accuracy needs justify the cost.
3. Query `charging_stations` for stations near the route corridor, filtered by connector type compatible with the selected vehicle.
4. For each nearby station, compute: distance-from-start along the route, and an approximate detour time (extra time to leave the route, stop, and rejoin — even a rough estimate, clearly labeled, is more useful than omitting it).
5. Render the result as: a route summary (total distance, total driving time), then a list of chargers along the route ordered by distance-from-start, each showing operator/network, power rating (kW), and detour time. Flag whether the trip is feasible on the vehicle's range with zero stops, or how many stops are needed.
6. Optional, later: current weather at origin/destination via a free weather API (e.g. Open-Meteo, no key required), shown as light context (not a core planning input) — nice-to-have, not required for v1.

This keeps the feature honest — it should not imply real-time routing sophistication it doesn't have. Label it clearly as a planning aid. **Do not source the actual charger list by copying PakNEV's station data** — their Terms explicitly reserve their compiled charging-station database against bulk extraction/republishing. Build `charging_stations` from your own submissions, independently-sourced operator data (PSO, Attock Petroleum, Tesla Industries Pakistan, etc. often publish their own station lists), community submissions, and — worth checking — **Open Charge Map**, a free, open, community-sourced global EV charging database that may have Pakistan coverage; if you import from it, credit it per its license (typically ODbL-style attribution) the same way you'd credit any other independent source.

**Design note:** `vehicle_specs` as a key/value table (rather than dozens of nullable columns on `vehicles`) keeps the schema flexible across BEV/PHEV/REEV/Hybrid, which all have different relevant fields (a PHEV needs `electric_range_km` **and** `combined_range_km`; a BEV only needs the former). Trade-off: slightly more complex queries, mitigated by a Postgres view (`vehicle_full_spec_view`) that pivots the common fields for read paths.

## 4. Row Level Security (RLS)

- **Public read** on `vehicles`, `vehicle_specs`, `vehicle_prices`, `brands`, `categories`, `articles`, `charging_stations` — anonymous `select` allowed.
- **Public insert, restricted read** on `charging_station_submissions` — anyone can submit (their "Get Listed" style flow), but only editors can read/triage the queue; submissions never go live until promoted to `charging_stations` by an editor.
- **Writes restricted** to an authenticated `editor` role (Supabase Auth + a `profiles` table with a `role` column, checked in RLS policies). No public write access anywhere, ever.
- Service-role key is used only in server-side admin scripts/Route Handlers for data ingestion — never shipped to the client.

## 5. Rendering Strategy

- **Vehicle detail pages** (`/vehicles/[slug]`): Static Site Generation with `revalidate` (ISR) — e.g. revalidate every 12–24h, since specs/prices don't change minute-to-minute.
- **Compare pages** (`/compare/[slug-vs-slug]`): Pre-generate top N popular pairs at build time; generate the rest on-demand (`generateStaticParams` + fallback), cached via ISR after first hit.
- **Directory/listing pages** (`/vehicles`, `/brands/[slug]`): ISR with a short revalidate window (e.g. 1h) since new listings should appear reasonably fast.
- **Articles**: SSG, revalidate on publish (on-demand revalidation via a Supabase webhook → Next.js revalidate API route is a good Phase-1.5 addition).

## 6. SEO / AEO Architecture

- JSON-LD `Product`/`Vehicle` schema per vehicle page, including price, and a `Review`/`AggregateRating` block only if genuinely populated (never fabricate ratings).
- A short, extractable "direct answer" paragraph at the top of every vehicle and comparison page (this is what PakevFinder's homepage already does — keep it, and make sure it's server-rendered, not client-injected, so crawlers see it).
- Canonical URLs, sitemap.xml generated from the `vehicles`/`articles` tables at build/revalidate time.

## 7. Admin / Data-Entry Path (Phase 1, minimal)

Given solo-founder scale, avoid building a full custom admin panel initially:
- **Option A (fastest):** Use Supabase Studio's table editor directly for data entry, with a documented checklist (see `03-RULES.md`) for what fields are mandatory per new vehicle.
- **Option B (Phase 1.5):** A minimal internal-only Next.js route (`/admin`, gated by Supabase Auth + role check) with a form for adding a vehicle + specs + price entry, to reduce manual SQL/Studio errors as the catalog grows past ~15–20 vehicles.

## 8. Environments & Deployment

- `main` branch → production (Vercel), `develop`/feature branches → preview deployments.
- Supabase: one project is sufficient at this stage; a second Supabase project can be added later purely for local/dev seed data if the schema starts changing frequently.
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-safe), `SUPABASE_SERVICE_ROLE_KEY` (server-only, never `NEXT_PUBLIC_*`), `ORS_API_KEY` (OpenRouteService, server-only — routing calls should go through a Route Handler, not directly from the client, both to hide the key and to keep the provider swap in `lib/routing.ts` centralized).

## 9. Non-Functional Requirements

- Lighthouse performance ≥ 90 on vehicle/compare pages (static generation should make this straightforward).
- All pages usable without JavaScript for core content (progressive enhancement) — filters/compare selector can be client-side, but the underlying spec data must be in server-rendered HTML.
- No layout shift from late-loading images — set explicit width/height, use `next/image`.
