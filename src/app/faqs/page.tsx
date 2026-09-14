import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs) — PakEVFinder',
  description: 'Common questions about buying, charging, and running electric cars in Pakistan.',
};

const FAQS = [
  {
    q: 'How much does it cost to charge an EV at home in Pakistan?',
    a: 'Home charging costs depend on your domestic NEPRA electricity tariff. Charging off-peak (typically 10 PM to 6 AM) at approx. Rs. 40–45/unit (kWh) means a 60 kWh battery costs approx. Rs. 2,400 to 2,700 for a 400 km charge — roughly Rs. 6 to 7 per kilometer. If you have rooftop net-metered solar, your effective charging cost is near zero.',
  },
  {
    q: 'What is the difference between WLTP, NEDC, and real-world range in Pakistan?',
    a: 'NEDC is an older, highly optimistic lab test cycle (often 25–35% higher than real life). WLTP is more realistic. In Pakistan’s summer climate (38°C to 45°C), running full cabin air conditioning and highway speeds (120 km/h on M-2/M-3) typically reduces range by 15% to 25% compared to the official WLTP rating.',
  },
  {
    q: 'Can I drive an EV between Lahore and Islamabad (M-2)?',
    a: 'Yes. The distance is approx. 375 km. Vehicles with 60+ kWh batteries (such as BYD Seal, BYD Atto 3, Deepal S07/L07) can complete the trip with one brief top-up at Bhera Service Area (Northbound or Southbound), where DC fast chargers are operating. You can use our Route Planner to simulate this trip.',
  },
  {
    q: 'What charging connector standard is used in Pakistan: CCS2 or GB/T?',
    a: 'Both standards exist in Pakistan. European and official Pakistani distributor imports (BYD, MG, Deepal, Audi) predominantly feature CCS2 for DC fast charging and Type 2 for AC home charging. Direct Chinese imports (e.g. gray-market imports) use the Chinese GB/T standard. GB/T to CCS2 adapters are available, but official CCS2 vehicles plug directly into national highway fast chargers.',
  },
  {
    q: 'What are the import duties and taxes on electric cars in Pakistan?',
    a: 'Under Pakistan’s National Electric Vehicle Policy (NEVP), completely built-up (CBU) pure electric vehicles (BEVs) enjoy reduced customs duty (typically 25% for smaller batteries) and 1% sales tax compared to conventional internal combustion vehicles. However, advance income tax and withholding tax still apply depending on whether the buyer is an active tax filer or non-filer.',
  },
  {
    q: 'Are vehicle prices on PakEVFinder official ex-factory prices?',
    a: 'Yes, our primary price quotes reflect official distributor ex-factory prices announced in Pakistan. On-road prices are clearly marked as estimates because provincial registration fees, number plate charges, and withholding taxes vary by province (Punjab, Sindh, Islamabad) and tax filer status.',
  },
  {
    q: 'How does PakEVFinder source its data?',
    a: 'We independently compile vehicle specifications from official manufacturer specification manuals, distributor press circulars, and verified local tariffs. We do not invent numbers or scrape competitor databases; if an upcoming car lacks confirmed specs, we leave the fields blank.',
  },
];

export default function FAQsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114] mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-gray-500">
          Everything you need to know about EV specifications, charging, and economics in Pakistan.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="p-5 rounded-lg bg-white border border-gray-200 space-y-2"
          >
            <h3 className="text-base font-semibold text-[#111114] flex items-start gap-2.5">
              <span className="text-blue-700 font-mono text-sm shrink-0">0{idx + 1}.</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed pl-7">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-[#111114]">Have a specific question not answered here?</h4>
          <p className="text-xs text-gray-500 mt-1">Our editorial team continuously updates guides and vehicle facts.</p>
        </div>
        <Link
          href="/contact"
          className="text-xs font-semibold px-4 py-2 bg-white hover:bg-gray-100 text-blue-700 border border-gray-300 rounded-md transition-colors shrink-0"
        >
          Ask Editorial
        </Link>
      </div>
    </div>
  );
}
