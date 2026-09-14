'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  keyTakeaway: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Can an electric vehicle drive from Lahore to Islamabad on the M-2 Motorway non-stop?',
    answer:
      'Yes, for vehicles with 500+ km WLTP range (e.g., BYD Seal 82.5 kWh, Deepal L07). However, high-speed motorway cruising (110–120 km/h) combined with continuous summer air conditioning (38°C+) increases battery consumption by ~22-25%. For models with 400–450 km WLTP (BYD Atto 3, Deepal S07, MG4 EV), a single 25-minute fast-charging stop at Bhera Service Area (km 195) is recommended to maintain a safe 15% battery buffer.',
    keyTakeaway: 'High-speed cruising + A/C derates range by ~22%. Bhera (km 195) offers 120 kW dual DC fast charging.',
  },
  {
    id: 'faq-2',
    question: 'How does the running cost of an EV compare to a petrol car per kilometer in Pakistan?',
    answer:
      'An electric car costs approximately PKR 7 to PKR 11 per kilometer on standard domestic grid tariffs (PKR 45–65/kWh) and virtually PKR 0 to PKR 3/km when paired with a home solar net-metering system. In contrast, a 1.5L or 1.8L petrol sedan averaging 11 km/L at current petrol prices (PKR ~265/L) costs PKR 24 to PKR 26 per kilometer, saving an EV driver over PKR 350,000 to PKR 500,000 annually at 20,000 km/year.',
    keyTakeaway: 'EVs cost PKR 7–11/km vs. PKR 24–26/km for petrol, cutting monthly fuel expenses by over 60–75%.',
  },
  {
    id: 'faq-3',
    question: 'How do power outages (load-shedding) affect home electric vehicle charging?',
    answer:
      'Most Pakistani EV owners install a 7 kW AC Level 2 Wallbox powered through their existing net-metered solar inverter or dedicated 3-phase grid connection. Since a standard commuter battery (50–60 kWh) charges from 20% to 80% in approximately 5 to 6 hours, overnight charging during off-peak hours (10:00 PM to 6:00 AM) avoids daily grid interruptions entirely.',
    keyTakeaway: 'Overnight off-peak charging (10 PM – 6 AM) or home solar completely mitigates urban power outages.',
  },
  {
    id: 'faq-4',
    question: 'Which charging connector standard should I choose in Pakistan — CCS2 or GB/T?',
    answer:
      'Official distributor models (BYD via Mega Motor Co, Deepal via Master Changan, MG Pakistan, KIA, and Audi) ship with European standard Type 2 (AC) and CCS2 (Combined Charging System 2 DC). Most public motorway fast-chargers (PSO EV, ChargeIn, Shell Recharge) feature dual guns with both CCS2 and GB/T (the Chinese national standard), ensuring seamless compatibility for both official and private imports.',
    keyTakeaway: 'Both CCS2 and GB/T are widely supported at motorway stations; CCS2 is the official distributor standard.',
  },
  {
    id: 'faq-5',
    question: 'What are the current import duties and excise tax incentives for EVs in Pakistan?',
    answer:
      'Under the National Electric Vehicle Policy (NEVP), Completely Built-Up (CBU) electric vehicles benefit from a reduced Customs Duty of 25% (compared to 50–100% on petrol cars) and a reduced 1% Sales Tax for batteries up to 50 kWh. Local Completely Knocked Down (CKD) assembly plants also enjoy 1% customs duty on non-localized EV component imports to encourage local industrialization.',
    keyTakeaway: 'CBU EVs enjoy 25% customs duty (vs 100% for ICE) and 1% sales tax under official NEVP incentives.',
  },
  {
    id: 'faq-6',
    question: 'How does extreme Pakistani summer heat (42°C+) affect battery longevity and range?',
    answer:
      'Modern EVs sold in Pakistan utilize liquid-cooled battery thermal management systems (such as BYD Blade LFP and CATL liquid-cooled packs) that actively circulate coolant through internal heat exchangers. While driving in 42°C heat with heavy cabin air conditioning reduces instantaneous cruising range by ~12-16%, the active thermal regulation prevents battery cell degradation and maintains battery health warranties of up to 8 years / 160,000 km.',
    keyTakeaway: 'Liquid-cooled thermal management protects battery chemistry; 8-year manufacturer warranties apply.',
  },
];

export function HomeFaqAccordion() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Going Electric in Pakistan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Essential facts on motorway travel, running costs, home solar charging, and import taxes.
          </p>
        </div>

        <Link
          href="/faqs"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
        >
          <span>View all 15 FAQs &rarr;</span>
        </Link>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-blue-500/80 bg-blue-50/20 shadow-xs'
                  : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  {faq.question}
                </span>
                <span
                  className={`p-1.5 rounded-xl text-slate-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 bg-blue-100 text-blue-700' : 'bg-slate-200/60'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 mt-1 space-y-3">
                  <p className="pt-2">{faq.answer}</p>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{faq.keyTakeaway}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
