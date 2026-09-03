import React from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import { Zap, ShieldCheck, Target, Award, Users, Globe } from 'lucide-react';

export const metadata = {
  title: 'About PakevFinder — Pakistan EV & Vehicle Discovery Platform',
  description: 'Learn about PakevFinder, Pakistan dedicated automotive intelligence, total cost of ownership, and EV discovery platform.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Product Overview</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About PakevFinder.com
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          PakevFinder is Pakistan&apos;s independent automotive technology platform, built to empower car buyers with transparent battery specifications, verified distributor tariffs, and 5-year total cost of ownership (TCO) tools.
        </p>
      </div>

      <AnswerFirstSummary
        answer="PakevFinder.com ('Find. Compare. Decide.') is an independent automotive intelligence platform for Pakistan. We index verified electric vehicles, plug-in hybrids, and new energy vehicles to provide transparent pricing, real-world range estimation, charging station locations, and lifetime cost of ownership calculations."
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Product Transparency Standard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-2.5 rounded-2xl w-fit">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Our Product Mission</h3>
          <p className="text-slate-300 leading-relaxed">
            Buying an electric vehicle involves multi-million PKR financial decisions. PakevFinder removes guesswork by providing empirical range estimations, battery degradation projections, and exact fuel savings vs petrol sedans.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-2.5 rounded-2xl w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Data Provenance Guarantee</h3>
          <p className="text-slate-300 leading-relaxed">
            Every specification and price log is tracked with source provenance, publication confidence scores, and verification timestamps. We explicitly flag unverified data.
          </p>
        </div>
      </div>
    </div>
  );
}
