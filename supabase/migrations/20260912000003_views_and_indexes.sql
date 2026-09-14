-- PakevFinder.com — Views and Performance Indexes
-- Postgres 15+ compatible with WITH (security_invoker = true) per Supabase Best Practices

-- 1. Foreign Key & Filter Indexes
create index if not exists idx_vehicles_brand_id on public.vehicles(brand_id);
create index if not exists idx_vehicles_slug on public.vehicles(slug);
create index if not exists idx_vehicles_body_type on public.vehicles(body_type);
create index if not exists idx_vehicles_powertrain on public.vehicles(powertrain);
create index if not exists idx_vehicles_status on public.vehicles(status);

create index if not exists idx_vehicle_specs_vehicle_id on public.vehicle_specs(vehicle_id);
create index if not exists idx_vehicle_specs_key on public.vehicle_specs(spec_key);
create index if not exists idx_vehicle_specs_status on public.vehicle_specs(verification_status);

create index if not exists idx_vehicle_prices_vehicle_id on public.vehicle_prices(vehicle_id);
create index if not exists idx_vehicle_prices_effective_date on public.vehicle_prices(effective_date desc);
create index if not exists idx_vehicle_prices_type on public.vehicle_prices(price_type);

create index if not exists idx_charging_stations_city on public.charging_stations(city);
create index if not exists idx_charging_stations_status on public.charging_stations(status);
create index if not exists idx_charging_stations_connectors on public.charging_stations using gin(connector_types);

-- 2. Full-Text Search Index for Quick Search
alter table public.vehicles add column if not exists fts tsvector
  generated always as (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(summary, ''))) stored;

create index if not exists idx_vehicles_fts on public.vehicles using gin(fts);

-- 3. Materialized / Computed View for Fast Vehicle Reading
-- Defined with security_invoker = true to respect RLS
create or replace view public.vehicle_full_spec_view
with (security_invoker = true)
as
select
  v.id as vehicle_id,
  v.slug,
  v.name,
  v.body_type,
  v.powertrain,
  v.status,
  v.hero_image_url,
  v.summary,
  v.created_at,
  v.updated_at,
  b.id as brand_id,
  b.name as brand_name,
  b.slug as brand_slug,
  b.logo_url as brand_logo_url,
  b.country as brand_country,

  -- Latest Ex-Factory Price
  (
    select vp.amount_pkr
    from public.vehicle_prices vp
    where vp.vehicle_id = v.id and vp.price_type = 'ex_factory'
    order by vp.effective_date desc, vp.created_at desc
    limit 1
  ) as latest_ex_factory_pkr,

  (
    select vp.verification_status
    from public.vehicle_prices vp
    where vp.vehicle_id = v.id and vp.price_type = 'ex_factory'
    order by vp.effective_date desc, vp.created_at desc
    limit 1
  ) as latest_price_verification_status,

  -- Latest On-Road Estimate
  (
    select vp.amount_pkr
    from public.vehicle_prices vp
    where vp.vehicle_id = v.id and vp.price_type = 'on_road_estimate'
    order by vp.effective_date desc, vp.created_at desc
    limit 1
  ) as latest_on_road_pkr,

  -- Common Key Specs Pivoted
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'battery_kwh' limit 1) as battery_kwh,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'wltp_range_km' limit 1) as wltp_range_km,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'real_world_range_km' limit 1) as real_world_range_km,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'motor_power_hp' limit 1) as motor_power_hp,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'motor_power_kw' limit 1) as motor_power_kw,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'torque_nm' limit 1) as torque_nm,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'zero_to_hundred_sec' limit 1) as zero_to_hundred_sec,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'top_speed_kmh' limit 1) as top_speed_kmh,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'dc_fast_charge_kw' limit 1) as dc_fast_charge_kw,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'dc_charge_time_mins' limit 1) as dc_charge_time_mins,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'ac_charge_kw' limit 1) as ac_charge_kw,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'ground_clearance_mm' limit 1) as ground_clearance_mm,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'seating_capacity' limit 1) as seating_capacity,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'battery_warranty_years' limit 1) as battery_warranty_years,
  (select vs.spec_value from public.vehicle_specs vs where vs.vehicle_id = v.id and vs.spec_key = 'battery_warranty_km' limit 1) as battery_warranty_km

from public.vehicles v
join public.brands b on b.id = v.brand_id;
