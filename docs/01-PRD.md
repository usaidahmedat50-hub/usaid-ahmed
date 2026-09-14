# PakevFinder.com — Product Requirements Document (PRD)

**Version:** 1.0
**Owner:** Usaid
**Stack:** Next.js + Supabase
**Status:** Draft for MVP rebuild

---

## 1. Problem Statement

Pakistan's EV market is growing fast (BYD, MG, Tesla imports, GAC, Deepal, local assemblers) but buyers have no single source to compare specs, ex-factory/on-road prices, and running costs. Existing sources are either scattered manufacturer pages, dealer WhatsApp groups, or forums with stale numbers.

PakevFinder's positioning is an EV specification and price directory for Pakistan, with a wider catalog and clearer comparison tools than fragmented alternatives.

## 2. Competitive Snapshot — PakNEV.com

A direct competitor, PakNEV, is materially more built out today. Honest gap analysis as of this review:

| Capability | PakNEV.com | PakevFinder.com (current) |
|---|---|---|
| Vehicle catalog size | ~20+ models across BEV/PHEV/REEV/Hybrid | 4 vehicles |
| Charging station map | Live map, 115 charge points, 40 cities | Not present |
| Route planner (range-aware) | Yes | Not present |
| "Find My Match" recommendation quiz | Yes | Not present |
| Installer directory / marketplace | Yes (installers can list, homeowners can list home chargers) | Not present |
| News / editorial content | Yes, regularly published reviews & policy news | "Guides"/"Articles" nav exists, no visible content |
| Comparison tool | Yes | Yes (2-vehicle compare) |
| Mobile app | "Coming soon" (iOS/Android) | Not present |
| Social presence | FB, IG, YouTube, TikTok, X, LinkedIn, WhatsApp community | Not evident |
| Data trust signal | Implicit ("compiled from public sources") | Not yet a differentiator — see note below |
| Physical footprint | Registered office (Lahore, DHA) | Not evident |
| Business model surface | Charging station/installer listings (potential B2B lead gen) | Not evident yet |

**Implication:** PakevFinder cannot out-build PakNEV's breadth in the short term. Since data-verification badging is not part of the plan, the realistic near-term wedge is catalog depth/UX and the route planner/charging map, executed cleanly — not a trust claim the product isn't actually structured to back up. Worth revisiting a differentiation angle once the MVP is live and you can see what actually pulls traffic.

## 3. Target Users

1. **Active EV shoppers (primary)** — comparing 2–4 specific models before a dealership visit. Care about real ex-factory/on-road price, WLTP vs. real-world range, battery warranty, DC fast-charging speed.
2. **EV-curious researchers** — early-funnel, arrive via Google/AI search ("best EV under 1 crore Pakistan"), want a clear, skimmable answer.
3. **Journalists / forum posters** — cite PakevFinder as a source if data is trustworthy and citable (this drives backlinks/AEO visibility).

## 4. Product Principles

- **Every published figure should have a source** you can point to if asked (manufacturer page, distributor listing) — not shown as a trust badge in the UI, just good internal practice for accuracy.
- **Speed and clarity over feature breadth.** A shopper should get a confident answer in under 30 seconds.
- **AEO/GEO-first content structure** — direct-answer summaries, structured data, clean semantic HTML so AI answer engines and Google can lift accurate PakevFinder data.

## 5. MVP Scope (Phase 1 — updated)

**In scope:**
- Vehicle directory with full spec sheets (battery, range — WLTP and claimed real-world, motor power, charging speed AC/DC, dimensions, seating, warranty, price — ex-factory and estimated on-road), built out toward the full target catalog in Section 5b
- Brand pages, category pages (Sedan/SUV/Hatchback/Microcar/Pickup/MPV × BEV/PHEV/REEV/Hybrid)
- Two/three-way comparison tool
- Price history log per vehicle (simple time series, even if sparse initially)
- Search + filters (price range, body type, powertrain, min range)
- Guides/articles section actually populated (running cost calculator article, home charging basics, import/duty explainer)
- Basic on-road price estimator (ex-factory + duties/taxes assumptions, clearly labeled as an estimate)
- SEO/AEO: JSON-LD (Vehicle/Product schema), sitemap, per-vehicle canonical pages, direct-answer summary blocks
- **Charging station directory + map** — pulled forward into Phase 1 (see note below on how to start it cheaply)
- **Range-aware route planner** — pulled forward into Phase 1

**Note on charging map / route planner sequencing:** build these as real features in this phase, but start with a **manually-curated, community-submittable station list** (name, network/operator, location, connector type, power rating, source/submitted-by) rather than trying to replicate PakNEV's "115 charge points, 40 cities, live status" claim on day one. A route planner only needs: station list + vehicle range + simple straight-line/road-distance calculation between stops — it does not need real-time occupancy data to ship a useful v1.

**Still out of scope for Phase 1** (revisit after MVP traction):
- Installer/home-charger marketplace (listing businesses, lead-gen for installers)
- Native mobile app
- User accounts / saved comparisons / alerts
- User-submitted reviews
- "Find My Match" guided quiz (nice-to-have, not a data-trust differentiator — lower priority than the above)

## 5b. Target Vehicle Catalog (build-toward list)

This is a checklist of which EV/PHEV/REEV models exist in the Pakistani market to work through — **not a source for specs or pricing**. Every model's specs and price should still be sourced from somewhere real (manufacturer page, distributor listing) rather than guessed — just without a formal verification-tag workflow around it.

**BEV:** BYD Atto 3, BYD Atto 2, BYD Seal, BYD Sealion 7, GAC Aion V, GAC Aion UT, GAC Aion ES (upcoming), GAC Hyptec HT, Inverex EV Xio, Dongfeng Box, Dongfeng Vigo, Dongfeng 007, MG Binguo EV, MG4 EV, MG5 EV, MG ZS EV, MG Cyberster, Gugo Motors Box, Gugo Motors Gigi, Nissan Leaf, Nissan Sakura, Kaiyi X3 Pro EV, Kaiyi e-Qute 04, JMEV EV3, JMEV Elight, Deepal E07, Deepal S07, Deepal L07, GWM Ora 05, GWM Ora 03, GWM Ora 07, GWM Jolion Max EV (upcoming), Riddara RD6, Forthing Friday BEV, Chery QQ3 EV (upcoming), Geely EX2 (upcoming), Geely EX5 (upcoming), MINI John Cooper Works Electric, MINI Cooper Electric, MINI Aceman, MINI Countryman Electric, Alektra MINI X4 / Solar MINI X4 / MINI X2, Audi e-tron GT, Audi A6 e-tron, Audi Q6 e-tron, Audi Q8 e-tron, Zeekr X, Zeekr 7X, Zeekr 009, BMW iX3, iX1, iX2, iX, i4, i5, i7, XPeng G6, XPeng X9, Hyundai Ioniq 5, Ioniq 6, Mercedes EQC, EQA, EQB, EQE Sedan/SUV, EQS Sedan/SUV, G 580 with EQ, GLC with EQ, Electric C-Class/CLA, Honri VE 2.0 / VE 3.0, Avatr 11 (upcoming), iCAUR V23 (upcoming), iCAUR V27 (upcoming), Nora EV Nora, Seres 3, Tesla Model 3, Tesla Model Y, Kia EV5, Kia EV9, Porsche Taycan, Changan Lumin (upcoming)

**PHEV:** Chery Tiggo 7/8/9 PHEV, MG HS PHEV, Jaecoo J6, J7 SHS, Omoda 7 SHS-P, Omoda E5, Jetour T1, T2, GWM H6 PHEV

**REEV:** Deepal S05, Forthing Friday REEV, Changan Nevo Hunter

**Prioritization:** don't try to add all ~70 in one pass. Suggested order — (1) models already sold/registered in Pakistan with real distributor pricing available, since these are easiest to verify and highest shopper intent, (2) popular global nameplates people search for by name (Tesla Model 3/Y, BYD Atto 3/Seal, MG4/ZS EV), (3) upcoming/expected models last, since "Expected" pricing is inherently unverifiable until launch.

## 6. Phase 2 (post-traction)

- Live real-time station status (upgrade from the static Phase-1 station directory once there's a reason to maintain it)
- Installer/home-charger marketplace
- Email/WhatsApp price-drop or new-launch alerts
- "Find My Match" style guided recommendation flow
- User accounts for saved comparisons

## 7. Content & Data Operations

- Define a repeatable process for adding a vehicle: note the source when a spec/price is entered, and periodically recheck listed prices since these change.
- Distributor/ex-factory price changes must update the price-history table, not overwrite it.

## 8. Success Metrics (Phase 1)

- Number of vehicles listed with complete spec sheets (quality over quantity)
- Organic search impressions/clicks on vehicle and comparison pages
- Time-to-answer on comparison pages (proxy: bounce rate on compare pages)
- Citations/backlinks from forums, journalists, or AI answer engines

## 9. Monetization (not built in Phase 1, but design should not block it)

- Distributor/dealer lead referral (contact-dealer CTA with tracked outbound)
- Sponsored distributor placement (keep editorial and commercial clearly separated in the UI regardless)
- Later: installer/charging marketplace listings, similar to PakNEV's model

## 10. Open Questions

- Who is keeping vehicle data current (manual by Usaid, or a lightweight contributor workflow)?
- Will price data be sourced from manufacturer press releases only, or also dealer quotes (which vary by city)?
- Legal: PakNEV explicitly disclaims accuracy of third-party data — PakevFinder should have equivalent Terms/disclaimer language given it also aggregates third-party pricing.
