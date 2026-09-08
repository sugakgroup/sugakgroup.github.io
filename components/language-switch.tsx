'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function LanguageSwitch() {
  const path = usePathname() || '/';
  const en = path === '/en' || path.startsWith('/en/');
  useEffect(() => { document.documentElement.lang = en ? 'en' : 'ja'; }, [en]);
  const target = en ? path.replace(/^\/en/, '') || '/' : `/en${path === '/' ? '' : path}`;
  return <a className="language-switch" href={target} hrefLang={en ? 'ja' : 'en'} lang={en ? 'ja' : 'en'} onClick={event => { if (window.location.hash) event.currentTarget.href = target + window.location.hash; }}>{en ? '日本語' : 'English'}</a>;
}
