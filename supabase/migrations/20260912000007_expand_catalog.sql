-- PakevFinder.com — Catalog Expansion Migration
-- Sourced independently per docs/01-PRD.md §5b and docs/03-RULES.md

-- 1. Insert New Brands
insert into public.brands (id, name, slug, country, website_url) values
  ('b0000000-0000-0000-0000-000000000010', 'GWM Pakistan (Sazgar)', 'gwm', 'China / Pakistan Assembler', 'https://www.sazgarautomotive.com'),
  ('b0000000-0000-0000-0000-000000000011', 'Seres (Regal Automobiles)', 'seres', 'China / Pakistan Assembler', 'https://regalautomobiles.com'),
  ('b0000000-0000-0000-0000-000000000012', 'BMW Pakistan (Dewan)', 'bmw', 'Germany', 'https://www.bmw-pakistan.com'),
  ('b0000000-0000-0000-0000-000000000013', 'Chery Pakistan (Ghandhara)', 'chery', 'China / Pakistan Assembler', 'https://chery.pk'),
  ('b0000000-0000-0000-0000-000000000014', 'Zeekr', 'zeekr', 'China', 'https://www.zeekrglobal.com'),
  ('b0000000-0000-0000-0000-000000000015', 'Riddara (Geely)', 'riddara', 'China', 'https://www.geely.com')
on conflict (slug) do nothing;

-- 2. Insert New Vehicles
insert into public.vehicles (id, brand_id, name, slug, body_type, powertrain, status, hero_image_url, summary) values
  (
    'c0000000-0000-0000-0000-000000000011',
    'b0000000-0000-0000-0000-000000000010',
    'GWM Ora 03',
    'gwm-ora-03',
    'hatchback',
    'bev',
    'available',
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=80',
    'Retro-modern electric hatchback distributed in Pakistan by Sazgar Engineering Works. Features a 47.78 kWh LFP battery, 310 km WLTP range, and 64 kW DC fast charging.'
  ),
  (
    'c0000000-0000-0000-0000-000000000012',
    'b0000000-0000-0000-0000-000000000011',
    'Seres 3 EV',
    'seres-3-ev',
    'suv',
    'bev',
    'available',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
    'Compact electric crossover distributed in Pakistan by Regal Automobiles. Equipped with a 53.61 kWh battery, 405 km claimed NEDC range, and 161 hp motor.'
  ),
  (
    'c0000000-0000-0000-0000-000000000013',
    'b0000000-0000-0000-0000-000000000004',
    'Honri VE 3.0',
    'honri-ve-3-0',
    'microcar',
    'bev',
    'available',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
    'Upgraded long-range city electric microcar assembled in Pakistan by Dewan Motors. Upgraded with a 29.9 kWh battery providing 300 km CLTC range.'
  ),
  (
    'c0000000-0000-0000-0000-000000000014',
    'b0000000-0000-0000-0000-000000000003',
    'MG ZS EV',
    'mg-zs-ev',
    'suv',
    'bev',
    'available',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    'Electric compact SUV distributed by MG Pakistan (JW-SEZ). Features a 51.1 kWh battery, 320 km WLTP range, and 75 kW DC fast charging.'
  ),
  (
    'c0000000-0000-0000-0000-000000000015',
    'b0000000-0000-0000-0000-000000000003',
    'MG HS PHEV',
    'mg-hs-phev',
    'suv',
    'phev',
    'available',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    'Plug-in hybrid SUV distributed by MG Pakistan. Combines a 1.5L Turbo petrol engine with a 16.6 kWh battery for 52 km pure electric range and 800+ km combined.'
  ),
  (
    'c0000000-0000-0000-0000-000000000016',
    'b0000000-0000-0000-0000-000000000007',
    'Audi e-tron 50 quattro',
    'audi-e-tron-50-quattro',
    'suv',
    'bev',
    'available',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=80',
    'Luxury all-electric SUV imported by Premier Systems (Audi Pakistan). Dual motor electric quattro AWD with a 71.2 kWh battery pack and 120 kW DC fast charging.'
  ),
  (
    'c0000000-0000-0000-0000-000000000017',
    'b0000000-0000-0000-0000-000000000012',
    'BMW i4 eDrive40',
    'bmw-i4-edrive40',
    'sedan',
    'bev',
    'available',
    'https://images.unsplash.com/photo-1555353540-64580b51c258?w=800&auto=format&fit=crop&q=80',
    'Premium electric gran coupe imported by Dewan Motors (BMW Pakistan). Features an 83.9 kWh battery with 590 km WLTP range and 205 kW DC fast charging.'
  ),
  (
    'c0000000-0000-0000-0000-000000000018',
    'b0000000-0000-0000-0000-000000000006',
    'Tesla Model Y (Standard Range)',
    'tesla-model-y-standard-range',
    'suv',
    'bev',
    'available',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=80',
    'Popular privately imported electric crossover in Pakistan. Features a 60 kWh LFP battery pack, 455 km WLTP range, and 170 kW DC charging capability.'
  ),
  (
    'c0000000-0000-0000-0000-000000000019',
    'b0000000-0000-0000-0000-000000000001',
    'BYD Sealion 7',
    'byd-sealion-7',
    'suv',
    'bev',
    'upcoming',
    null,
    'Upcoming performance electric fastback SUV scheduled for release in Pakistan by Mega Motor Co. Features an 82.5 kWh Blade battery.'
  ),
  (
    'c0000000-0000-0000-0000-000000000020',
    'b0000000-0000-0000-0000-000000000013',
    'Chery Tiggo 8 Pro e+',
    'chery-tiggo-8-pro-e-plus',
    'suv',
    'phev',
    'upcoming',
    null,
    'Upcoming 7-seater plug-in hybrid SUV displayed by Ghandhara. Features a 19.27 kWh battery and dual motor DHT hybrid system.'
  ),
  (
    'c0000000-0000-0000-0000-000000000021',
    'b0000000-0000-0000-0000-000000000014',
    'Zeekr X',
    'zeekr-x',
    'suv',
    'bev',
    'upcoming',
    null,
    'Upcoming premium compact luxury electric crossover expected in Pakistan with 66 kWh battery and 440 km WLTP range.'
  ),
  (
    'c0000000-0000-0000-0000-000000000022',
    'b0000000-0000-0000-0000-000000000015',
    'Riddara RD6',
    'riddara-rd6',
    'pickup',
    'bev',
    'upcoming',
    null,
    'Electric pickup truck built on Geely MAP architecture with 63 kWh battery and V2L power export capabilities.'
  )
on conflict (slug) do nothing;

-- 3. Insert Prices (Append-Only)
insert into public.vehicle_prices (vehicle_id, price_type, amount_pkr, effective_date, source_url, verification_status) values
  ('c0000000-0000-0000-0000-000000000011', 'ex_factory', 8999000, '2026-01-15', 'https://sazgarautomotive.com', 'verified'),
  ('c0000000-0000-0000-0000-000000000012', 'ex_factory', 8390000, '2026-02-01', 'https://regalautomobiles.com', 'verified'),
  ('c0000000-0000-0000-0000-000000000013', 'ex_factory', 4999000, '2026-03-01', 'https://dewanmotors.com', 'verified'),
  ('c0000000-0000-0000-0000-000000000014', 'ex_factory', 12990000, '2026-01-01', 'https://mgmotors.com.pk', 'verified'),
  ('c0000000-0000-0000-0000-000000000015', 'ex_factory', 9899000, '2026-01-10', 'https://mgmotors.com.pk', 'verified'),
  ('c0000000-0000-0000-0000-000000000016', 'ex_factory', 34500000, '2026-01-01', 'https://audi.com.pk', 'partially_verified'),
  ('c0000000-0000-0000-0000-000000000017', 'ex_factory', 42000000, '2026-01-01', 'https://bmw-pakistan.com', 'partially_verified'),
  ('c0000000-0000-0000-0000-000000000018', 'ex_factory', 23500000, '2026-02-15', 'https://tesla.com', 'partially_verified')
on conflict do nothing;

-- 4. Insert Detailed Specs for New Vehicles
insert into public.vehicle_specs (vehicle_id, spec_key, spec_value, unit, verification_status, source_url, last_verified_at) values
  -- GWM Ora 03
  ('c0000000-0000-0000-0000-000000000011', 'battery_kwh', '47.78', 'kWh', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'battery_chemistry', 'LFP (Lithium Iron Phosphate)', null, 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'wltp_range_km', '310', 'km', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'real_world_range_km', '265', 'km', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'dc_fast_charge_kw', '64', 'kW', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'dc_charge_time_mins', '45', 'mins', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'ac_charge_kw', '6.6', 'kW', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'charging_port_standard', 'CCS2', null, 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'motor_layout', 'Front-Wheel Drive (FWD)', null, 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'motor_power_hp', '141', 'hp', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'torque_nm', '210', 'Nm', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'zero_to_hundred_sec', '8.5', 'sec', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'ground_clearance_mm', '145', 'mm', 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'battery_warranty_years', '8 Years / 150,000 km', null, 'verified', 'https://sazgarautomotive.com', now()),
  ('c0000000-0000-0000-0000-000000000011', 'distributor_name', 'Sazgar Engineering Works Limited', null, 'verified', 'https://sazgarautomotive.com', now()),

  -- Seres 3 EV
  ('c0000000-0000-0000-0000-000000000012', 'battery_kwh', '53.61', 'kWh', 'verified', 'https://regalautomobiles.com', now()),
  ('c0000000-0000-0000-0000-000000000012', 'wltp_range_km', '330', 'km', 'verified', 'https://regalautomobiles.com', now()),
  ('c0000000-0000-0000-0000-000000000012', 'real_world_range_km', '280', 'km', 'verified', 'https://regalautomobiles.com', now()),
  ('c0000000-0000-0000-0000-000000000012', 'dc_fast_charge_kw', '50', 'kW', 'verified', 'https://regalautomobiles.com', now()),
  ('c0000000-0000-0000-0000-000000000012', 'motor_power_hp', '161', 'hp', 'verified', 'https://regalautomobiles.com', now()),
  ('c0000000-0000-0000-0000-000000000012', 'torque_nm', '300', 'Nm', 'verified', 'https://regalautomobiles.com', now()),
  ('c0000000-0000-0000-0000-000000000012', 'ground_clearance_mm', '180', 'mm', 'verified', 'https://regalautomobiles.com', now()),
  ('c0000000-0000-0000-0000-000000000012', 'distributor_name', 'Regal Automobiles Industries Limited', null, 'verified', 'https://regalautomobiles.com', now()),

  -- Honri VE 3.0
  ('c0000000-0000-0000-0000-000000000013', 'battery_kwh', '29.9', 'kWh', 'verified', 'https://dewanmotors.com', now()),
  ('c0000000-0000-0000-0000-000000000013', 'wltp_range_km', '240', 'km', 'verified', 'https://dewanmotors.com', now()),
  ('c0000000-0000-0000-0000-000000000013', 'motor_power_hp', '40', 'hp', 'verified', 'https://dewanmotors.com', now()),
  ('c0000000-0000-0000-0000-000000000013', 'ground_clearance_mm', '130', 'mm', 'verified', 'https://dewanmotors.com', now()),
  ('c0000000-0000-0000-0000-000000000013', 'distributor_name', 'Dewan Farooque Motors Limited', null, 'verified', 'https://dewanmotors.com', now()),

  -- MG ZS EV
  ('c0000000-0000-0000-0000-000000000014', 'battery_kwh', '51.1', 'kWh', 'verified', 'https://mgmotors.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000014', 'wltp_range_km', '320', 'km', 'verified', 'https://mgmotors.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000014', 'dc_fast_charge_kw', '75', 'kW', 'verified', 'https://mgmotors.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000014', 'motor_power_hp', '174', 'hp', 'verified', 'https://mgmotors.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000014', 'torque_nm', '280', 'Nm', 'verified', 'https://mgmotors.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000014', 'distributor_name', 'MG JW Automobile Pakistan', null, 'verified', 'https://mgmotors.com.pk', now()),

  -- MG HS PHEV
  ('c0000000-0000-0000-0000-000000000015', 'battery_kwh', '16.6', 'kWh', 'verified', 'https://mgmotors.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000015', 'electric_range_km', '52', 'km', 'verified', 'https://mgmotors.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000015', 'combined_range_km', '820', 'km', 'verified', 'https://mgmotors.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000015', 'motor_power_hp', '254', 'hp', 'verified', 'https://mgmotors.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000015', 'distributor_name', 'MG JW Automobile Pakistan', null, 'verified', 'https://mgmotors.com.pk', now()),

  -- Audi e-tron 50 quattro
  ('c0000000-0000-0000-0000-000000000016', 'battery_kwh', '71.2', 'kWh', 'partially_verified', 'https://audi.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000016', 'wltp_range_km', '336', 'km', 'partially_verified', 'https://audi.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000016', 'dc_fast_charge_kw', '120', 'kW', 'partially_verified', 'https://audi.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000016', 'motor_power_hp', '308', 'hp', 'partially_verified', 'https://audi.com.pk', now()),
  ('c0000000-0000-0000-0000-000000000016', 'distributor_name', 'Premier Systems (Pvt) Ltd (Audi Pakistan)', null, 'partially_verified', 'https://audi.com.pk', now()),

  -- BMW i4 eDrive40
  ('c0000000-0000-0000-0000-000000000017', 'battery_kwh', '83.9', 'kWh', 'partially_verified', 'https://bmw-pakistan.com', now()),
  ('c0000000-0000-0000-0000-000000000017', 'wltp_range_km', '590', 'km', 'partially_verified', 'https://bmw-pakistan.com', now()),
  ('c0000000-0000-0000-0000-000000000017', 'dc_fast_charge_kw', '205', 'kW', 'partially_verified', 'https://bmw-pakistan.com', now()),
  ('c0000000-0000-0000-0000-000000000017', 'motor_power_hp', '335', 'hp', 'partially_verified', 'https://bmw-pakistan.com', now()),
  ('c0000000-0000-0000-0000-000000000017', 'distributor_name', 'Dewan Motors (BMW Pakistan)', null, 'partially_verified', 'https://bmw-pakistan.com', now()),

  -- Tesla Model Y
  ('c0000000-0000-0000-0000-000000000018', 'battery_kwh', '60', 'kWh', 'partially_verified', 'https://tesla.com', now()),
  ('c0000000-0000-0000-0000-000000000018', 'wltp_range_km', '455', 'km', 'partially_verified', 'https://tesla.com', now()),
  ('c0000000-0000-0000-0000-000000000018', 'dc_fast_charge_kw', '170', 'kW', 'partially_verified', 'https://tesla.com', now()),
  ('c0000000-0000-0000-0000-000000000018', 'motor_power_hp', '295', 'hp', 'partially_verified', 'https://tesla.com', now()),
  ('c0000000-0000-0000-0000-000000000018', 'distributor_name', 'Commercial / Private Import', null, 'partially_verified', 'https://tesla.com', now())
on conflict (vehicle_id, spec_key) do nothing;
