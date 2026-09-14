-- 1. Covering indexes for unindexed foreign keys
create index if not exists idx_comparisons_vehicle_a_id on public.comparisons(vehicle_a_id);
create index if not exists idx_comparisons_vehicle_b_id on public.comparisons(vehicle_b_id);
create index if not exists idx_vehicle_categories_category_id on public.vehicle_categories(category_id);

-- 2. Revoke execute from public on is_editor_or_admin helper
revoke execute on function public.is_editor_or_admin() from public, anon, authenticated;

-- 3. Refine editor write policies from FOR ALL to INSERT, UPDATE, DELETE to eliminate multiple permissive SELECT policies
drop policy if exists "editor_write_brands" on public.brands;
create policy "editor_insert_brands" on public.brands for insert to authenticated with check (public.is_editor_or_admin());
create policy "editor_update_brands" on public.brands for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_brands" on public.brands for delete to authenticated using (public.is_editor_or_admin());

drop policy if exists "editor_write_vehicles" on public.vehicles;
create policy "editor_insert_vehicles" on public.vehicles for insert to authenticated with check (public.is_editor_or_admin());
create policy "editor_update_vehicles" on public.vehicles for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_vehicles" on public.vehicles for delete to authenticated using (public.is_editor_or_admin());

drop policy if exists "editor_write_vehicle_specs" on public.vehicle_specs;
create policy "editor_insert_vehicle_specs" on public.vehicle_specs for insert to authenticated with check (public.is_editor_or_admin());
create policy "editor_update_vehicle_specs" on public.vehicle_specs for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_vehicle_specs" on public.vehicle_specs for delete to authenticated using (public.is_editor_or_admin());

drop policy if exists "editor_write_vehicle_prices" on public.vehicle_prices;
create policy "editor_insert_vehicle_prices" on public.vehicle_prices for insert to authenticated with check (public.is_editor_or_admin());
create policy "editor_update_vehicle_prices" on public.vehicle_prices for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_vehicle_prices" on public.vehicle_prices for delete to authenticated using (public.is_editor_or_admin());

drop policy if exists "editor_write_categories" on public.categories;
create policy "editor_insert_categories" on public.categories for insert to authenticated with check (public.is_editor_or_admin());
create policy "editor_update_categories" on public.categories for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_categories" on public.categories for delete to authenticated using (public.is_editor_or_admin());

drop policy if exists "editor_write_vehicle_categories" on public.vehicle_categories;
create policy "editor_insert_vehicle_categories" on public.vehicle_categories for insert to authenticated with check (public.is_editor_or_admin());
create policy "editor_update_vehicle_categories" on public.vehicle_categories for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_vehicle_categories" on public.vehicle_categories for delete to authenticated using (public.is_editor_or_admin());

drop policy if exists "editor_write_articles" on public.articles;
create policy "editor_insert_articles" on public.articles for insert to authenticated with check (public.is_editor_or_admin());
create policy "editor_update_articles" on public.articles for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_articles" on public.articles for delete to authenticated using (public.is_editor_or_admin());

drop policy if exists "editor_write_comparisons" on public.comparisons;
create policy "editor_insert_comparisons" on public.comparisons for insert to authenticated with check (public.is_editor_or_admin());
create policy "editor_update_comparisons" on public.comparisons for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_comparisons" on public.comparisons for delete to authenticated using (public.is_editor_or_admin());

drop policy if exists "editor_write_charging_stations" on public.charging_stations;
create policy "editor_insert_charging_stations" on public.charging_stations for insert to authenticated with check (public.is_editor_or_admin());
create policy "editor_update_charging_stations" on public.charging_stations for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_charging_stations" on public.charging_stations for delete to authenticated using (public.is_editor_or_admin());

-- Refine station submissions policies
drop policy if exists "editor_manage_station_submissions" on public.charging_station_submissions;
create policy "editor_select_station_submissions" on public.charging_station_submissions for select to authenticated using (public.is_editor_or_admin());
create policy "editor_update_station_submissions" on public.charging_station_submissions for update to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editor_delete_station_submissions" on public.charging_station_submissions for delete to authenticated using (public.is_editor_or_admin());
