import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, mkdirSync, copyFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, relative, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const result = spawnSync(process.execPath, ['node_modules/vinext/dist/cli.js', 'build'], {
  cwd: root,
  env: { ...process.env, GITHUB_PAGES_BUILD: '1' },
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const output = resolve(root, 'dist/client');
const pages = readdirSync(resolve(root, 'app'), { recursive: true })
  .filter((file) => /(^|[\\/])page\.tsx$/.test(file));
const renderedPages = new Map();

// Keep flat HTML and RSC files for vinext navigation; directory indexes also
// support GitHub Pages direct links with a trailing slash. vinext beta.5's
// trailingSlash export redirects during prerender and skips non-root routes.
for (const page of pages) {
  const route = dirname(page).replaceAll('\\', '/').replace('[lang]', 'en');
  const stem = route === '.' ? 'index' : route;
  const htmlPath = join(output, `${stem}.html`);
  const rscPath = join(output, `${stem}.rsc`);
  if (!existsSync(htmlPath) || !existsSync(rscPath)) {
    throw new Error(`Static export is incomplete: ${route}`);
  }
  if (!readFileSync(htmlPath, 'utf8').includes('</html>')) {
    throw new Error(`Invalid exported HTML: ${relative(root, htmlPath)}`);
  }
  const publicPath = route === '.' ? '/' : `/${route}/`;
  const siteOrigin = 'https://sugakgroup.github.io';
  const language = route === 'en' || route.startsWith('en/') ? 'en' : 'ja';
  const counterpart = language === 'en' ? (route === 'en' ? '/' : `/${route.slice(3)}/`) : `/en${publicPath}`;
  const alternate = route === 'making' ? '' : `<link rel="alternate" hreflang="${language === 'en' ? 'ja' : 'en'}" href="${siteOrigin}${counterpart}">`;
  const html = readFileSync(htmlPath, 'utf8').replace('</head>', `<link rel="canonical" href="${siteOrigin}${publicPath}"><link rel="alternate" hreflang="${language}" href="${siteOrigin}${publicPath}">${alternate}</head>`);
  writeFileSync(htmlPath, html);
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  renderedPages.set(route === '.' ? '/' : `/${route}`, {
    ids: new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1])),
    links: [...markup.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(m => m[1].replaceAll('&amp;', '&')),
  });
  if (route !== '.') {
    const directory = join(output, route);
    mkdirSync(directory, { recursive: true });
    copyFileSync(htmlPath, join(directory, 'index.html'));
  }
}
writeFileSync(join(output, '.nojekyll'), '');
writeFileSync(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...renderedPages.keys()].map(path => `<url><loc>https://sugakgroup.github.io${path === '/' ? '/' : `${path}/`}</loc></url>`).join('')}</urlset>`);
writeFileSync(join(output, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://sugakgroup.github.io/sitemap.xml\n');

// Validate rendered destinations, including fragments retained by the language
// switch. This catches links that return HTTP 200 but land at the wrong place.
const auditOrigin = 'https://site.invalid';
let internalLinkCount = 0;
for (const [source, page] of renderedPages) {
  for (const href of page.links) {
    const url = new URL(href, auditOrigin + source);
    if (url.origin !== auditOrigin) continue;
    const path = url.pathname.replace(/\/$/, '') || '/';
    const target = renderedPages.get(path);
    if (!target) {
      if (existsSync(join(output, decodeURIComponent(path)))) continue;
      throw new Error(`Broken internal link: ${source} -> ${href}`);
    }
    internalLinkCount++;
    if (!url.hash) continue;
    const id = decodeURIComponent(url.hash.slice(1));
    if (!target.ids.has(id)) throw new Error(`Missing anchor: ${source} -> ${href}`);
    const translatedPath = path === '/en' ? '/' : path.startsWith('/en/') ? path.slice(3) : `/en${path === '/' ? '' : path}`;
    const translated = renderedPages.get(translatedPath);
    if (translated && !translated.ids.has(id)) {
      throw new Error(`Language switch loses anchor: ${path}#${id} -> ${translatedPath}#${id}`);
    }
  }
}
console.log(`Internal navigation: verified ${internalLinkCount} links, destinations and bilingual anchors.`);

// Check the rendered home pages, not only whether export produced a file.
// This catches a section move whose visible chapter numbers were left behind.
const homeOrder = ['research', 'people', 'works', 'join', 'collaborate', 'contact'];
for (const file of ['index.html', 'en.html']) {
  const html = readFileSync(join(output, file), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const sections = [...html.matchAll(/<section\b[^>]*\bid="(research|people|works|join|collaborate|contact)"[^>]*>/g)];
  if (sections.map(match => match[1]).join(',') !== homeOrder.join(',')) {
    throw new Error(`Home section order is inconsistent: ${file}`);
  }
  sections.forEach((match, index) => {
    const content = html.slice(match.index, sections[index + 1]?.index);
    const label = content.match(/<p\b[^>]*>(\d{2})\s*\//)?.[1];
    if (label !== String(index + 1).padStart(2, '0')) {
      throw new Error(`Home chapter number is inconsistent: ${file} #${match[1]}`);
    }
  });
}
console.log(`GitHub Pages: verified ${pages.length} pages and their navigation data.`);
console.log('Japanese and English home pages: section order and chapter numbers verified.');
