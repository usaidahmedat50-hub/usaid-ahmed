import React from 'react';
import Link from 'next/link';
import { getAllVehicles } from '@/lib/vehicles';
import { getAllChargingStations } from '@/lib/stations';
import { getAllArticles } from '@/lib/articles';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { Zap, MapPin, Navigation, ArrowRight, GitCompare, Sparkles, BookOpen } from 'lucide-react';
import { RoutePlannerWidget } from '@/components/route-planner/RoutePlannerWidget';
import { CompareMatrix } from '@/components/compare/CompareMatrix';
import { BrandGrid } from '@/components/home/BrandGrid';
import { HomeSearchWidget } from '@/components/home/HomeSearchWidget';
import { HomeBrowseCategories } from '@/components/home/HomeBrowseCategories';
import { HomeChargingBanner } from '@/components/home/HomeChargingBanner';
import { HomeFaqAccordion } from '@/components/home/HomeFaqAccordion';

export const revalidate = 3600; // ISR 1 hour

export default async function HomePage() {
  const [vehicles, stations, articles] = await Promise.all([
    getAllVehicles(),
    getAllChargingStations(),
    getAllArticles(),
  ]);

  const featuredVehicles = vehicles.slice(0, 6);
  const comparePair = vehicles.slice(0, 2);

  // Group vehicles by powertrain for dedicated rows
  const bevVehicles = vehicles.filter((v) => v.powertrain === 'bev').slice(0, 3);
  const phevVehicles = vehicles.filter((v) => v.powertrain === 'phev' || v.powertrain === 'reev').slice(0, 3);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. High-Contrast Deep Obsidian & Dark Carbon Hero with Search Widget */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#090D1A] via-[#0E1626] to-[#0A101D] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        {/* Ambient Electric Backdrops */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-4 text-center sm:text-left">
            {/* High-Voltage Platform Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-cyan-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Pakistan EV Intelligence & Route Ecosystem</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-[1.15]">
              Find. Compare. Calculate.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                Route.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Pakistan&apos;s authoritative EV directory for verified ex-factory distributor pricing, 38°C summer range modeling, and intercity motorway fast-charging corridors.
            </p>
          </div>

          {/* Interactive Multi-Tabbed Search Widget */}
          <HomeSearchWidget />
        </div>
      </section>

      {/* 2. Major EV Brands in Pakistan (Authorized Network & Assemblers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandGrid />
      </section>

      {/* 3. Semantic Direct Answer Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DirectAnswerBlock
          title="Market Overview: Electric Vehicles in Pakistan (2026)"
          summary="Electric vehicles in Pakistan are actively distributed by Mega Motor Co (BYD Seal & Atto 3), Master Changan (Deepal S07 & L07), MG Pakistan (MG4 EV & ZS EV), Dewan Motors (Honri VE 2.0 & 3.0), and Sazgar (GWM Ora 03). Official ex-factory prices range from PKR 3,599,000 (Honri VE 2.0) to PKR 18,500,000 (KIA EV5). Primary intercity fast-charging infrastructure operates along the M-2, M-3, M-5, and M-9 motorway networks."
          keyFacts={[
            { label: 'Entry Price Point', value: 'PKR 35.99 Lacs (Honri VE)' },
            { label: 'Longest Rated Range', value: '570 km WLTP (BYD Seal)' },
            { label: 'Highway Fast Charging', value: '120 kW Dual DC (Bhera M-2)' },
            { label: 'Connector Standards', value: 'CCS2 & GB/T' },
          ]}
        />
      </section>

      {/* 4. Browse by Budget & Silhouette Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeBrowseCategories />
      </section>

      {/* 5. Bold Charging Network Stat Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeChargingBanner stations={stations} />
      </section>

      {/* 6. Featured Catalog Models */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111114] tracking-tight">
              Featured Electric Vehicles in Pakistan
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified ex-factory distributor pricing, battery chemistry, and real-world ranges.
            </p>
          </div>

          <Link
            href="/vehicles"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
          >
            <span>View all {vehicles.length} catalog models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredVehicles.map((veh) => (
            <VehicleCard key={veh.id} vehicle={veh} />
          ))}
        </div>
      </section>

      {/* 7. Intercity Motorway Route Planner Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-6 space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#111114] tracking-tight">
            Intercity Motorway Route Feasibility
          </h2>
          <p className="text-xs text-gray-500">
            Model road distance, highway cruising speeds (110–120 km/h), and fast-charging stops across Pakistan&apos;s motorways.
          </p>
        </div>

        <RoutePlannerWidget vehicles={vehicles} />
      </section>

      {/* 8. Side-by-Side Comparison Showcase */}
      {comparePair.length >= 2 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111114] tracking-tight">
                Direct Spec Comparison
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Side-by-side alignment of battery size, range, acceleration, and warranties.
              </p>
            </div>

            <Link
              href="/compare"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
            >
              <span>Compare any vehicles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CompareMatrix vehicles={comparePair} />
        </section>
      )}

      {/* 9. FAQ Accordion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeFaqAccordion />
      </section>

      {/* 10. Practical EV Guides & Research Desk */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111114] tracking-tight">
              Guides & Research Desk
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Independent explainers on running costs, home solar charging, and import policies.
            </p>
          </div>

          <Link
            href="/guides"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
          >
            <span>All articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white border border-gray-200 hover:border-gray-400 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider block mb-1.5">
                  {art.read_time_mins} Min Read
                </span>
                <Link href={`/guides/${art.slug}`}>
                  <h3 className="text-sm font-bold text-[#111114] hover:text-blue-700 transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 text-[11px]">{art.author}</span>
                <Link
                  href={`/guides/${art.slug}`}
                  className="font-bold text-blue-700 hover:text-blue-800 text-xs"
                >
                  Read &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
