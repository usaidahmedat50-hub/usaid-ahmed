import { MetadataRoute } from 'next';
import { getAllVehicles, getAllBrands } from '@/lib/data/mock-db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pakevfinder.com';
  const vehicles = getAllVehicles();
  const brands = getAllBrands();

  // Static routes
  const routes = [
    '',
    '/electric-cars',
    '/compare',
    '/calculators/ev-vs-petrol',
    '/calculators/ev-running-cost',
    '/calculators/ev-charging-cost',
    '/calculators/total-cost-of-ownership',
    '/find-an-ev',
    '/charging-stations',
    '/charging-stations/karachi',
    '/charging-stations/lahore',
    '/charging-stations/islamabad',
    '/charging-stations/m2-motorway',
    '/plan-a-route',
    '/ev-policy/pakistan',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Brand routes
  const brandRoutes = brands.map((b) => ({
    url: `${baseUrl}/electric-cars/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Vehicle model routes
  const vehicleRoutes = vehicles.map((v) => ({
    url: `${baseUrl}/electric-cars/${v.brandSlug}/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...brandRoutes, ...vehicleRoutes];
}
