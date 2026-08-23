import React from 'react';
import { CheckCircle2, Calendar, ShieldCheck } from 'lucide-react';

interface AnswerFirstSummaryProps {
  title?: string;
  answer: string;
  verifiedDate?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export default function AnswerFirstSummary({
  title = 'Quick Answer / Editorial Fact Summary',
  answer,
  verifiedDate = 'Feb 2026',
  sourceName = 'PakEVFinder Market Research & Official Distributor Data',
  sourceUrl,
}: AnswerFirstSummaryProps) {
  return (
    <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 my-6 text-slate-800 shadow-sm">
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-blue-200/80">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-full">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Verified: {verifiedDate}</span>
        </div>
      </div>
      <p className="text-slate-800 font-medium text-sm leading-relaxed">
        {answer}
      </p>
      <div className="mt-3 pt-2 flex items-center gap-2 text-xs text-slate-600 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Source:{' '}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-700 hover:text-blue-900 font-semibold"
            >
              {sourceName}
            </a>
          ) : (
            <strong className="text-slate-800 font-semibold">{sourceName}</strong>
          )}
        </span>
      </div>
    </div>
  );
}
