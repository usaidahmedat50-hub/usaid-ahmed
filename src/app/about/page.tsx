import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Zap, MapPin, GitCompare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — PakEVFinder',
  description: 'Independent electric vehicle specification and price directory for Pakistan.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114] mb-2">
          About PakEVFinder
        </h1>
        <p className="text-xs text-gray-500">
          Independent EV & Hybrid Vehicle Intelligence for Pakistan
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-4">
          <p>
            Pakistan&apos;s electric vehicle transition is accelerating rapidly. With official entrances from global manufacturers such as BYD, MG, Deepal (Changan), GWM (Haval), GAC, and local assemblers, buyers face a completely new set of considerations: battery chemistries, real-world highway range versus lab cycles (WLTP/NEDC), charging connector standards (CCS2 vs GB/T), and fluctuating electricity tariffs.
          </p>
          <p>
            Historically, Pakistani buyers have had to rely on fragmented manufacturer portals, dealer WhatsApp circles, and unsourced social media rumors. PakEVFinder was created to solve this by providing a single, clean, independent directory of vehicle specifications, ex-factory pricing, on-road cost estimates, charging locations, and motorway travel planning.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          <div className="p-5 rounded-lg bg-white border border-gray-200 space-y-2">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#111114]">Independent Sourcing</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We are not a car dealership, distributor agent, or charging network operator. We take no commissions on vehicle purchases or equipment installations.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-gray-200 space-y-2">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-2">
              <GitCompare className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#111114]">Real Comparisons</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Side-by-side spec alignment across battery sizes, usable range, motor output, charging speeds, and warranties with numbers aligned in tabular format.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-gray-200 space-y-2">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-2">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#111114]">Curated Charging Map</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Community and operator-sourced charging station directory covering urban hubs and critical motorway rest areas across Pakistan.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-gray-200 space-y-2">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-2">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#111114]">Zero Guesswork Policy</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              If an upcoming model does not have a confirmed price or specification from its manufacturer, we leave the field empty rather than publishing plausible guesses.
            </p>
          </div>
        </section>

        <section className="space-y-3 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-[#111114]">Get in Touch</h2>
          <p>
            Have a price revision notice from a distributor, a new charging point submission, or editorial feedback? Visit our{' '}
            <Link href="/contact" className="text-blue-700 hover:underline">
              Contact page
            </Link>{' '}
            or submit charging points via our{' '}
            <Link href="/charging-stations#submit" className="text-blue-700 hover:underline">
              Charging Station Submission form
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
