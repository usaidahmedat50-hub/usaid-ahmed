'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, ChevronDown, Menu, X, Calculator, MapPin, Compass, FileText, Scale, Search, Navigation } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [calcDropdown, setCalcDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/electric-cars?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top NEV Policy Editorial Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center font-medium">
        <span className="inline-block mr-2 font-bold bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
          NEV POLICY 2025-2030
        </span>
        1% Customs Duty & Sales Tax Exemptions Active for EVs in Pakistan.{' '}
        <Link href="/ev-policy/pakistan" className="underline hover:text-emerald-400 font-semibold transition-colors">
          Read Official Tax Breakdown &rarr;
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-sm">
              <Zap className="w-5 h-5 fill-white stroke-none" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tight leading-none">
                Pak<span className="text-blue-600">EV</span>Finder
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Find. Compare. Calculate.
              </span>
            </div>
          </Link>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search BYD, Deepal, MG4..."
              className="w-full bg-slate-100 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
            <Link
              href="/electric-cars"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              EV Directory
            </Link>

            <Link
              href="/compare"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2"
            >
              <Scale className="w-4 h-4 text-amber-600" />
              Compare EVs
            </Link>

            {/* Calculators Dropdown */}
            <div className="relative" onMouseLeave={() => setCalcDropdown(false)}>
              <button
                onMouseEnter={() => setCalcDropdown(true)}
                onClick={() => setCalcDropdown(!calcDropdown)}
                className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2 focus:outline-none"
              >
                <Calculator className="w-4 h-4 text-blue-600" />
                Calculators
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {calcDropdown && (
                <div
                  onMouseEnter={() => setCalcDropdown(true)}
                  className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50"
                >
                  <Link
                    href="/calculators/ev-vs-petrol"
                    className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    EV vs Petrol Savings
                  </Link>
                  <Link
                    href="/calculators/ev-running-cost"
                    className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    Monthly Running Cost (DISCO Tariff)
                  </Link>
                  <Link
                    href="/calculators/ev-charging-cost"
                    className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    Home AC vs DC Fast Charging Cost
                  </Link>
                  <Link
                    href="/calculators/total-cost-of-ownership"
                    className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    5-Year Ownership TCO
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/charging-stations"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2"
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              Charging Map
            </Link>

            <Link
              href="/plan-a-route"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2 text-blue-700 font-extrabold"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
              Route Planner
            </Link>

            <Link
              href="/ev-policy/pakistan"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              EV Policy
            </Link>
          </nav>

          {/* Primary Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/find-an-ev"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Smart EV Matcher &rarr;
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-slate-900 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 text-sm">
          <Link
            href="/electric-cars"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-800 font-bold"
          >
            EV Directory
          </Link>
          <Link
            href="/compare"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-800 font-bold"
          >
            Compare EVs
          </Link>

          <div className="py-2 border-y border-slate-100 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Calculators
            </span>
            <Link
              href="/calculators/ev-vs-petrol"
              onClick={() => setIsOpen(false)}
              className="block pl-2 py-1 text-slate-600 text-xs font-medium"
            >
              EV vs Petrol Savings
            </Link>
            <Link
              href="/calculators/ev-running-cost"
              onClick={() => setIsOpen(false)}
              className="block pl-2 py-1 text-slate-600 text-xs font-medium"
            >
              Monthly Running Cost
            </Link>
            <Link
              href="/calculators/ev-charging-cost"
              onClick={() => setIsOpen(false)}
              className="block pl-2 py-1 text-slate-600 text-xs font-medium"
            >
              Home AC vs DC Charging Cost
            </Link>
            <Link
              href="/calculators/total-cost-of-ownership"
              onClick={() => setIsOpen(false)}
              className="block pl-2 py-1 text-slate-600 text-xs font-medium"
            >
              5-Year Ownership TCO
            </Link>
          </div>

          <Link
            href="/charging-stations"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-800 font-bold"
          >
            Charging Stations Map
          </Link>

          <Link
            href="/plan-a-route"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-blue-700 font-extrabold"
          >
            Intercity Route Planner
          </Link>

          <Link
            href="/ev-policy/pakistan"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-800 font-bold"
          >
            EV Policy 2025-2030
          </Link>

          <Link
            href="/find-an-ev"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-blue-600 text-white font-bold py-2.5 rounded-xl shadow-sm"
          >
            Find My Ideal EV
          </Link>
        </div>
      )}
    </header>
  );
}
