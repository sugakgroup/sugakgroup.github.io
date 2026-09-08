'use client';

import { useState } from 'react';
import { workLabelsEn } from '@/lib/work-labels-en';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { PublicationEntry } from '@/components/publication-entry';
import { BookEntry } from '@/components/book-entry';
import { defaultWorkFilters, filterWorks } from '@/lib/work-model.mjs';
import type { Work, WorkTaxonomy } from '@/lib/work-types';

function WorkFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="work-filter"><span>{label}</span><NativeSelect value={value} onChange={e => onChange(e.target.value)}>{options.map(([key, text]) => <NativeSelectOption key={key} value={key}>{text}</NativeSelectOption>)}</NativeSelect></label>;
}

export function WorkList({ works, taxonomy, english = false }: { works: Work[]; taxonomy: WorkTaxonomy; english?: boolean }) {
  const t = (value: string) => english ? workLabelsEn[value] || value : value;
  const groupLabels = {'saito-group':t('齊藤グループでの仕事'),'externally-led':t('他グループ主導'),'suga-group':t('須賀グループの仕事'),'unclassified':''};
  const [filters, setFilters] = useState({ ...defaultWorkFilters, kind: 'publications' });
  const update = (key: keyof typeof filters, value: string) => setFilters(previous => ({ ...previous, [key]: value }));
  const filtered: Work[] = filterWorks(works, filters);
  const categoryWorks: Work[] = filterWorks(works, { kind: filters.kind });
  const years = [...new Set(categoryWorks.map(w => w.year))].sort((a,b) => b-a);
  const resultYears = [...new Set(filtered.map(w => w.year))].sort((a,b) => b-a);
  const kinds = ([['publications', t('論文・総説')], ['preprints', t('プレプリント')], ['books', t('著書')], ['lectures', t('講演')], ['students', t('学生発表')]] as const).filter(([key]) => !english || key !== 'students');
  const categoryLabel = kinds.find(([key]) => key === filters.kind)?.[1] || t('業績');
  const isPresentationCategory = filters.kind === 'lectures' || filters.kind === 'students';
  const emptyCategory = categoryWorks.length === 0;
  const hasSpeakers = filtered.some(w => w.type === 'presentation');
  const result = <>
    <div className="work-result-line"><p role="status" aria-live="polite">{filtered.length}{english ? (filtered.length === 1 ? ' result' : ' results') : '件'}</p><button type="button" onClick={() => setFilters(previous => ({ ...defaultWorkFilters, kind: previous.kind }))}>{t('絞り込みを解除')}</button></div>
    {hasSpeakers && <p className="work-legend">○ {t('発表者')}</p>}
    {filtered.length ? resultYears.map(year => <section key={year} className="work-year" aria-labelledby={`year-${year}`}>
      <h2 id={`year-${year}`}>{year}</h2><div>{filtered.filter(w => w.year === year).map(work => <div className="work-record" key={work.id}>
        {work.type === 'presentation' ? <article className="presentation-entry" id={`work-${work.id}`}>
          <p className="work-meta"><span>{work.date ? work.date.slice(0, 7) : work.year}</span>{work.scope === 'international' && <span>{t('国際')}</span>}{work.invitation === 'invited' && <span>{t('招待講演')}</span>}{work.format !== 'unclassified' && <span>{{oral:t('口頭発表'),poster:t('ポスター発表'),other:t('その他')}[work.format]}</span>}</p>
          <h3>{work.title}</h3>
          <p className="publication-authors">{work.authors.map((author, i) => <span key={`${author}-${i}`}>{i > 0 && ', '}{work.speakers.includes(author) && <><span className="speaker-mark" aria-hidden="true">○</span><span className="sr-only">{t('発表者：')}</span></>}{author}</span>)}</p>
          <p className="publication-citation">{work.event}</p>
        </article> : work.type === 'book' ? <BookEntry book={work} english={english} /> : <PublicationEntry publication={work} english={english} />}
        {(work.themeIds.length > 0 || (work.type !== 'presentation' && work.group !== 'unclassified')) && <ul className="work-tags" aria-label={t('業績の分類')}>
          {work.type !== 'presentation' && work.group !== 'unclassified' && <li>{groupLabels[work.group]}</li>}
          {work.themeIds.map(id => <li key={id}>{taxonomy.themes.find(t => t.id === id)?.label}</li>)}
        </ul>}
        {!!work.collaborationIds?.length && <div className="work-partners"><p>{t('コラボレーション先')}</p><ul>{work.collaborationIds.map(id => <li key={id}>{t(taxonomy.collaborations.find(item => item.id === id)?.label || '')}</li>)}</ul></div>}
      </div>)}</div>
    </section>) : <Empty className="work-empty"><EmptyHeader><EmptyTitle>{emptyCategory ? (english ? `No ${categoryLabel.toLowerCase()} listed yet.` : `${categoryLabel}はまだ掲載されていません。`) : t('条件に一致する業績はありません。')}</EmptyTitle>{!emptyCategory && <EmptyDescription>{t('絞り込み条件を変更してご覧ください。')}</EmptyDescription>}</EmptyHeader></Empty>}
  </>;

  return <Tabs className="work-browser" value={filters.kind} onValueChange={value => setFilters({ ...defaultWorkFilters, kind: String(value) })}>
    <TabsList variant="line" aria-label={t('業績の種類')}>{kinds.map(([key, label]) => <TabsTrigger key={key} value={key}>{label}<span>{filterWorks(works, { kind: key }).length}</span></TabsTrigger>)}</TabsList>
    <div className="work-filters" role="group" aria-label={t('業績の絞り込み')}>
      <WorkFilter label={t('仕事の区分')} value={filters.group} onChange={v => update('group',v)} options={[[ 'all',t('すべて')],['saito-group',groupLabels['saito-group']],['externally-led',groupLabels['externally-led']],['suga-group',groupLabels['suga-group']]]} />
      <WorkFilter label={t('研究テーマ')} value={filters.theme} onChange={v => update('theme',v)} options={[[ 'all',t('すべてのテーマ')], ...taxonomy.themes.map(t => [t.id,t.label] as [string,string]), ['unclassified',t('未分類')]]} />
      {!isPresentationCategory && <WorkFilter label={t('コラボレーション先')} value={filters.collaboration} onChange={v => update('collaboration',v)} options={[[ 'all',t('すべての相手先')],...taxonomy.collaborations.map(item => [`project:${item.id}`,t(item.label)] as [string,string])]} />}
      <WorkFilter label={t('発表年')} value={filters.year} onChange={v => update('year',v)} options={[[ 'all',t('すべての年')],...years.map(y => [String(y),String(y)] as [string,string])]} />
      {(filters.kind === 'lectures' || filters.kind === 'students') && <>
        <WorkFilter label={t('国内・国際')} value={filters.scope} onChange={v => update('scope',v)} options={[[ 'all',t('すべて')],['domestic',t('国内')],['international',t('国際')],['unclassified',t('未分類')]]} />
        <WorkFilter label={t('招待区分')} value={filters.invitation} onChange={v => update('invitation',v)} options={[[ 'all',t('すべて')],['invited',t('招待講演')],['contributed',t('一般発表')],['unclassified',t('未分類')]]} />
      </>}
    </div>
    {kinds.map(([key]) => <TabsContent key={key} value={key}>{result}</TabsContent>)}
  </Tabs>;
}
