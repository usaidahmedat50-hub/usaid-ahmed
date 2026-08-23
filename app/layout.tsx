import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SchemaScript, { createOrganizationWebSiteSchema } from '@/components/seo/SchemaScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PakEVFinder | Electric Car Prices, Specs & Calculators in Pakistan',
  description:
    "Pakistan's premier EV discovery and ownership decision platform. Search verified EV prices in Pakistan, compare BYD, Deepal, MG, KIA specs, calculate home charging costs, and view fast-charging maps.",
  keywords: [
    'electric cars in pakistan',
    'EV prices in pakistan',
    'cheapest electric car in pakistan',
    'BYD Atto 3 price in pakistan',
    'Deepal S07 price pakistan',
    'EV vs petrol running cost pakistan',
    'EV charging stations in Karachi',
    'EV charging stations in Lahore',
  ],
  metadataBase: new URL('https://pakevfinder.com'),
  openGraph: {
    title: 'PakEVFinder - Find. Compare. Calculate.',
    description: "Pakistan's EV discovery and ownership decision platform.",
    url: 'https://pakevfinder.com',
    siteName: 'PakEVFinder',
    locale: 'en_PK',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-slate-950 text-slate-100 flex flex-col min-h-screen`}>
        <SchemaScript schemaData={createOrganizationWebSiteSchema()} />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
