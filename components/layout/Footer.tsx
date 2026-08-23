import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Zap className="w-5 h-5 fill-white stroke-none" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Pak<span className="text-blue-500">EV</span>Finder
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              Pakistan&apos;s premier EV discovery and ownership decision platform. Providing authoritative price data, verified distributor specifications, home charging cost math, and interactive fast-charging map directories across Karachi, Lahore, and Islamabad.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Independent & Unbiased Pakistan EV Database</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Calculators & Tools
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/calculators/ev-vs-petrol" className="hover:text-blue-400 transition-colors">
                  EV vs Petrol Cost Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/ev-running-cost" className="hover:text-blue-400 transition-colors">
                  Monthly Running Cost (DISCO)
                </Link>
              </li>
              <li>
                <Link href="/calculators/ev-charging-cost" className="hover:text-blue-400 transition-colors">
                  Home AC vs DC Charging Cost
                </Link>
              </li>
              <li>
                <Link href="/calculators/total-cost-of-ownership" className="hover:text-blue-400 transition-colors">
                  5-Year Ownership TCO
                </Link>
              </li>
              <li>
                <Link href="/find-an-ev" className="hover:text-blue-400 transition-colors">
                  Smart EV Matcher Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular EV Brands */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Popular EV Brands
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/electric-cars/byd" className="hover:text-blue-400 transition-colors">
                  BYD Pakistan (Atto 3 & Seal)
                </Link>
              </li>
              <li>
                <Link href="/electric-cars/deepal" className="hover:text-blue-400 transition-colors">
                  Deepal Pakistan (S07 & L07)
                </Link>
              </li>
              <li>
                <Link href="/electric-cars/mg" className="hover:text-blue-400 transition-colors">
                  MG Motors EV (MG4 & ZS EV)
                </Link>
              </li>
              <li>
                <Link href="/electric-cars/honri" className="hover:text-blue-400 transition-colors">
                  Honri VE (Under 50 Lakh)
                </Link>
              </li>
              <li>
                <Link href="/electric-cars/kia" className="hover:text-blue-400 transition-colors">
                  KIA EV5 & EV9
                </Link>
              </li>
            </ul>
          </div>

          {/* Infrastructure & Cities */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Charging Directory
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/charging-stations/karachi" className="hover:text-blue-400 transition-colors">
                  EV Chargers in Karachi
                </Link>
              </li>
              <li>
                <Link href="/charging-stations/lahore" className="hover:text-blue-400 transition-colors">
                  EV Chargers in Lahore
                </Link>
              </li>
              <li>
                <Link href="/charging-stations/islamabad" className="hover:text-blue-400 transition-colors">
                  EV Chargers in Islamabad
                </Link>
              </li>
              <li>
                <Link href="/charging-stations/m2-motorway" className="hover:text-blue-400 transition-colors">
                  M2 Motorway Fast Chargers
                </Link>
              </li>
              <li>
                <Link href="/ev-policy/pakistan" className="hover:text-blue-400 transition-colors">
                  NEV Policy 2025-2030 Customs Duty
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* High-Intent Search Queries Keyword Index */}
        <div className="py-6 border-b border-slate-800 text-[11px] leading-relaxed text-slate-500">
          <p className="font-semibold text-slate-300 mb-2">High-Intent Pakistan EV Topics & Queries:</p>
          <p>
            electric cars in pakistan • EV prices in pakistan • cheapest electric car in pakistan • electric car under 50 lakh • electric car under 1 crore • buy electric car karachi • buy electric car lahore • EV financing pakistan bank rates • BYD Atto 3 price in pakistan • BYD Seal range specs pakistan • Deepal S07 price pakistan • Deepal L07 review • MG4 electric price pakistan • MG ZS EV battery warranty • KIA EV5 price pakistan • Honri VE 2.0 price and range • EV vs petrol running cost pakistan • EV charging cost per unit pakistan • cost per km electric car vs corolla civic • 5 year total cost of ownership EV pakistan • K-Electric / LESCO EV charging rate per unit • EV charging stations in Karachi • EV charging stations in Lahore • M2 motorway EV fast chargers • Sindh electric vehicle policy tax exemption • NEV policy Pakistan 2025-2030 customs duty
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} PakEVFinder. All rights reserved. Built for Pakistan EV Buyers & Owners.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Verified Price Index</span>
            <span>•</span>
            <span>AEO / GEO Engine Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
