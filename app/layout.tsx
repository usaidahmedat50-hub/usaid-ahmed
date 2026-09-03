import React from 'react';
import Link from 'next/link';
import '@/app/globals.css';
import Navbar from '@/components/layout/Navbar';
import StickyCompareTray from '@/components/comparison/StickyCompareTray';
import { Zap, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'PakevFinder — Pakistan EV & Vehicle Discovery Platform',
  description: 'Pakistan premier automotive intelligence platform for electric vehicles, plug-in hybrids, battery capacity, range specs, and side-by-side comparison.',
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
    <html lang="en" className="h-full dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />

        {/* Main Content Container */}
        <main className="flex-1">{children}</main>

        {/* Global Sticky Comparison Tray */}
        <StickyCompareTray />

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-800/80 mt-20 text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white p-2 rounded-xl">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-lg font-black text-white tracking-tight">PakevFinder</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Independent automotive intelligence, verified distributor tariffs, and EV specification comparison platform for Pakistan.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider block mb-1">Discovery & Tools</span>
                <Link href="/vehicles" className="text-slate-400 hover:text-white block transition-colors">All Vehicles</Link>
                <Link href="/find-an-ev" className="text-slate-400 hover:text-white block transition-colors">EV Matchmaker</Link>
                <Link href="/compare" className="text-slate-400 hover:text-white block transition-colors">Comparison Engine</Link>
                <Link href="/calculators/total-cost-of-ownership" className="text-slate-400 hover:text-white block transition-colors">TCO Calculator</Link>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider block mb-1">Directories & Guides</span>
                <Link href="/prices" className="text-slate-400 hover:text-white block transition-colors">EV Price Directory</Link>
                <Link href="/charging-stations" className="text-slate-400 hover:text-white block transition-colors">Charging Stations</Link>
                <Link href="/ev-policy/pakistan" className="text-slate-400 hover:text-white block transition-colors">Pakistan EV Policy</Link>
                <Link href="/articles" className="text-slate-400 hover:text-white block transition-colors">EV Buyer Guides</Link>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider block mb-1">Trust & Transparency</span>
                <Link href="/methodology" className="text-slate-400 hover:text-white block transition-colors">Value Score Methodology</Link>
                <Link href="/about" className="text-slate-400 hover:text-white block transition-colors">About PakevFinder</Link>
                <p className="text-slate-400 text-xs leading-relaxed pt-1">
                  All vehicle data is verified against official manufacturer tariffs. Unverified claims are explicitly flagged.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800/60 flex justify-between items-center flex-wrap gap-4 text-slate-500">
              <span>&copy; 2026 PakevFinder.com. All rights reserved.</span>
              <span>https://pakevfinder.com</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
