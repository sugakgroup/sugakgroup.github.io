import { researchThemes } from '@/lib/research-content';

export function ResearchOverview() {
  return <section id="research" className="ds-section research-overview" aria-labelledby="research-heading">
    <div className="ds-section-head">
      <p>01 / RESEARCH</p><h2 id="research-heading">研究内容</h2>
      <a className="research-all" href="/research">研究の全体像へ <span aria-hidden="true">↗</span></a>
    </div>
    <div className="research-overview-grid">
      {researchThemes.map(theme => <article className="research-overview-item" key={theme.id}>
        <div className="research-topic-label"><span>{theme.number}</span><small>{theme.english}</small></div>
        <h3><a href={`/research#${theme.id}`}>{theme.title}</a></h3>
        <p className="research-topic-copy">{theme.copy}</p>
        <p className="research-topic-summary">{theme.summary}</p>
        <a className="ds-link research-topic-link" href={`/research#${theme.id}`} aria-label={`${theme.title}について詳しく読む`}>詳しく読む <span aria-hidden="true">↗</span></a>
      </article>)}
    </div>
  </section>;
}
