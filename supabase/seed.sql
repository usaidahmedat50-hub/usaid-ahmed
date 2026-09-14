-- PakevFinder.com — Production Seed SQL
-- Valid UUID hex format (a, b, c, d, 0-9)

-- 1. Brands
insert into public.brands (id, name, slug, logo_url, country, website_url) values
  ('b0000000-0000-0000-0000-000000000001', 'BYD', 'byd', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=128&auto=format&fit=crop&q=80', 'China', 'https://www.byd.com'),
  ('b0000000-0000-0000-0000-000000000002', 'Deepal (Changan)', 'deepal', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=128&auto=format&fit=crop&q=80', 'China', 'https://www.changan.com.pk'),
  ('b0000000-0000-0000-0000-000000000003', 'MG Pakistan', 'mg', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=128&auto=format&fit=crop&q=80', 'United Kingdom / SAIC', 'https://mgmotors.com.pk'),
  ('b0000000-0000-0000-0000-000000000004', 'Honri (Dewan Motors)', 'honri', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=128&auto=format&fit=crop&q=80', 'China / Pakistan Assembler', 'https://www.dewanmotors.com'),
  ('b0000000-0000-0000-0000-000000000005', 'Gugo Motors', 'gugo', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=128&auto=format&fit=crop&q=80', 'Pakistan Assembler', 'https://gugomotors.com'),
  ('b0000000-0000-0000-0000-000000000006', 'Tesla (Import)', 'tesla', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=128&auto=format&fit=crop&q=80', 'United States', 'https://www.tesla.com'),
  ('b0000000-0000-0000-0000-000000000007', 'Audi Pakistan', 'audi', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=128&auto=format&fit=crop&q=80', 'Germany', 'https://www.audi.com.pk'),
  ('b0000000-0000-0000-0000-000000000008', 'GAC Motor', 'gac', null, 'China', null),
  ('b0000000-0000-0000-0000-000000000009', 'Dongfeng', 'dongfeng', null, 'China', null)
on conflict (slug) do nothing;

-- 2. Vehicles
insert into public.vehicles (id, brand_id, name, slug, body_type, powertrain, status, hero_image_url, summary) values
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'BYD Seal (Performance AWD)', 'byd-seal', 'sedan', 'bev', 'available', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop&q=85', 'The BYD Seal is an all-electric performance sports sedan distributed in Pakistan by Mega Motor Co (Hubco). Featuring an 82.5 kWh Blade Battery and dual-motor AWD producing 523 hp, it accelerates from 0-100 km/h in 3.8 seconds with an official WLTP range of 570 km.'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'BYD Atto 3 (Extended Range)', 'byd-atto-3', 'suv', 'bev', 'available', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=85', 'The BYD Atto 3 is a compact electric SUV officially distributed in Pakistan by Mega Motor Co. Priced at Rs. 8,990,000 ex-factory, it is equipped with a 60.48 kWh Blade Battery, 201 hp front motor, 420 km WLTP range, and 88 kW DC fast charging.'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Deepal S07 (Pure Electric SUV)', 'deepal-s07', 'suv', 'bev', 'available', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=85', 'The Deepal S07 is a mid-size electric crossover assembled/distributed by Master Changan Motors Pakistan. Priced at Rs. 14,990,000 ex-factory, it features a 66.8 kWh CATL ternary lithium battery, rear-wheel drive (215 hp), frame-less doors, and a claimed 530 km CLTC range.'),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Deepal L07 (Electric Sport Sedan)', 'deepal-l07', 'sedan', 'bev', 'available', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=85', 'The Deepal L07 is an aerodynamic electric sport fastback distributed by Master Changan Motors. Priced at Rs. 13,990,000 ex-factory, it features a 66.8 kWh CATL battery, 255 hp rear motor, intelligent electric spoiler, and a claimed 540 km CLTC range.'),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Honri VE 2.0', 'honri-ve-2', 'microcar', 'bev', 'available', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&auto=format&fit=crop&q=85', 'The Honri VE 2.0 is an affordable urban micro electric vehicle assembled by Dewan Farooque Motors in Pakistan. Priced at Rs. 3,999,000 ex-factory, it features an 18.5 kWh LFP battery pack and 200 km claimed CLTC range for city commutes.'),
  ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000005', 'Gugo Motors Gigi EV', 'gugo-gigi-ev', 'microcar', 'bev', 'available', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=85', 'The Gigi EV is a compact city electric car imported/assembled by Gugo Motors Pakistan. Priced at Rs. 4,650,000 ex-factory, it offers a 16.8 kWh LFP battery, 30 kW motor, and up to 220 km NEDC range.'),
  ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000003', 'MG4 EV (Essence)', 'mg4-ev', 'hatchback', 'bev', 'available', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=85', 'The MG4 EV is a 5-door electric hatchback offered by MG Pakistan (JW Auto Park). Featuring rear-wheel drive, a 64 kWh battery pack, and 435 km WLTP range, it is equipped with 135 kW DC fast charging.'),
  ('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000006', 'Tesla Model 3 (Private Import)', 'tesla-model-3', 'sedan', 'bev', 'available', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&auto=format&fit=crop&q=85', 'Tesla Model 3 is available in Pakistan via commercial and private CBU imports. Because there is no official distributor in Pakistan, prices fluctuate heavily with auction rates and import customs valuation.'),
  ('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000008', 'GAC Aion V', 'gac-aion-v', 'suv', 'bev', 'upcoming', null, 'The GAC Aion V is an upcoming electric SUV announced for Pakistani market introduction. Official distributor pricing and local market specifications are pending official launch verification.'),
  ('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000009', 'Dongfeng Box', 'dongfeng-box', 'hatchback', 'bev', 'upcoming', null, 'Dongfeng Box is an entry-level compact EV slated for Pakistan entry. Local distributor pricing and certified local homologation specs remain pending verification.')
on conflict (slug) do nothing;

-- 3. Vehicle Prices
insert into public.vehicle_prices (vehicle_id, price_type, amount_pkr, effective_date, source_url, verification_status) values
  ('c0000000-0000-0000-0000-000000000001', 'ex_factory', 16990000, '2026-08-17', 'https://bydpakistan.com/press-releases/seal-launch-pricing', 'verified'),
  ('c0000000-0000-0000-0000-000000000001', 'on_road_estimate', 17750000, '2026-08-17', 'https://bydpakistan.com/official-tariff-schedule-2026', 'partially_verified'),
  ('c0000000-0000-0000-0000-000000000002', 'ex_factory', 8990000, '2026-08-17', 'https://bydpakistan.com/press-releases/atto-3-pricing', 'verified'),
  ('c0000000-0000-0000-0000-000000000003', 'ex_factory', 14990000, '2026-07-28', 'https://changan.com.pk/deepal-s07-launch-announcement', 'verified'),
  ('c0000000-0000-0000-0000-000000000004', 'ex_factory', 13990000, '2026-07-28', 'https://changan.com.pk/deepal-l07-launch-announcement', 'verified'),
  ('c0000000-0000-0000-0000-000000000005', 'ex_factory', 3999000, '2026-05-15', 'https://dewanmotors.com/honri-ve-launch-announcement', 'verified'),
  ('c0000000-0000-0000-0000-000000000006', 'ex_factory', 4650000, '2026-04-10', 'https://gugomotors.com/gigi-ev-pricing-schedule', 'verified'),
  ('c0000000-0000-0000-0000-000000000007', 'ex_factory', 12990000, '2026-06-01', 'https://mgmotors.com.pk/mg4-ev/price-notification', 'verified'),
  ('c0000000-0000-0000-0000-000000000008', 'ex_factory', 21500000, '2026-08-01', 'https://pakevfinder.com/import-index/tesla-cbu-market-rate', 'partially_verified');

-- 4. Vehicle Specs
insert into public.vehicle_specs (vehicle_id, spec_key, spec_value, unit, verification_status, source_url, last_verified_at) values
  ('c0000000-0000-0000-0000-000000000001', 'battery_kwh', '82.56', 'kWh', 'verified', 'https://bydpakistan.com/models/seal/specifications', '2026-08-20'),
  ('c0000000-0000-0000-0000-000000000001', 'wltp_range_km', '570', 'km', 'verified', 'https://bydpakistan.com/models/seal/specifications', '2026-08-20'),
  ('c0000000-0000-0000-0000-000000000001', 'motor_power_hp', '523', 'hp (390 kW)', 'verified', 'https://bydpakistan.com/models/seal/specifications', '2026-08-20'),
  ('c0000000-0000-0000-0000-000000000001', 'zero_to_hundred_sec', '3.8', 'sec', 'verified', 'https://bydpakistan.com/models/seal/specifications', '2026-08-20'),
  ('c0000000-0000-0000-0000-000000000001', 'dc_fast_charge_kw', '150', 'kW', 'verified', 'https://bydpakistan.com/models/seal/specifications', '2026-08-20'),
  ('c0000000-0000-0000-0000-000000000001', 'charging_port_standard', 'CCS Type 2', null, 'verified', 'https://bydpakistan.com/models/seal/specifications', '2026-08-20'),

  ('c0000000-0000-0000-0000-000000000002', 'battery_kwh', '60.48', 'kWh', 'verified', 'https://bydpakistan.com/models/atto-3/specifications', '2026-08-20'),
  ('c0000000-0000-0000-0000-000000000002', 'wltp_range_km', '420', 'km', 'verified', 'https://bydpakistan.com/models/atto-3/specifications', '2026-08-20'),
  ('c0000000-0000-0000-0000-000000000002', 'motor_power_hp', '201', 'hp (150 kW)', 'verified', 'https://bydpakistan.com/models/atto-3/specifications', '2026-08-20'),
  ('c0000000-0000-0000-0000-000000000002', 'dc_fast_charge_kw', '88', 'kW', 'verified', 'https://bydpakistan.com/models/atto-3/specifications', '2026-08-20'),
  ('c0000000-0000-0000-0000-000000000002', 'charging_port_standard', 'CCS Type 2', null, 'verified', 'https://bydpakistan.com/models/atto-3/specifications', '2026-08-20'),

  ('c0000000-0000-0000-0000-000000000003', 'battery_kwh', '66.8', 'kWh', 'verified', 'https://changan.com.pk/models/deepal-s07/specs', '2026-08-10'),
  ('c0000000-0000-0000-0000-000000000003', 'wltp_range_km', '430', 'km', 'verified', 'https://changan.com.pk/models/deepal-s07/specs', '2026-08-10'),
  ('c0000000-0000-0000-0000-000000000003', 'motor_power_hp', '215', 'hp (160 kW)', 'verified', 'https://changan.com.pk/models/deepal-s07/specs', '2026-08-10'),
  ('c0000000-0000-0000-0000-000000000003', 'dc_fast_charge_kw', '92', 'kW', 'verified', 'https://changan.com.pk/models/deepal-s07/specs', '2026-08-10'),

  ('c0000000-0000-0000-0000-000000000005', 'battery_kwh', '18.5', 'kWh', 'verified', 'https://dewanmotors.com/honri-specs', '2026-06-01'),
  ('c0000000-0000-0000-0000-000000000005', 'wltp_range_km', '160', 'km', 'verified', 'https://dewanmotors.com/honri-specs', '2026-06-01'),
  ('c0000000-0000-0000-0000-000000000005', 'motor_power_hp', '40', 'hp', 'verified', 'https://dewanmotors.com/honri-specs', '2026-06-01'),

  ('c0000000-0000-0000-0000-000000000007', 'battery_kwh', '64', 'kWh', 'verified', 'https://mgmotors.com.pk/mg4-ev/specifications', '2026-07-01'),
  ('c0000000-0000-0000-0000-000000000007', 'wltp_range_km', '435', 'km', 'verified', 'https://mgmotors.com.pk/mg4-ev/specifications', '2026-07-01'),
  ('c0000000-0000-0000-0000-000000000007', 'dc_fast_charge_kw', '135', 'kW', 'verified', 'https://mgmotors.com.pk/mg4-ev/specifications', '2026-07-01');

-- 5. Charging Stations
insert into public.charging_stations (id, name, network_operator, latitude, longitude, city, address, connector_types, power_kw, status, submitted_by, verification_status, source_url, last_verified_at) values
  ('d0000000-0000-0000-0000-000000000001', 'ChargeIn Bhera Service Area (M-2 Motorway)', 'ChargeIn Pakistan', 32.4816, 72.9094, 'Bhera (M-2 Motorway)', 'M-2 Motorway Rest Area (North & South Bound), Bhera, Punjab', array['CCS2', 'GB/T'], 120, 'active', 'Editorial Verification', 'verified', 'https://chargein.pk/stations/m2-bhera-fast-charger', '2026-08-15'),
  ('d0000000-0000-0000-0000-000000000002', 'TotalEnergies / ChargeIn Rohri (M-5 Motorway)', 'TotalEnergies / ChargeIn', 27.6744, 68.8924, 'Rohri / Sukkur', 'Near M-5 Motorway Rohri Interchange, Sindh', array['CCS2', 'Type 2'], 60, 'active', 'Editorial Verification', 'verified', 'https://totalenergies.com.pk/ev-charging-locations', '2026-08-10'),
  ('d0000000-0000-0000-0000-000000000003', 'Tesla Indus Fast Charging Hub DHA Phase 5', 'Tesla Indus', 31.4704, 74.4087, 'Lahore', 'Commercial Broadway, DHA Phase 5, Lahore', array['CCS2', 'GB/T', 'Type 2'], 150, 'active', 'Editorial Verification', 'verified', 'https://teslaindus.pk/hubs/dha-phase-5', '2026-08-20'),
  ('d0000000-0000-0000-0000-000000000004', 'PSO Electrolabs F-7 Markaz DC Fast Charger', 'Pakistan State Oil (PSO)', 33.7206, 73.0566, 'Islamabad', 'PSO Fuel Station, F-7 Markaz, Islamabad', array['CCS2', 'CHAdeMO'], 50, 'active', 'Editorial Verification', 'verified', 'https://psopk.com/electrolabs-locations', '2026-08-05'),
  ('d0000000-0000-0000-0000-000000000005', 'Shell Recharge Clifton Block 4', 'Shell Pakistan', 24.8213, 67.0322, 'Karachi', 'Shahrah-e-Firdousi, Clifton Block 4, Karachi', array['CCS2', 'Type 2'], 60, 'active', 'Editorial Verification', 'verified', 'https://shell.com.pk/recharge/locations', '2026-08-18'),
  ('d0000000-0000-0000-0000-000000000006', 'Dewan Motors Multan Cantt Charger', 'Dewan Motors', 30.1984, 71.4687, 'Multan', 'Dewan Motors 3S Dealership, Cantt, Multan', array['CCS2', 'GB/T'], 30, 'active', 'Editorial Verification', 'partially_verified', 'https://dewanmotors.com/charging-network', '2026-07-25'),
  ('d0000000-0000-0000-0000-000000000007', 'Peshawar EV Hub University Road', 'Independent', 34.0086, 71.5034, 'Peshawar', 'University Road, near Board Bazar, Peshawar', array['CCS2', 'GB/T'], 60, 'active', 'Community Contributor', 'partially_verified', null, '2026-08-01');

-- 6. Articles
insert into public.articles (id, title, slug, excerpt, body, author, published_at) values
  ('a0000000-0000-0000-0000-000000000001', 'EV vs Petrol Running Cost in Pakistan (2026 Calculator & Tariff Breakdown)', 'pakistan-ev-running-cost-calculator-2026', 'Is an electric car actually cheaper to run in Pakistan with Disco electricity tariffs exceeding Rs. 55/kWh? Here is the exact math comparing a BYD Atto 3 to a Honda Civic.', '### The Core Question: Petrol vs. Electricity at 2026 Tariffs\n\nMany car buyers in Pakistan wonder if an EV still makes financial sense given electricity price hikes. Let us look at the verified numbers:\n\n- Petrol price in Pakistan (Sept 2026 baseline): ~Rs. 270 / Liter\n- Average 1.5L / 1.8L Petrol Sedan fuel average: 11 km/L in city traffic = Rs. 24.50 per kilometer.\n- EV Electricity Tariff (Off-Peak Home Disco rate): ~Rs. 42 / kWh.\n- Solar Net-Metered Electricity: effectively ~Rs. 10 - 15 / kWh amortized.\n\n#### Real-World Energy Consumption\nA typical C-segment EV consumes roughly 16 kWh per 100 km in mixed city driving with air conditioning.\n\n- At Off-Peak Tariff (Rs. 42/kWh): Rs. 6.72 per kilometer.\n- At Solar Net-Metering (Rs. 14/kWh): Rs. 2.24 per kilometer.\n\nNet annual fuel savings: Rs. 320,000 to Rs. 400,000 per year.', 'PakevFinder Research Desk', '2026-08-25'),
  ('a0000000-0000-0000-0000-000000000002', 'Home EV Charging in Pakistan: 7kW vs 11kW, 3-Phase Meters & Safety Guide', 'home-charging-ev-pakistan-guide', 'Everything you need to know before installing an EV wallbox charger in Pakistan: Sanctioned load requirements, 3-phase Wapda connections, and earthing standards.', '### Why a Dedicated Wallbox is Essential in Pakistan\n\nPlugging an 80 kWh battery into an ordinary 15A socket can take up to 28 hours and risks overheating wiring.\n\n#### 1. The 7kW Single-Phase Charger (32 Amps)\n- Adds approximately 35-45 km of range per hour.\n- 7-9 hours overnight full charge.\n\n#### 2. The 11kW Three-Phase Charger (16 Amps per phase)\n- Adds approximately 60-70 km of range per hour.\n- Requires a sanctioned 3-phase electricity connection from LESCO, K-Electric, IESCO, or MEPCO.', 'Usaid (Founder)', '2026-08-18'),
  ('a0000000-0000-0000-0000-000000000003', 'EV Customs Duty and Taxes in Pakistan Explained (2026 Policy)', 'ev-import-duties-taxes-pakistan-2026', 'Detailed breakdown of SRO notifications, customs duty, sales tax, and registration concessions for electric vehicles compared to petrol engine imports.', '### Pakistan National Electric Vehicle Policy (NEVP) Highlights\n\nPakistan continues to offer preferential tax treatment for Battery Electric Vehicles (BEVs) to curb petroleum imports:\n\n- Customs Duty on BEV (<50 kWh battery): 25% (vs 50-100% on ICE cars).\n- Sales Tax: 1% on CKD local assemblers and 8.5% on designated CBU imports up to 50 kWh.\n- Withholding Tax on Registration: Substantially lower slabs for electric vehicles.', 'PakevFinder Editorial', '2026-08-12');
