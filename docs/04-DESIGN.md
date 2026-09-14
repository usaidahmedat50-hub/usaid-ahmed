# PakevFinder.com — Design Document

## 1. Design Principles

1. **Clarity first.** Every design decision should make specs and prices easy to scan, not decorative. Data density where data belongs; nothing competing with it for attention.
2. **Answer in one screen.** A shopper landing on a vehicle or comparison page should get price, range, and one clear verdict-level summary without scrolling, on mobile.
3. **Mobile-first.** Most Pakistani car shoppers will land from a phone (social/search). Design and test mobile layouts first, then scale up.
4. **Light, simple, minimalist — not bare, not AI-generic.** Two different failure modes to avoid, not one: "AI-generic" means stock gradient heroes, generic rounded-card-with-shadow grids, default Tailwind indigo/violet/emerald palette, dark/graphite "tech startup" backgrounds. "Bare" means the opposite mistake — a clean layout with nothing actually in it: rows of "Not Disclosed," no vehicle photography, no real brand voice, generic descriptor-only naming. Minimalism is restraint applied to *real content* — fewer visual elements, each doing real work — not an excuse for missing content. A spec table full of empty fields isn't minimalist, it's unfinished; a hero section with no distinct brand voice isn't minimalist, it's generic. Fix bareness by filling in real content (specs, photos, brand identity — see §2 and the data-completeness note in `03-RULES.md`), not by adding more visual decoration. See the `frontend-design` skill's guidance when this is built for concrete ways to avoid the templated look.

## 2. Brand Identity

A directory named after its own function ("PakEVFinder — Pakistan EV Directory") reads as a placeholder, not a brand — worth fixing alongside the visual design, since a generic name reinforces the "made by AI" impression as much as a generic layout does. A few directions to actually choose between, rather than defaulting to the literal descriptor:

- **Keep the domain, build a distinct wordmark and voice around it.** The URL doesn't have to match the display brand — many sites use a stylized short name or acronym treatment (e.g., a distinct lockup of "PEF" or a compact treatment of "Pakevfinder" as one word, set in the site's display type) rather than spelling out "Pakistan EV Directory" as the tagline.
- **Tagline should say what makes it different, not what it is.** "Pakistan EV Directory" just restates the category (visitors already know that from the URL/context). Something that points at the actual value — e.g., referencing real ex-factory pricing, or "know before you buy" territory — does more work than a category label. Write a few candidate taglines against what the product actually delivers once specs are complete, rather than picking one now to fill the slot.
- **Logo:** keep it simple per the minimalist direction — a wordmark or a single simple mark (e.g., a charging-plug or route-line motif rendered as a thin-line icon matching the spec-icon style in §3) rather than a complex illustrated logo. Avoid an EV-generic bolt/leaf icon that every other EV site also uses — check what PakNEV and other Pakistani EV sites use before finalizing so it's visually distinct.

## 3. Visual Identity

- **Color:** Light and simple — white/off-white (`#FFFFFF` / `#FAFAFA`-ish) as the base for the whole site, near-black text (`#111114`-ish, not pure black) for strong contrast, a light neutral grey for secondary text and dividers, and **one** accent color used sparingly for CTAs, links, and highlights (avoid PakNEV's mint-green `#00fcca` to keep visual distinction as a competitor — a deep blue or amber reads well against a white background). No dark/graphite sections, no gradients. Reserve the accent for things that are actually actionable (buttons, active filters, links) — data tables and spec values stay in neutral black/grey so the accent doesn't get diluted.
- **Typography:** A neutral, highly legible sans-serif for body/data (tabular figures enabled for spec tables — numbers must align in comparison columns). Keep to one typeface family site-wide, varying only weight and size — a second display face adds visual noise that works against the minimalist goal.
- **Iconography:** Simple line icons for spec categories (battery, range, charging speed, seats) — consistent stroke width, no mixed icon sets, no filled/solid icons (filled icons read heavier and less minimal).

## 4. Core UI Patterns

### Spec table (vehicle detail page)
- Two-column layout: field name (left, muted) / value (right, bold, tabular-nums).
- Group specs into sections: Performance & Range, Battery & Charging, Dimensions & Seating, Pricing.
- **Missing-field handling:** don't publish a vehicle page with most fields reading "Not Disclosed" — that's the data-completeness gap described in `03-RULES.md`, not a display problem. Once a vehicle has enough real data to be useful, hide unknown fields entirely rather than listing them as blank rows (a shorter, fully-populated spec table reads as more trustworthy than a long one full of placeholders). If a field is genuinely unavailable from any manufacturer source (rare), it's fine to omit it rather than show "Not Disclosed" for every visitor.
- **Vehicle imagery:** a real photo (manufacturer press image, properly licensed/attributed) beats a placeholder "Awaiting Imagery" state — an "Awaiting Imagery" tag on many cards at once is itself a bareness signal. Don't publish a vehicle card without at least one real image unless it's explicitly an "Upcoming" model with no official photos released yet.

### Comparison page
- Side-by-side columns (2–3 vehicles), sticky header row with vehicle name/image/price, spec rows below aligned across columns, differing values visually highlighted (not just listed) so the winner per row is scannable at a glance.

### Direct-answer block (top of vehicle/comparison pages)
- A short, plain-language 2–3 sentence summary rendered as real server-side text (not an image), styled distinctly (e.g., a bordered callout box) — this serves both human skimmers and AI/AEO extraction.

### Price history
- Simple sparkline or small line chart per vehicle showing ex-factory price over time, with each point linking to its source.

### Route planner (results view)
- Route summary bar at top: total distance, total drive time, feasibility verdict for the selected vehicle (e.g. "Doable with 1 stop").
- Below it, a plain ordered list (not a card grid) of chargers along the route: name, operator, power rating, distance-from-start, detour time — dense and scannable, styled like the spec table, not like a product carousel. This is a data list, not a marketing list; resist the urge to give each entry a big photo and padding.
- Keep the map (if shown) secondary to the list on mobile — the list is what's actually actionable while driving/planning; the map is confirmation, not the primary interface.

## 5. Navigation / IA

- Primary nav: Vehicles, Compare, Brands, Categories, Guides — keep flat, no mega-menus at this catalog size.
- Vehicle detail URL: `/vehicles/[brand-model-slug]`
- Comparison URL: `/compare/[slug]-vs-[slug]` (canonical, so it's directly linkable/shareable and indexable)
- Category browse: `/categories/[slug]` (e.g., suv, sedan, under-40-lacs — mirrors PakNEV's budget-browse pattern, which is a genuinely good UX idea worth adopting)

### Full site structure (footer/nav), matched to current scope

PakNEV's footer groups pages under Browse / Get Listed / Company — that's a sound structure worth adopting, but the *links* should reflect what's actually built, not imply features that don't exist yet:

**Browse:** Vehicles, Compare, Charging Map, Plan a Route — all Phase 1. (Car Match / "Find My Match" stays out per `01-PRD.md` — lower priority than these.)

**Get Listed:** Submit a Charging Station only, for now — this is in scope (`charging_station_submissions`, see `02-ARCHITECTURE.md`). Do **not** add "List a Home Charger" or "Become an Installer" links yet — that's the installer/home-host marketplace, still Phase 2 per the PRD. If a full-parity footer is wanted before those features exist, either omit those two links entirely or mark them "Coming soon" (non-clickable or linking to a simple waitlist form) rather than shipping a link to a feature that isn't built.

**Company:** Guides/News, About Us, Contact. FAQs page is a good addition (mirrors PakNEV) and cheap to build — worth including in Phase 1.

**Contact:** email/contact form only — no address or phone until a real one exists (see §7 below).

## 6. Accessibility

- Minimum AA color contrast throughout, including status badges (e.g. "Upcoming" vehicle status) on colored backgrounds.
- All comparison tables must be screen-reader-navigable (proper `<table>` semantics or ARIA grid roles, not divs-as-tables).
- Interactive filter controls keyboard-operable.

## 7. Footer / Contact Info

Do not include a physical address or phone number in the footer or Terms/Contact pages until there's a real one — an invented address is worse than none. For now: an email/contact form only, and Terms & Privacy pages written without a specific street address (a generic "operated from Pakistan" line is fine if a location claim is needed at all). Revisit once a real registered address and business number exist.

## 8. What Not to Copy From PakNEV

To stay legally and reputationally clean:
- Do not replicate PakNEV's exact page layout, copy, or unique visual identity (mint-green branding, specific card designs).
- Independently written spec summaries and article content — no paraphrasing their editorial copy.
- A similar *category* of feature (e.g., budget-browse chips, a comparison tool) is fine — these are common UX patterns industry-wide, not proprietary — but the execution, wording, and visuals should be original.
- Their charging-station dataset is explicitly protected against bulk copying under their own Terms — build `charging_stations` from independent sources, not by extracting theirs.
