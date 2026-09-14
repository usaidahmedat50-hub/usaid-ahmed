-- PakevFinder.com — Initial Schema Migration
-- Strictly adheres to docs/02-ARCHITECTURE.md and Supabase Postgres Best Practices

-- Enable pgcrypto / uuid-ossp if not already enabled
create extension if not exists "pgcrypto";

-- 1. Profiles & Roles (RBAC for Editors/Admins)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'editor', 'admin')),
  created_at timestamptz not null default now()
);

-- 2. Brands
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  country text,
  website_url text,
  created_at timestamptz not null default now()
);

-- 3. Vehicles
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  slug text not null unique,
  body_type text not null check (body_type in ('sedan', 'suv', 'hatchback', 'pickup', 'microcar', 'crossover', 'mpv')),
  powertrain text not null check (powertrain in ('bev', 'phev', 'reev', 'hev')),
  status text not null default 'available' check (status in ('available', 'upcoming', 'discontinued')),
  hero_image_url text,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Vehicle Specs (Key/Value for flexible powertrain types with field-level verification)
create table if not exists public.vehicle_specs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  spec_key text not null,
  spec_value text,
  unit text,
  verification_status text not null default 'unverified' check (verification_status in ('verified', 'partially_verified', 'unverified', 'outdated')),
  source_url text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  constraint uq_vehicle_spec unique (vehicle_id, spec_key)
);

-- 5. Vehicle Prices (Append-only price history log)
create table if not exists public.vehicle_prices (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  price_type text not null check (price_type in ('ex_factory', 'on_road_estimate')),
  amount_pkr numeric not null check (amount_pkr >= 0),
  effective_date date not null default current_date,
  source_url text,
  verification_status text not null default 'unverified' check (verification_status in ('verified', 'partially_verified', 'unverified', 'outdated')),
  created_at timestamptz not null default now()
);

-- 6. Categories & Join Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicle_categories (
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (vehicle_id, category_id)
);

-- 7. Articles / Guides
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null,
  author text not null default 'PakevFinder Editorial',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 8. Comparisons (Pre-generated / Featured Pairings)
create table if not exists public.comparisons (
  id uuid primary key default gen_random_uuid(),
  vehicle_a_id uuid not null references public.vehicles(id) on delete cascade,
  vehicle_b_id uuid not null references public.vehicles(id) on delete cascade,
  slug text not null unique,
  title text,
  summary text,
  created_at timestamptz not null default now(),
  constraint chk_diff_vehicles check (vehicle_a_id <> vehicle_b_id)
);

-- 9. Charging Stations (Verified directory)
create table if not exists public.charging_stations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  network_operator text,
  latitude numeric(10, 7) not null,
  longitude numeric(10, 7) not null,
  city text not null,
  address text,
  connector_types text[] not null default '{}',
  power_kw numeric(6, 1) not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive', 'unverified')),
  submitted_by text,
  verification_status text not null default 'unverified' check (verification_status in ('verified', 'partially_verified', 'unverified', 'outdated')),
  source_url text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- 10. Charging Station Submissions (Public ingestion queue)
create table if not exists public.charging_station_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_data jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitter_contact text,
  notes text,
  created_at timestamptz not null default now()
);
