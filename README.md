# PakevFinder.com — Production-Ready Next.js EV Platform

PakevFinder (`https://pakevfinder.com`) is a full-stack automotive intelligence, vehicle specification, comparison, pricing, financing, and electric vehicle discovery platform.

---

## 1. Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & ORM**: PostgreSQL + Prisma ORM
- **State & Validation**: Zod, React 18
- **SEO & AEO**: Schema.org JSON-LD, Answer-First Optimization (AEO), Generative Engine Optimization (GEO)
- **Deployment**: Standalone Node.js server (`server.js`) deployable via Hostinger hPanel Node.js environment

---

## 2. Quick Start & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` with your PostgreSQL database credentials.

### 3. Initialize Database & Seed
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Production Build & Execution

```bash
# Build production standalone bundle
npm run build

# Start production Node.js server on Hostinger or VPS
npm start
```

---

## 4. Hostinger hPanel Deployment Guide

1. Log into **Hostinger hPanel** &rarr; **Node.js Web Applications**.
2. Select **Connect Git Repository** and enter:
   `https://github.com/usaidahmedat50-hub/usaid-ahmed.git` (Branch: `main`).
3. Set **Framework Preset** to `Next.js`.
4. Set **Node.js Version** to `20.x` or `22.x`.
5. Set **Root Directory** to `./`.
6. Click **Deploy**. Hostinger will execute `npm run build` and launch `server.js` automatically.

---

## 5. System Features & Route Architecture

- **Homepage (`/`)**: Hero multi-search bar, live market KPI stats, featured vehicles, comparison arena, interactive range estimator, distributor tariffs.
- **Vehicle Catalog (`/vehicles`)**: Filterable inventory across brand, body type, powertrain, and price.
- **Vehicle Specification Page (`/vehicles/[slug]`)**: Sourced tariffs, battery kWh, WLTP range, DC fast charge speeds, running cost calculator, value scores (`/vehicles/byd-seal`).
- **Side-by-Side Comparison Engine (`/compare/[comparison]`)**: Direct category score winners, advantage indicators, and specification matrix (`/compare/byd-seal-vs-tesla-model-3`).
- **Brand Showcase (`/brands/[slug]`)**: Official importers, 3S dealership networks, brand models (`/brands/byd`).
- **Category Hubs (`/categories/[slug]`)**: SUVs, Sedans, Hatchbacks, PHEVs/REEVs, and budget discovery (`/categories/electric-suvs`, `/categories/evs-under-5000000`).
- **Articles & Guides (`/articles`, `/guides`)**: Running cost comparisons, home wallbox installation, and M2 Motorway intercity driving guide.
- **Protected Admin Console (`/admin`)**: Ingest, verify, audit, and log historical prices.
- **Technical SEO (`app/sitemap.ts`, `app/robots.ts`)**: Dynamic XML sitemap indexer and robots.txt.
