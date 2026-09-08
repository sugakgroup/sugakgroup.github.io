import type { Metadata } from 'next';
import { GroupHeader } from '@/components/group-header';
import { collaborationIntroduction, researchThemes } from '@/lib/research-content';
import { researchPublications } from '@/lib/works';
import { ResearchExpertise } from '@/components/research-expertise';

export const metadata: Metadata = {
  title: '研究内容 | 須賀グループ',
  description: '化学空間の構築と分子探索、π共役分子の合成と機能探索、高分子の構造制御と力学物性。須賀グループの3つの研究テーマを紹介します。',
};

export default function ResearchPage() {
  return <div className="ds ds-folio ds-current research-page">
    <a href="#main" className="ds-skip">本文へ移動</a>
    <GroupHeader researchPage />
    <main id="main" className="research-page-main">
      <nav aria-label="パンくず" className="research-breadcrumb"><a href="/">ホーム</a><span aria-hidden="true">/</span><span aria-current="page">研究内容</span></nav>
      <header className="research-introduction">
        <p className="research-eyebrow">RESEARCH / SUGA GROUP</p>
        <h1>まだ見ぬ分子から、<br />分子の可能性を問い直す。</h1>
        <div className="research-introduction-body">
          <p>まだつくられていない分子には、どんな性質が潜んでいるのでしょうか。そして、よく知られた分子は、ほかのあり得る分子と比べて、どのような特徴や優位性を持つのでしょうか。</p>
          <p>私たちは、分子の構造と性質を広く探索することで、新しい物性・機能を持つ分子を見いだすとともに、既存の分子をより広い化学空間の中に位置づけ直します。未知の分子の発見と、既知の分子の理解。その両方を通じて、構造と物性・機能の関係を探ります。</p>
        </div>
      </header>
      <div className="research-reading-layout">
        <nav className="research-contents" aria-label="研究テーマの目次">
          <p>RESEARCH THEMES</p>
          {researchThemes.map(theme => <a href={`#${theme.id}`} key={theme.id}><span>{theme.number}</span>{theme.title}</a>)}
          <a href="#other-research" className="research-contents-contact">その他の研究 <span aria-hidden="true">↘</span></a>
          <a href="#research-collaboration" className="research-contents-contact">共同研究について <span aria-hidden="true">↘</span></a>
        </nav>
        <div className="research-articles">
          {researchThemes.map(theme => <section className="research-article" id={theme.id} key={theme.id} aria-labelledby={`${theme.id}-title`}>
            <div className="research-topic-label"><span>{theme.number}</span><small>{theme.english}</small></div>
            <h2 id={`${theme.id}-title`}>{theme.title}</h2>
            <p className="research-article-copy">{theme.copy}</p>
            <p>{theme.introduction}</p>
            {theme.sections.map((section, index) => <div className="research-subsection" key={index}>
              {'title' in section && <h3>{section.title}</h3>}
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>)}
            {researchPublications(theme.id).map(paper => <aside className="research-paper" aria-label="関連論文" key={paper.id}>
              <p className="research-eyebrow">関連論文</p>
              <a href={`https://doi.org/${paper.doi}`}>{paper.title}<span aria-hidden="true"> ↗</span></a>
              <p>{paper.journal} · {paper.year}</p>
              <span>DOI: {paper.doi}</span>
            </aside>)}
          </section>)}
          <ResearchExpertise />
          <section className="research-detail-collaboration" id="research-collaboration" aria-labelledby="research-collaboration-title">
            <p className="research-eyebrow">COLLABORATION</p>
            <h2 id="research-collaboration-title">分子の問いを、一緒に考える。</h2>
            <p>{collaborationIntroduction}</p>
            <a className="ds-link" href="/#contact">共同研究の相談について <span aria-hidden="true">↗</span></a>
          </section>
        </div>
      </div>
      <div className="research-return"><a className="ds-link" href="/#research">← トップへ戻る</a><a href="#main">ページの先頭へ ↑</a></div>
    </main>
    <footer className="ds-footer"><div><a href="/">SUGA GROUP</a><span>有機化学 / 計算化学 / 量子化学 / 高分子科学</span></div><p>© SUGA GROUP</p></footer>
  </div>;
}
