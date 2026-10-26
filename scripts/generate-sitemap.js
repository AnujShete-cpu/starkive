import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://starkive-one.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

const CONSTANTS_PATH = path.resolve(__dirname, '../src/constants.ts');
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');

const content = fs.readFileSync(CONSTANTS_PATH, 'utf8');
const match = content.match(/export const TOOLS: Tool\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not extract tools array');
  process.exit(1);
}

const tools = new Function('return ' + match[1])();

const mainPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/browse', priority: '0.9', changefreq: 'daily' },
  { url: '/categories', priority: '0.9', changefreq: 'weekly' },
  { url: '/repos', priority: '0.9', changefreq: 'daily' },
  { url: '/compare', priority: '0.8', changefreq: 'weekly' },
  { url: '/how-it-works', priority: '0.7', changefreq: 'monthly' },
  { url: '/coming-soon', priority: '0.5', changefreq: 'monthly' },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Main pages
for (const page of mainPages) {
  xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
}

// Tool detail pages
for (const tool of tools) {
  xml += `  <url>
    <loc>${BASE_URL}/tool/${tool.id}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

xml += `</urlset>
`;

fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
console.log(`✅ Successfully generated sitemap.xml with ${mainPages.length + tools.length} URLs!`);
