import React from 'react';
import { Info } from 'lucide-react';

interface DirectAnswerBlockProps {
  title?: string;
  summary: string;
  keyFacts?: { label: string; value: string }[];
}

export function DirectAnswerBlock({
  title = 'Summary & Verdict',
  summary,
  keyFacts,
}: DirectAnswerBlockProps) {
  return (
    <section
      role="region"
      aria-label={title}
      className="rounded-lg border border-gray-200 border-l-4 border-l-blue-600 bg-gray-50 p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 text-blue-700 font-semibold text-[11px] uppercase tracking-wider mb-2">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>{title}</span>
      </div>

      <p className="text-[#111114] text-xs sm:text-sm leading-relaxed">
        {summary}
      </p>

      {keyFacts && keyFacts.length > 0 && (
        <dl className="mt-3.5 pt-3 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {keyFacts.map((fact, index) => (
            <div key={index} className="bg-white p-2.5 rounded border border-gray-200">
              <dt className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5">{fact.label}</dt>
              <dd className="font-semibold text-[#111114] tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
