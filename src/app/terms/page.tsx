import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions — PakEVFinder',
  description: 'Terms and conditions for using PakEVFinder vehicle directory, charging station map, and route planner.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114] mb-2">
          Terms & Conditions
        </h1>
        <p className="text-xs text-gray-500">
          Last updated: September 2026 • Independent EV Information Service for Pakistan
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <p>
          PakEVFinder is an independent information service about electric and hybrid vehicles in Pakistan, published at{' '}
          <span className="text-blue-700 font-medium">pakevfinder.com</span>. By using the site you agree to these terms. If you do not agree, please do not use it.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111114]">1. What PakEVFinder Is</h2>
          <p>
            PakEVFinder publishes a vehicle specification and price directory, a comparison tool, a charging-station directory and map, and a route planner. We are not a dealer, not a marketplace, and not an agent for any manufacturer, distributor, or charging operator. We do not sell vehicles or charging equipment on this site and take no commission on any purchase.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111114]">2. Vehicle Prices and Specifications</h2>
          <p>
            Specifications, prices, on-road cost estimates, and range figures are compiled from sources we identify per data point (manufacturer publications, official distributor pricing, and similar) and are indicative only. Figures can change without notice, and manufacturers/distributors may update specifications or pricing at any time. Always confirm the exact price, variant, features, and availability with the dealer or distributor before making a purchase decision. Nothing on PakEVFinder is an offer, a quote, or purchase advice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111114]">3. Charging Station Data and the Route Planner</h2>
          <p>
            Our charging station directory is built from a mix of our own research and user submissions, reviewed before publishing. Station details (location, connector type, power rating, operator, pricing) can change or go stale, and we do not guarantee real-time accuracy of station availability or status.
          </p>
          <p>
            The route planner&apos;s distance, duration, and suggested charging stops are estimates, generated from third-party routing data and our station directory. Actual driving range varies with speed, load, weather, air conditioning, terrain, and battery condition, and a route, road, or station may be unavailable when you arrive. Always plan with a safety margin and do not rely on a single charging stop, particularly on longer or less-served routes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111114]">4. Your Contributions</h2>
          <p>
            If you submit a charging station or other information to PakEVFinder, you confirm it is truthful, submitted in good faith, and that you have the right to share it. You grant PakEVFinder a non-exclusive right to publish, edit, aggregate, and remove it. We may reject, edit, or delete any submission at our discretion. Do not submit false information, spam, other people&apos;s personal information, or content unlawful in Pakistan.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111114]">5. Our Data and Content</h2>
          <p>
            The compilation of vehicle data, charging station listings, and other content on PakEVFinder is a database we have collected and curated, and it is protected as such. You may use the site for personal, non-commercial purposes. You may not scrape, bulk-extract, copy, or republish substantial parts of this data, or use it to build or train a competing dataset or service, without our written permission. Ordinary search-engine indexing and sharing links to pages are welcome.
          </p>
          <p>
            Separately, the written content, comparisons, guides, and page design on PakEVFinder are original works owned by PakEVFinder. Republishing them elsewhere, in whole or in part, needs our written permission. Quoting a short passage or a single figure in your own commentary is fine when you name PakEVFinder and link to the source page.
          </p>
          <p>
            Nothing here stops you from using what you read to decide which vehicle to buy or to share what you found with someone else — that&apos;s what the site is for.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111114]">6. No Warranties</h2>
          <p>
            The site and its content are provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind, express or implied, including accuracy, completeness, fitness for a particular purpose, or uninterrupted availability. To the maximum extent permitted by law, PakEVFinder is not liable for any loss or damage arising from your use of the site or your reliance on anything published on it, including decisions to buy a vehicle, travel to a charging station, or follow a planned route.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111114]">7. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan.
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-[#111114]">8. Changes and Contact</h2>
          <p>
            We may update these terms from time to time; the date above reflects the latest revision, and continued use of the site means you accept the current version. For corrections, data questions, or inquiries, please contact editorial at{' '}
            <Link href="/contact" className="text-blue-700 hover:underline">
              our contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
