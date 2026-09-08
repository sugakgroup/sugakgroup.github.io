import type { Publication } from '@/lib/work-types';

export function PublicationEntry({ publication, compact = false, english = false }: { publication: Publication; compact?: boolean; english?: boolean }) {
  const p = publication;
  return <article className={`publication-entry${compact ? ' publication-compact' : ''}`} id={`work-${p.id}`}>
    <p className="work-meta"><span>{p.year}</span><span>{english ? {preprint:'Preprint',review:'Review',article:'Article'}[p.type] : p.type === 'preprint' ? 'プレプリント' : p.type === 'review' ? '総説・解説' : '論文'}</span>{p.publicationNote && <span>{p.publicationNote}</span>}</p>
    <h3><a href={`https://doi.org/${p.doi}`}>{p.title}<span aria-hidden="true"> ↗</span></a></h3>
    {compact && p.summary && <p className="publication-summary">{p.summary}</p>}
    <p className="publication-authors">{p.authors.map((author, i) => <span key={`${author}-${i}`}>{i > 0 && ', '}{['Kensuke Suga','須賀 健介'].includes(author) ? <strong>{author}</strong> : author}{p.correspondingAuthors?.includes(author) && <sup className="corresponding-mark" aria-label={english ? 'Corresponding author' : '責任著者'}>*</sup>}</span>)}</p>
    <p className="publication-citation"><i>{p.journal}</i>{p.volume && <>, <b>{p.volume}</b>{p.issue && ` (${p.issue})`}</>}{p.pages && <>, {p.pages}</>} ({p.year}).</p>
    <div className="publication-links"><a className="publication-doi" href={`https://doi.org/${p.doi}`}>DOI: {p.doi}</a>{p.chemrxivUrl && <a className="publication-doi" href={p.chemrxivUrl} aria-label={`${english ? 'ChemRxiv preprint' : 'ChemRxiv版'}: ${p.title}`}>ChemRxiv<span aria-hidden="true"> ↗</span></a>}</div>
  </article>;
}
