import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090D1A] text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission Statement */}
          <div className="space-y-3 md:col-span-1">
            <Logo variant="light" size="sm" showTagline />
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Pakistan&apos;s premier EV intelligence platform and route-planning ecosystem. Delivering verified ex-factory pricing, real summer motorway range modeling, and charging station infrastructure.
            </p>
            <p className="text-[11px] text-slate-500">
              Operated independently in Pakistan. Not affiliated with any vehicle dealership or charging network operator.
            </p>
          </div>

          {/* Group 1: Browse per 04-DESIGN.md */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3">
              Browse
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/vehicles" className="hover:text-blue-700 transition-colors">
                  All Vehicles
                </Link>
              </li>
              <li>
                <Link href="/car-match" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Car Match Quiz</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-700 transition-colors">
                  Compare Vehicles
                </Link>
              </li>
              <li>
                <Link href="/charging-stations" className="hover:text-blue-700 transition-colors">
                  Charging Map
                </Link>
              </li>
              <li>
                <Link href="/route-planner" className="hover:text-blue-700 transition-colors">
                  Plan a Route
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-blue-700 transition-colors">
                  Brands Lineup
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-blue-700 transition-colors">
                  Browse by Category
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 2: Get Listed per 04-DESIGN.md */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3">
              Get Listed
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/charging-stations#submit" className="hover:text-cyan-400 transition-colors">
                  Submit a Charging Station
                </Link>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500 cursor-not-allowed">
                <span>List a Home Charger</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">
                  Coming soon
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500 cursor-not-allowed">
                <span>Become an Installer</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">
                  Coming soon
                </span>
              </li>
            </ul>
          </div>

          {/* Group 3: Company per 04-DESIGN.md */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3">
              Company & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/guides" className="hover:text-cyan-400 transition-colors">
                  Guides & Research
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-cyan-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact Editorial
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar — No fabricated address/phone */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} PakEVFinder.com. Specifications and prices are indicative and compiled from official distributor publications.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
