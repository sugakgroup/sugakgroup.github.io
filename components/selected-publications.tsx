import { featuredPublications } from '@/lib/works';
import { PublicationEntry } from '@/components/publication-entry';

export function SelectedPublications() {
  return <section id="works" className="ds-section selected-publications" aria-labelledby="selected-publications-heading">
    <div className="ds-section-head"><p>03 / SELECTED WORK</p><h2 id="selected-publications-heading">代表論文</h2><a href="/works" className="research-all">業績一覧へ <span aria-hidden="true">↗</span></a></div>
    {featuredPublications.length ? featuredPublications.map(p => <PublicationEntry key={p.id} publication={p} compact />) : <p>代表論文は準備中です。</p>}
  </section>;
}
