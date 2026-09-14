import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'PakEVFinder — Pakistan’s EV Specifications, Prices & Charging Directory',
  description:
    'Compare electric vehicle specifications, ex-factory and estimated on-road prices, battery range, and DC fast charging speeds in Pakistan. Plan motorway EV trips with charger stops.',
  keywords: [
    'EV Pakistan',
    'Electric cars Pakistan',
    'BYD Seal Pakistan price',
    'BYD Atto 3 Pakistan price',
    'Deepal S07 price Pakistan',
    'MG4 EV Pakistan',
    'GWM Ora 03 Pakistan',
    'Honri VE price',
    'Electric vehicle charging stations Pakistan',
    'EV route planner Pakistan',
  ],
  authors: [{ name: 'PakEVFinder' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pakevfinder.com'),
  openGraph: {
    title: 'PakEVFinder — Pakistan’s EV Specifications, Prices & Charging Directory',
    description:
      'Compare electric vehicle specifications, prices, and charging infrastructure across Pakistan with clean, citable data.',
    url: 'https://pakevfinder.com',
    siteName: 'PakEVFinder',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PakEVFinder — Pakistan’s EV Specifications, Prices & Charging Directory',
    description:
      'Compare electric vehicle specifications, prices, and charging infrastructure across Pakistan with clean, citable data.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-[#111114] min-h-screen flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
