'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Car,
  MapPin,
  Navigation,
  Sparkles,
  GitCompare,
  Newspaper,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/cars', label: 'Cars', icon: Car, matches: ['/cars', '/vehicles'] },
    { href: '/charging', label: 'Charging', icon: MapPin, matches: ['/charging', '/charging-stations'] },
    { href: '/plan-a-route', label: 'Plan a Route', icon: Navigation, matches: ['/plan-a-route', '/route-planner'] },
    { href: '/car-match', label: 'Car Match', icon: Sparkles, matches: ['/car-match'] },
    { href: '/compare', label: 'Compare', icon: GitCompare, matches: ['/compare'] },
    { href: '/news', label: 'News', icon: Newspaper, matches: ['/news', '/guides'] },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo variant="dark" size="sm" showTagline />
        </Link>

        {/* Desktop Nav: [Cars] [Charging] [Plan a Route] [Car Match] [Compare] [News] */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.matches.some((m) =>
              m === '/' ? pathname === '/' : pathname.startsWith(m)
            );
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span>{link.label}</span>
                {link.href === '/car-match' && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-cyan-500 text-white leading-tight">
                    QUIZ
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: [Pakistan 🇵🇰] [Get Listed / Submit] */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Country Flag Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/90 text-xs font-semibold text-slate-700 select-none">
            <span className="text-sm leading-none">🇵🇰</span>
            <span className="text-[11px] text-slate-600 font-bold">Pakistan</span>
          </div>

          {/* Submit / Get Listed Button */}
          <Link
            href="/charging-stations#submit"
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-full shadow-xs hover:shadow transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Get Listed</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
              <span>🇵🇰</span>
              <span>Pakistan Market</span>
            </div>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.matches.some((m) =>
              m === '/' ? pathname === '/' : pathname.startsWith(m)
            );
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.href === '/car-match' && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-cyan-500 text-white">
                    NEW QUIZ
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/charging-stations#submit"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Get Listed / Submit Station</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
