import React from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import { Award, ShieldCheck, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'PakEVFinder Value Score & Calculation Methodology',
  description: 'Transparent explanation of PakEVFinder scoring methodology, energy efficiency calculations, and verified price tracking algorithms.',
};

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Transparent Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Value Score & Calculation Methodology
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          PakEVFinder evaluates electric vehicles using transparent, empirical formulas across 5 key automotive categories.
        </p>
      </div>

      <AnswerFirstSummary
        answer="The PakEVFinder Value Score is calculated independently from 0 to 10 by evaluating 5 weighted metrics: Range Efficiency (25%), Fast DC Charging (20%), Performance (20%), Value for Money (20%), and Warranty Coverage (15%). No commercial sponsor can alter scoring logic."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Open Methodology Standard"
      />

      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4 text-xs">
        <h2 className="text-lg font-bold text-white">Category Scoring Weights</h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>WLTP Range Efficiency (25% Weight):</strong> Evaluates usable kWh battery pack output vs official WLTP range claims under Pakistan summer climate conditions.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Fast Charging Capabilities (20% Weight):</strong> Rewards 10-80% DC fast charging times under 35 minutes and peak charging power above 100 kW.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Motor Performance (20% Weight):</strong> Measures horsepower output, peak torque (Nm), and 0-100 km/h acceleration.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Value for Money (20% Weight):</strong> Compares ex-factory PKR price per km of WLTP range delivered.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Warranty Coverage (15% Weight):</strong> Evaluates distributor battery warranty (minimum 8 years / 160,000 km).</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
