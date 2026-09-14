-- PakevFinder.com — Row Level Security (RLS) Policies
-- Strict adherence to Rule 2, Rule 3, and Supabase Security Guidelines

-- Helper function to check if current authenticated user has editor/admin role
create or replace function public.is_editor_or_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('editor', 'admin')
  );
$$;

-- Revoke execute on helper function from public, grant to authenticated only
revoke execute on function public.is_editor_or_admin() from public;
grant execute on function public.is_editor_or_admin() to authenticated;

-- Enable RLS on ALL tables
alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_specs enable row level security;
alter table public.vehicle_prices enable row level security;
alter table public.categories enable row level security;
alter table public.vehicle_categories enable row level security;
alter table public.articles enable row level security;
alter table public.comparisons enable row level security;
alter table public.charging_stations enable row level security;
alter table public.charging_station_submissions enable row level security;

-- 1. Profiles Policies
create policy "users_read_own_profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id or public.is_editor_or_admin());

create policy "users_update_own_profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id and role = 'user');

-- 2. Public Read on Catalog Tables
create policy "public_read_brands" on public.brands for select to anon, authenticated using (true);
create policy "public_read_vehicles" on public.vehicles for select to anon, authenticated using (true);
create policy "public_read_vehicle_specs" on public.vehicle_specs for select to anon, authenticated using (true);
create policy "public_read_vehicle_prices" on public.vehicle_prices for select to anon, authenticated using (true);
create policy "public_read_categories" on public.categories for select to anon, authenticated using (true);
create policy "public_read_vehicle_categories" on public.vehicle_categories for select to anon, authenticated using (true);
create policy "public_read_articles" on public.articles for select to anon, authenticated using (true);
create policy "public_read_comparisons" on public.comparisons for select to anon, authenticated using (true);
create policy "public_read_charging_stations" on public.charging_stations for select to anon, authenticated using (true);

-- 3. Editor/Admin Write Access on Catalog Tables
create policy "editor_write_brands" on public.brands for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "editor_write_vehicles" on public.vehicles for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "editor_write_vehicle_specs" on public.vehicle_specs for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "editor_write_vehicle_prices" on public.vehicle_prices for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "editor_write_categories" on public.categories for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "editor_write_vehicle_categories" on public.vehicle_categories for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "editor_write_articles" on public.articles for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "editor_write_comparisons" on public.comparisons for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "editor_write_charging_stations" on public.charging_stations for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

-- 4. Charging Station Submissions
-- Anyone can submit (public insert)
create policy "public_insert_station_submissions"
  on public.charging_station_submissions for insert
  to anon, authenticated
  with check (true);

-- Only editors can view or update submission triage queue
create policy "editor_manage_station_submissions"
  on public.charging_station_submissions for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());
