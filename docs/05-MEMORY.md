# PakevFinder.com — Agent Memory / Project Context

This file is meant to be kept in the repo root (or wherever the coding agent loads persistent context from) and re-read at the start of every build session, so the agent doesn't lose context between sessions. Update it as decisions change — treat it as living documentation, not a one-time brief.

## What this project is

PakevFinder.com is an EV (electric vehicle) specifications, pricing, and comparison directory for Pakistan. The founder is Usaid, building solo.

## Known competitor

**PakNEV.com** — more mature, broader catalog (~20+ vehicles), has a live charging-station map, route planner, "Find My Match" quiz, installer/home-charger marketplace, active social channels, and an app "coming soon." PakevFinder is working toward matching the charging map and route planner in Phase 1, and building out a comparable catalog over time (see target list in `01-PRD.md` §5b) — installer/home-host marketplace remains Phase 2. Do not scrape or copy PakNEV's data or copy.

## Stack decisions (do not silently change these)

- **Frontend:** Next.js, App Router, Server Components by default
- **Styling:** Tailwind CSS
- **Backend/DB:** Supabase (Postgres, Auth, Storage, RLS enforced on every table)
- **Routing & geocoding (route planner):** OpenRouteService free tier for both routing and geocoding (built on OpenStreetMap), wrapped in `lib/routing.ts` so switching to a paid provider later is a one-file change
- **Charging station seed data:** Independent sourcing + Open Charge Map (free, community-sourced global database) with ODbL attribution, alongside community submissions
- **Hosting assumption:** Vercel (or Node-compatible host with ISR support)
- Reference docs in this same doc set: `01-PRD.md`, `02-ARCHITECTURE.md`, `03-RULES.md`, `04-DESIGN.md` — always consistent with these; if a build decision needs to deviate from them, update the relevant doc in the same session rather than letting docs and code drift apart.

## Data model summary (see 02-ARCHITECTURE.md for full detail)

`brands`, `vehicles`, `vehicle_specs` (key/value, flexible per powertrain type), `vehicle_prices` (append-only price history), `categories`, `articles`, `charging_stations`, `charging_station_submissions`. No verification-status/badge system — specs carry an optional `source_url` for internal reference only, not shown as a trust badge in the UI.

## Standing rules the agent must always honor (full list in 03-RULES.md)

- Never fabricate a spec or price. Empty is always better than a plausible guess.
- Service-role Supabase key is server-only, never in client bundles.
- RLS enabled and explicit on every table; public gets read-only.
- Price changes are new rows, never overwrites — history must survive.
- No destructive migrations without a separate explicit confirmation step.
- Never invent a physical address, phone number, or registration detail — leave it out until real.

## MVP scope reminder (full detail in 01-PRD.md — updated)

**Build now:** vehicle directory, brand/category pages, 2–3 way comparison, price history log, search/filters, populated guides/articles, on-road price estimator (clearly labeled as estimate), JSON-LD + AEO direct-answer blocks, a charging-station directory/map, and a v1 range-aware route planner showing chargers along the route.

**Do not build yet:** installer/home-charger marketplace, native app, user accounts, user-submitted reviews, "Find My Match" quiz, real-time station status. These remain Phase 2.

**Catalog scope:** a target list of ~70 EV/PHEV/REEV models sold or expected in Pakistan is in `01-PRD.md` §5b, for use as a build-toward checklist. The competitor's model *names* are fair to reuse as a catalog reference; their published spec/price *numbers* are not — source each one independently. If asked to add a vehicle without a real source, add it with empty spec/price fields rather than filling in a competitor's numbers.

## Site structure

Footer/nav follows Browse / Get Listed / Company grouping (see `04-DESIGN.md` §4). "List a Home Charger" and "Become an Installer" are omitted or marked "Coming soon" — not linked to a working feature.

## Open decisions not yet finalized (ask before assuming)

- Whether an internal `/admin` panel gets built in Phase 1 or data entry stays manual via Supabase Studio.
- Exact color/accent palette (direction given in 04-DESIGN.md, final values not locked).
- When/whether to move off OpenRouteService's free tier to a paid routing provider.

## Session log

- 2026-09-12 — Initial documentation set updated per founder instructions: removed UI verification badging system (sources kept internal-only), refined aesthetic toward technical automotive minimalism avoiding AI-generic template tells, added OpenRouteService routing wrapper, added Terms & Conditions draft, and updated catalog build-toward checklist.
- 2026-09-12 (Alignment & Catalog Expansion Complete) — Executed full realignment:
  1. Removed public UI verification badges across all components (Navbar, VehicleCard, SpecTable, CompareMatrix, StationCard, and routes). Retained source_url internally in DB/types for data reference.
  2. Applied technical automotive design system per 04-DESIGN.md: deep graphite base (#0c1017), tabular numerals (`tabular-nums`) enabled across all specs, prices, and metrics, and electric sky accent (#0284c7 / #38bdf8).
  3. Implemented centralized `lib/routing.ts` routing engine with OpenRouteService support and calibrated fallback network for Pakistani motorway corridors (M-1, M-2, M-3, M-4, M-5, M-9, N-5). Redesigned route planner to a dense, scannable data list of chargers with distance-from-start and detour time.
  4. Built and published `/terms` (from 07-TERMS.md draft), `/faqs`, `/about`, and `/contact` (email-only, no fabricated phone or address per Rule 1.5).
  5. Refactored navigation and footer per 04-DESIGN.md §4 under Browse / Get Listed / Company with "Coming soon" indicators for unreleased features.
  6. Expanded database catalog via migration 20260912000007_expand_catalog.sql: 15 brands, 22 vehicles (added GWM Ora 03, Seres 3, Honri VE 3.0, MG ZS EV, MG HS PHEV, Audi e-tron, BMW i4, Tesla Model Y, BYD Sealion 7, etc.), 75 specs, and 17 prices.
  7. Production build (`npm run build`) succeeded across 60 static and dynamic routes. Verified live 200 OK responses across all core endpoints.
- 2026-09-12 (Light Minimalist Theme Overhaul & Category Expansion Complete) — Executed full visual and structural upgrade per 04-DESIGN.md:
  1. Full Light Theme Transition: Switched from dark graphite to crisp, minimalist daylight theme: pure white (#FFFFFF) / near-white (#FAFAFA) base, near-black high contrast text (#111114), subtle gray borders (#E5E7EB), and a single sparingly used deep blue accent (#1D4ED8 / #2563EB) reserved for CTAs and active filters.
  2. Line Iconography Everywhere: Replaced all solid/filled icons with consistent outline line icons (Zap, BatteryCharging, Gauge, MapPin, Navigation, GitCompare, Shield).
  3. Category Browse System Built: Added `/categories` and `/categories/[slug]` routes with body styles (SUV, Sedan, Hatchback, Microcar), budget brackets (Under 50 Lacs, Under 1 Crore, Under 1.5 Crore), and range groupings (Long Range 400+ km, BEV, PHEV).
  4. Component Modernization: Updated all components (Navbar, Footer, DirectAnswerBlock, VehicleCard, SpecTable, PriceHistoryChart, OnRoadPriceEstimator, CompareMatrix, CompareSelector, RoutePlannerWidget, StationCard, StationMap, StationSubmitModal, ChargingStationDirectoryClient) to light theme with tabular figures (`tabular-nums`).
  5. StationMap Light Mode: Configured CartoDB Voyager light tiles, clean white popups, and blue/emerald power pins.
  6. Zero Contact Fabrication Maintained: Footer, About, Contact, and Terms remain strictly email/contact-form only with no invented physical address or phone.
  7. Verification: `npm run build` compiled 71 static and dynamic routes in 34.9s with 0 errors. Verified HTTP 200 OK across all primary routes, comparisons, categories, and sitemap.xml.
- 2026-09-13 (Architecture Document Refinements) — Updated docs/02-ARCHITECTURE.md:
  1. Routing + Geocoding: Documented OpenRouteService unified free-tier provider strategy (geocoding endpoint + routing endpoint) eliminating need for separate geocoding service. Centralized behind `lib/routing.ts`.
  2. Charging Station Seed Data: Documented Open Charge Map as candidate open database under ODbL attribution alongside independent operator data and community submissions.
  3. Weather Context: Noted Open-Meteo free API (no key required) as optional contextual feature for origin/destination weather.
- 2026-09-13 (Design & Build Rules Realignment) — Updated docs/04-DESIGN.md & docs/03-RULES.md:
  1. Expanded Design Principles: Explicitly addressed avoiding both AI-generic template tells AND bareness (clean layout with missing content). Emphasized restraint applied to real content.
  2. Brand Identity (§2): Added strategy for wordmark/voice, value-focused tagline (beyond generic category descriptor), and clean line motif logo.
  3. Missing-Field Handling (§4 & Rule 1.2): Updated `SpecTable.tsx` to omit unknown/empty fields entirely instead of displaying "Not Disclosed" rows. Enforced minimum data set publishing rule.
  4. Real Vehicle Imagery: Reinforced requiring real photography (manufacturer press imagery) over placeholder "Awaiting Imagery" states for published models.
- 2026-09-13 (Full Production Polish & Interactive Tooling Upgrade) — Executed comprehensive overhaul to match and exceed PakNEV depth:
  1. Geospatial & Physics-Accurate Route Planner: Built `src/lib/route-engine.ts` with 15 corridor nodes (Karachi to Murree via M-1, M-2, M-3, M-4, M-5, M-9, N-5, Murree Expressway), Dijkstra shortest-path solver, elevation delta derate (+1,560m Murree climb), 110–120 km/h aero drag, 38–45°C HVAC load, automated stop optimizer, 1.15x DC taper curve, PKR fuel/charging cost model, and Google Maps waypoint URLs. Upgraded `RoutePlannerWidget.tsx` and `RoutePlannerMap.tsx` with animated SoC gauge and checkpoint timeline.
  2. Verified Charging Station Directory & Slide-Out Drawer: Created `StationDrawer.tsx` with verified helpline numbers (PSO `0800-03000`, Shell `0800-52345`, ChargeIn `0300-0242743`, Hubco `+92-21-111-482-769`), 24/7 operating hours, rest area amenities, and Google Maps routing. Added neon color-coded pins (Neon Emerald 100+ kW, Cobalt Blue 30–60 kW, Amber 7–22 kW) across 28 verified locations.
  3. Car Match Lifestyle Quiz (`/car-match`): Built interactive 5-question recommendation engine matching daily commute, budget bracket, body type, seating, and home charging setup with weighted scoring and top 3 recommended vehicles.
  4. Homepage Evolution: Integrated multi-tabbed `HomeSearchWidget` (Explore Vehicles / Find Chargers / Plan a Route), quick-filter chips, `HomeBrowseCategories` (budget tiles & silhouettes), `HomeChargingBanner` (dynamic network statistics), and `HomeFaqAccordion` (6 Pakistani EV buyer questions).
  5. Vehicle Detail Page Enhancements (`/vehicles/[slug]`):
     - Added `RunningCostCalculator`: Interactive monthly fuel expense comparison vs. petrol ICE with dated OGRA/NEPRA rates, customizable distance and tariff sliders, and CO2 reduction metrics.
     - Added `WhereToChargeBlock`: Connector standard verification (CCS2 / GB/T) with computed network match percentage (e.g. 26 of 28 stations), DC charging time estimates, and motorway hub highlights.
     - Enhanced `OnRoadPriceEstimator`: Expanded to all 5 provinces (Punjab, Sindh, ICT, KPK, Balochistan) with full itemized breakdown (Registration, Token Tax, Smart Card & Plates, Professional Tax, FBR Section 231B Active Filer 1% vs. Non-Filer 3% WHT, Delivery freight, and Insurance).
     - Added `YouMayConsider`: Dynamic similarity scoring recommending 2–3 alternatives with 1-click comparison links.
- 2026-09-13 (Route Planner & Charging Overhaul: Full-Viewport Floating Console Architecture & 118+ Stations Dataset) — Completely redesigned `/plan-a-route` and `/charging` to match the layout and design seen in the PakNEV route planner screenshot:
  1. Full-Viewport Floating Console Architecture (`/plan-a-route` & `/route-planner`): Replaced standard scrolling pages with full-screen `h-[calc(100vh-64px)]` application view. Leaflet map operates as the 100% full-width/height backdrop, while a floating console card anchors on the top-left (`w-[380px] max-w-[92vw] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-5`).
  2. Floating Console UI Elements: Header badges (`ROUTE PLANNER` slate badge, `INTERCITY` muted badge), grouped white-slate inputs container with 14 Pakistan cities (Karachi, Hyderabad, Sukkur, Rahim Yar Khan, Bahawalpur, Multan, Faisalabad, Lahore, Bhera, Islamabad, Rawalpindi, Peshawar, Abbottabad, Murree), center swap circular button `⇅`, one-tap clear button `✕`, and verified NEV selector (BYD Atto 3, BYD Seal Dynamic/AWD, Deepal S07/L07, MG4 EV, Chery Tiggo 7 PHEV, Honri VE 2.0, Dongfeng Box, and Custom EV).
  3. Ambient Telemetry & AC Degradation: Added ambient temperature widget (`☁️ 34°C`) with interactive slider (20°C–48°C) that factors 18–22% summer range penalty into usable battery calculations and highway range estimates.
  4. Motorway Route Engine & Charger Overlay: Added multi-point GPS coordinates for M-2, M-9, M-4, M-5, M-1, Murree, and Hazara corridors in `src/lib/route-engine.ts`. Auto-identifies and pins compatible fast-charging stops along corridors (e.g. A-Charge Bhera / PSO Bhera with arrival %, charge duration, and PKR cost), with expandable itinerary drawer and "Open in Google Maps Navigation" button.
  5. 118 Stations Dataset & Custom Color-Coded Pins: Expanded `src/lib/data/stations.ts` and `public/data/stations.json` with 118 verified stations, including key hubs (A-Charge Bhera 240/120 kW, Indigost Kallar Kahar 180 kW, Plug Point Kallar Kahar 240 kW, Indigost Chakri 240 kW, Attock Hakla M-1 120 kW, Abdul Hakim M-4 120 kW, Ali Baba Nooriabad M-9 150 kW, Zahir Pir M-5 60 kW, Tesla Industries I-10/3 Islamabad 240 kW, Euro-18 Lahore 180 kW, Caltex Estate Ave Karachi 120 kW, Flash Electric Gulshan 120 kW). Pins color-coded by speed: Purple (180–240 kW), Emerald (100–160 kW), Blue (30–90 kW), Amber (7–22 kW).

