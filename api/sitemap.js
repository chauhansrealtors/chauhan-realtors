export default async function handler(_request, response) {
  const configuredApiUrl = process.env.SITEMAP_SOURCE_URL || process.env.VITE_API_URL;
  const sourceUrl = configuredApiUrl?.trim().replace(/\/+$/, '').replace(/\/api$/, '');

  if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) {
    response.status(503).setHeader('Content-Type', 'application/xml');
    response.end('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap source is not configured</error>');
    return;
  }

  try {
    const upstream = await fetch(`${sourceUrl}/sitemap.xml`, { headers: { Accept: 'application/xml' } });
    const xml = await upstream.text();
    response.status(upstream.status).setHeader('Content-Type', 'application/xml');
    response.end(xml);
  } catch {
    response.status(502).setHeader('Content-Type', 'application/xml');
    response.end('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap source unavailable</error>');
  }
}