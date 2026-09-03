'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GlobalSearchModal from '@/components/search/GlobalSearchModal';
import { Zap, Search, ArrowRightLeft, Building2, Compass, BookOpen, Menu, X, ShieldCheck, Calculator, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const navLinks = [
    { name: 'Vehicles', href: '/vehicles', icon: Zap },
    { name: 'Compare', href: '/compare', icon: ArrowRightLeft },
    { name: 'Calculators', href: '/calculators/total-cost-of-ownership', icon: Calculator },
    { name: 'Find My EV', href: '/find-an-ev', icon: Compass },
    { name: 'Prices', href: '/prices', icon: ShieldCheck },
    { name: 'Brands', href: '/brands', icon: Building2 },
    { name: 'Guides', href: '/articles', icon: BookOpen },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/80">
        {/* Ticker Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-emerald-950 border-b border-slate-800/60 text-[11px] font-semibold py-1 px-4 text-center text-slate-300 flex items-center justify-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            PAKISTAN AUTOMOTIVE INTELLIGENCE
          </span>
          <span className="hidden sm:inline">Verified Specs, Real-World Range & 5-Year Ownership Calculators</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Pakev<span className="gradient-text-electric">Finder</span>
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 -mt-1">
                Find. Compare. Decide.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Trigger & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Search...</span>
            </button>

            <Link
              href="/find-an-ev"
              className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Matchmaker</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden bg-slate-900 text-slate-300 p-2 rounded-xl border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Overlay */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
