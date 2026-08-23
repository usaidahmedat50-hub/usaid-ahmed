import React from 'react';

interface SchemaScriptProps {
  schemaData: object | object[];
}

export default function SchemaScript({ schemaData }: SchemaScriptProps) {
  const data = Array.isArray(schemaData) ? schemaData : [schemaData];

  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

// Schema Builders
export function createVehicleProductSchema(vehicle: {
  name: string;
  brandName: string;
  description: string;
  startingPricePkr: number;
  imageUrl: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: vehicle.name,
    brand: {
      '@type': 'Brand',
      name: vehicle.brandName,
    },
    description: vehicle.description,
    image: vehicle.imageUrl,
    fuelType: 'Electric',
    vehicleEngine: {
      '@type': 'EngineSpecification',
      fuelType: 'Electric',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: vehicle.startingPricePkr,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: `${vehicle.brandName} Pakistan Official / Authorized Distributor`,
      },
    },
  };
}

export function createFaqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function createBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createOrganizationWebSiteSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PakEVFinder',
      url: 'https://pakevfinder.com',
      logo: 'https://pakevfinder.com/logo.png',
      description: "Pakistan's premier EV discovery and ownership decision platform.",
      sameAs: ['https://facebook.com/pakevfinder', 'https://twitter.com/pakevfinder'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'PakEVFinder',
      url: 'https://pakevfinder.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://pakevfinder.com/electric-cars?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}
