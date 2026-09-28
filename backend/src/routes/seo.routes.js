import { Router } from 'express';
import { Blog } from '../models/Blog.js';
import { Project } from '../models/Project.js';
import { Property } from '../models/Property.js';

const router = Router();
const siteUrl = 'https://www.chauhanrealtors.in';

function escapeXml(value) {
  return String(value).replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character]));
}

function urlEntry(path, updatedAt) {
  return `<url><loc>${siteUrl}${escapeXml(path)}</loc>${updatedAt ? `<lastmod>${new Date(updatedAt).toISOString()}</lastmod>` : ''}</url>`;
}

router.get('/sitemap.xml', async (_req, res) => {
  try {
    const [properties, projects, blogs] = await Promise.all([
      Property.find({ isPublished: true }).select('slug updatedAt').lean(),
      Project.find({ isPublished: true }).select('slug updatedAt').lean(),
      Blog.find({ isPublished: true }).select('slug updatedAt').lean()
    ]);
    const staticPaths = ['/', '/projects', '/about', '/services', '/blog', '/contact', '/why-chauhan', '/location', '/reviews', '/privacy-policy', '/terms-and-conditions', '/disclaimer'];
    const entries = [
      ...staticPaths.map((path) => urlEntry(path)),
      ...properties.map((record) => urlEntry(`/properties/${record.slug}`, record.updatedAt)),
      ...projects.map((record) => urlEntry(`/projects/${record.slug}`, record.updatedAt)),
      ...blogs.map((record) => urlEntry(`/blog/${record.slug}`, record.updatedAt))
    ];
    return res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`);
  } catch {
    return res.status(500).type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap unavailable</error>');
  }
});

export default router;