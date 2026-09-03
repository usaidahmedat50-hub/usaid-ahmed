import React from 'react';
import Link from 'next/link';
import '@/app/globals.css';
import { Zap, Search, ShieldCheck, ArrowRightLeft, Building2, BookOpen, Compass, Calculator } from 'lucide-react';

export const metadata = {
  title: 'PakevFinder — Electric Vehicle Platform Pakistan',
  description: 'Discover, compare, and analyze electric vehicle specs, battery capacity, range, and prices in Pakistan.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        {/* Top Announcement Bar */}
        <div className="bg-slate-900 text-white text-[11px] font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 border-b border-slate-800">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
            2026 Directory
          </span>
          <span>Verified Electric Vehicle Specifications & Distributor Prices in Pakistan</span>
        </div>

        {/* Main Navbar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Pakev<span className="text-blue-600">Finder</span>
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
              <Link href="/vehicles" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Vehicles
              </Link>
              <Link href="/compare" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                Compare
              </Link>
              <Link href="/brands" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                Brands
              </Link>
              <Link href="/categories" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-purple-600" />
                Categories
              </Link>
              <Link href="/articles" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                Guides
              </Link>
            </nav>

            {/* Admin & Action CTAs */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all border border-slate-200 hidden sm:block"
              >
                Admin
              </Link>
              <Link
                href="/compare"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1"
              >
                Compare EVs
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 text-white p-2 rounded-xl">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-black tracking-tight">PakevFinder</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Independent automotive intelligence, price tracking, and EV specification comparison platform for Pakistan.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-white uppercase tracking-wider block mb-1">Directory</span>
                <Link href="/vehicles" className="text-slate-400 hover:text-white block">All Electric Vehicles</Link>
                <Link href="/brands" className="text-slate-400 hover:text-white block">Automotive Brands</Link>
                <Link href="/categories" className="text-slate-400 hover:text-white block">Vehicle Categories</Link>
                <Link href="/compare" className="text-slate-400 hover:text-white block">Comparison Engine</Link>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-white uppercase tracking-wider block mb-1">Knowledge</span>
                <Link href="/articles" className="text-slate-400 hover:text-white block">EV Cost Analysis</Link>
                <Link href="/guides" className="text-slate-400 hover:text-white block">Home Charging Guide</Link>
                <Link href="/faq" className="text-slate-400 hover:text-white block">Frequently Asked Questions</Link>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-white uppercase tracking-wider block mb-1">Data Verification</span>
                <p className="text-slate-400 leading-relaxed">
                  All vehicle data is verified against official manufacturer press releases and distributor tariffs.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex justify-between items-center flex-wrap gap-4 text-xs text-slate-400">
              <span>&copy; 2026 PakevFinder.com. All rights reserved.</span>
              <span className="text-slate-500">https://pakevfinder.com</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
