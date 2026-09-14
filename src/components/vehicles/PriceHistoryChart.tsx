'use client';

import React from 'react';
import { VehiclePrice } from '@/lib/types';
import { formatPKR, formatDate } from '@/lib/verification';
import { History, TrendingUp, AlertCircle, ExternalLink } from 'lucide-react';

interface PriceHistoryChartProps {
  prices: VehiclePrice[];
}

export function PriceHistoryChart({ prices }: PriceHistoryChartProps) {
  if (!prices || prices.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-lg text-center text-gray-500">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="text-xs font-medium text-gray-700">No historical price notifications logged yet.</p>
        <p className="text-[11px] text-gray-400 mt-1">
          Historical ex-factory revisions are logged when distributors publish updated price circulars.
        </p>
      </div>
    );
  }

  // Sort by date descending
  const sortedPrices = [...prices].sort(
    (a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime()
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-blue-700" />
          <h3 className="text-xs font-bold text-[#111114] uppercase tracking-wider">
            Price Notification History
          </h3>
        </div>
        <span className="text-[11px] text-gray-500 tabular-nums">
          {sortedPrices.length} {sortedPrices.length === 1 ? 'Notice' : 'Notices'} Logged
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="relative border-l border-blue-200 ml-3 space-y-4">
          {sortedPrices.map((p, idx) => {
            const isLatest = idx === 0;
            return (
              <div key={p.id} className="relative pl-5">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border ${
                    isLatest
                      ? 'bg-blue-600 border-white ring-2 ring-blue-100'
                      : 'bg-white border-gray-400'
                  }`}
                />

                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 tabular-nums">
                        {formatDate(p.effective_date)}
                      </span>
                      {isLatest && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          Current
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 uppercase">
                        {p.price_type === 'ex_factory' ? 'Ex-Factory' : 'On-Road'}
                      </span>
                    </div>

                    <div className="text-base font-bold text-[#111114] tabular-nums mt-0.5">
                      {formatPKR(p.amount_pkr, true)}
                    </div>
                  </div>

                  {p.source_url && (
                    <a
                      href={p.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-700 hover:underline inline-flex items-center gap-1 self-start sm:self-center font-medium"
                    >
                      <span>Notice</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-500 flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-blue-700 shrink-0" />
        <span>
          <strong>Append-Only Log:</strong> Price changes are logged as new records to maintain historical continuity.
        </span>
      </div>
    </div>
  );
}
