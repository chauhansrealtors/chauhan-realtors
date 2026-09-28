import { Router } from 'express';
import { Blog } from '../models/Blog.js';
import { Project } from '../models/Project.js';

const router = Router();
const siteUrl = 'https://www.chauhanrealtors.in';
const staticPaths = ['/', '/projects', '/about', '/services', '/blog', '/contact', '/why-chauhan', '/location', '/reviews', '/privacy-policy', '/terms-and-conditions', '/disclaimer'];

function escapeXml(value) {
  return String(value).replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character]));
}

function lastModified(record) {
  for (const value of [record.updatedAt, record.publishedAt, record.createdAt]) {
    if (!value) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  return null;
}

function addUrl(entries, path, record) {
  const loc = new URL(path, siteUrl).href;
  if (entries.has(loc)) return;

  const modifiedAt = record ? lastModified(record) : null;
  entries.set(loc, `<url><loc>${escapeXml(loc)}</loc>${modifiedAt ? `<lastmod>${modifiedAt}</lastmod>` : ''}</url>`);
}

function addContentUrls(entries, prefix, records) {
  for (const record of records) {
    const slug = typeof record.slug === 'string' ? record.slug.trim() : '';
    if (!slug || slug === '.' || slug === '..' || /[\\/?#]/.test(slug)) continue;
    addUrl(entries, `/${prefix}/${encodeURIComponent(slug)}`, record);
  }
}

router.get('/sitemap.xml', async (_req, res) => {
  try {
    const [projects, blogs] = await Promise.all([
      Project.find({ isPublished: true }).select('slug updatedAt publishedAt createdAt').lean(),
      Blog.find({ isPublished: true }).select('slug updatedAt publishedAt createdAt').lean()
    ]);

    const entries = new Map();
    staticPaths.forEach((path) => addUrl(entries, path));
    addContentUrls(entries, 'projects', projects);
    addContentUrls(entries, 'blog', blogs);

    return res
      .type('application/xml')
      .set('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600')
      .send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Array.from(entries.values()).join('')}</urlset>`);
  } catch {
    return res.status(500).type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap unavailable</error>');
  }
});

export default router;