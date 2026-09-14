import React from 'react';
import Link from 'next/link';
import { GitCompare, Sparkles, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

interface MatchupItem {
  title: string;
  tag: string;
  description: string;
  vehicles: string[];
  url: string;
}

const POPULAR_MATCHUPS: MatchupItem[] = [
  {
    title: 'New Arrivals: Hybrids & Imports',
    tag: 'Trending',
    description: 'Haval H6 HEV vs Chery Tiggo 7 Pro PHEV vs MG HS PHEV',
    vehicles: ['GWM Haval H6 HEV', 'Chery Tiggo 7 Pro', 'MG HS PHEV'],
    url: '/compare?v1=gwm-haval-h6-hev&v2=chery-tiggo-7-pro-phev&v3=mg-hs-phev',
  },
  {
    title: 'Electric SUVs (C-Segment Battle)',
    tag: 'Popular',
    description: 'BYD Atto 3 vs Changan Deepal S07 vs Omoda E5',
    vehicles: ['BYD Atto 3', 'Deepal S07', 'Omoda E5'],
    url: '/compare?v1=byd-atto-3&v2=deepal-s07&v3=omoda-e5',
  },
  {
    title: 'REEVs vs PHEVs: Range-Extender Shootout',
    tag: 'Long Range',
    description: 'Forthing Friday REEV vs Chery Tiggo 7 PHEV vs Changan Hunter REEV',
    vehicles: ['Forthing Friday REEV', 'Chery Tiggo 7 PHEV', 'Changan Hunter REEV'],
    url: '/compare?v1=forthing-friday-reev&v2=chery-tiggo-7-pro-phev&v3=changan-nevo-hunter-reev',
  },
  {
    title: 'Urban Microcar Showdown',
    tag: 'Budget EV',
    description: 'Honri VE 2.0 vs Gugo Gigi EV vs JMEV EV3',
    vehicles: ['Honri VE 2.0', 'Gugo Gigi EV', 'JMEV EV3'],
    url: '/compare?v1=honri-ve-2&v2=gugo-gigi-ev&v3=jmev-ev3',
  },
];

export function PopularMatchups() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Popular 3-Way Matchups
            </h3>
            <p className="text-[11px] text-slate-500">
              Curated head-to-head comparisons of the most researched models in Pakistan.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {POPULAR_MATCHUPS.map((matchup) => (
          <Link
            key={matchup.title}
            href={matchup.url}
            className="group p-4 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-blue-300 rounded-2xl transition-all shadow-xs hover:shadow flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {matchup.tag}
                </span>
                <GitCompare className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {matchup.title}
              </h4>

              <div className="space-y-1 pt-1">
                {matchup.vehicles.map((veh, i) => (
                  <div key={veh} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="w-4 text-[10px] font-bold text-slate-400">{i + 1}.</span>
                    <span className="truncate">{veh}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:text-blue-800">
              <span>Compare 3 Cars</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
