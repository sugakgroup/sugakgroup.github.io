// Only translate routes that actually have an English page. Japanese-only
// pages and public files must keep their original destination.
export function englishSiteHref(href) {
  const match = href.match(/^(\/[^?#]*)([?#].*)?$/);
  if (!match) return href;
  const path = match[1].replace(/\/$/, '') || '/';
  if (!['/', '/research', '/works', '/profile', '/news'].includes(path)) return href;
  return `/en${path === '/' ? '' : path}${match[2] || ''}`;
}
