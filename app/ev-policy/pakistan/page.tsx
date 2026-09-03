import React from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import { ShieldCheck, FileText, CheckCircle2, TrendingUp, Building2, Landmark } from 'lucide-react';

export const metadata = {
  title: 'Pakistan NEV Policy 2025–2030 Explained — Tax & Import Benefits',
  description: 'Complete breakdown of Pakistan National Electric Vehicle Policy incentives, 1% GST tax reduction, CBU import duties, and charger subsidies.',
};

export default function PakistanEvPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Landmark className="w-4 h-4 text-emerald-400" />
          <span>Government Regulatory Policy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Pakistan National EV Policy 2025–2030 Guide
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Comprehensive guide to government tax exemptions, 1% Sales Tax incentives, reduced import duties for CKD/CBU electric vehicles, and charger subsidies.
        </p>
      </div>

      <AnswerFirstSummary
        answer="Under Pakistan's National EV Policy (NEVP), battery electric vehicles (BEVs) with battery capacities under 50 kWh enjoy 1% Sales Tax (compared to 18% standard GST for petrol cars). CKD manufacturing kits import at 1% customs duty, while public fast charger equipment is exempt from customs duties to accelerate nationwide infrastructure adoption."
        verifiedDate="Feb 2026"
        sourceName="Ministry of Industries & Production (MoIP) Tariffs"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-2.5 rounded-2xl w-fit">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">1% Sales Tax Benefit (GST Reduction)</h3>
          <p className="text-slate-300 leading-relaxed">
            Local assembly and import of small to mid-size BEVs receive 1% Sales Tax, saving buyers between PKR 1,000,000 and PKR 2,500,000 compared to petrol luxury tax tariffs.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-2.5 rounded-2xl w-fit">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">CKD Assembly Customs Duty Relief</h3>
          <p className="text-slate-300 leading-relaxed">
            Automotive assemblers (such as BYD/Hubco and Deepal/Master Motors) import non-localized CKD electric vehicle parts at 1% customs duty to establish local manufacturing hubs.
          </p>
        </div>
      </div>
    </div>
  );
}
