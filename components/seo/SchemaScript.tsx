import React from 'react';

interface SchemaScriptProps {
  schemaData: object | object[];
}

export default function SchemaScript({ schemaData }: SchemaScriptProps) {
  const jsonLdData = Array.isArray(schemaData) ? schemaData : [schemaData];

  return (
    <>
      {jsonLdData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}

export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PakevFinder',
    url: 'https://pakevfinder.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pakevfinder.com/vehicles?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function createVehicleProductSchema(vehicle: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicle.name,
    description: vehicle.description,
    brand: {
      '@type': 'Brand',
      name: vehicle.brandName,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: vehicle.startingPricePkr,
      availability: vehicle.isUpcoming
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock',
    },
  };
}

export function createBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: b.url,
    })),
  };
}

export function createFaqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function createArticleSchema(article: { title: string; slug: string; description: string; date: string; author: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PakevFinder',
      url: 'https://pakevfinder.com',
    },
  };
}
