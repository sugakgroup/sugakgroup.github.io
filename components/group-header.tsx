'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import { LanguageSwitch } from '@/components/language-switch';
export function GroupHeader({ researchPage = false, worksPage = false, english = false, bilingual = true }: { researchPage?: boolean; worksPage?: boolean; english?: boolean; bilingual?: boolean }) {
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  useLayoutEffect(() => {
    const header = headerRef.current;
    const site = header?.closest<HTMLElement>('.ds-current');
    if (!header || !site) return;
    const measure = () => site.style.setProperty('--group-header-height', `${header.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  const root = english ? '/en' : '';
  return <header ref={headerRef} className="ds-header" data-menu-open={menuOpen} onKeyDown={event => {
    if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus(); }
  }}>
    <a href={root || '/'} className="ds-brand">{english ? 'SUGA GROUP' : '須賀グループ'}<small>{english ? 'THE UNIVERSITY OF OSAKA' : 'SUGA GROUP'}</small></a>
    <button ref={menuButtonRef} type="button" className="group-menu-button" aria-expanded={menuOpen} aria-controls={menuId} aria-label={english ? (menuOpen ? 'Close menu' : 'Open menu') : (menuOpen ? 'メニューを閉じる' : 'メニューを開く')} onClick={() => setMenuOpen(open => !open)}><span /><span /><span /></button>
    <nav id={menuId} aria-label={english ? 'Group navigation' : '研究室ナビゲーション'} onClick={event => { if ((event.target as HTMLElement).closest('a')) setMenuOpen(false); }}>
      <a href={`${root}/research`} aria-current={researchPage ? 'page' : undefined}>{english ? 'Research' : '研究内容'}</a>
      <a href={`${root}/#people`}>{english ? 'People' : 'メンバー'}</a>
      <a href={`${root}/works`} aria-current={worksPage ? 'page' : undefined}>{english ? 'Research output' : '研究業績'}</a>
      <a href={`${root}/#join`}>{english ? 'Join us' : '学生の皆さんへ'}</a>
      <a href={`${root}/#collaborate`}>{english ? 'Collaborate' : '共同研究'}</a>
      <a href={`${root}/#contact`}>{english ? 'Contact' : 'お問い合わせ'}</a>
      {bilingual && <LanguageSwitch />}
    </nav>
  </header>;
}
