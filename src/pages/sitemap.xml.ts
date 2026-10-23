import type { APIRoute } from 'astro';
import { getServices, serviceHref } from '../lib/api';

export const GET: APIRoute = async ({ site }) => {
  const services = await getServices();
  const paths = ['/', '/services', '/about', '/contact', ...services.map(serviceHref)];
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
