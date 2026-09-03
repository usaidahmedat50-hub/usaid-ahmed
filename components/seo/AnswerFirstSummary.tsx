import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface AnswerFirstSummaryProps {
  answer: string;
  verifiedDate?: string;
  sourceName?: string;
}

export default function AnswerFirstSummary({
  answer,
  verifiedDate = 'Feb 2026',
  sourceName = 'PakevFinder Automotive Data Verification Engine',
}: AnswerFirstSummaryProps) {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white rounded-2xl p-5 border border-blue-800/40 shadow-sm space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-blue-400 font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Direct Answer (AEO / GEO Verified Summary)</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified {verifiedDate}</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
        {answer}
      </p>

      <div className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-800 flex items-center justify-between">
        <span>Source Attribution: {sourceName}</span>
        <span>https://pakevfinder.com</span>
      </div>
    </div>
  );
}
