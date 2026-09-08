import type { Metadata } from 'next';
import { GroupHeader } from '@/components/group-header';
import { WorkList } from '@/components/work-list';
import { ResearchProfileLinks } from '@/components/research-profile-links';
import { works, workTaxonomy, profile } from '@/lib/works';

export const metadata: Metadata = {
  title: '研究業績 | 須賀グループ',
  description: '須賀グループの論文・総説、プレプリント、著書、講演、学生発表。研究テーマ、共同研究、仕事の区分、招待講演などで絞り込めます。',
};

export default function WorksPage() {
  return <div className="ds ds-folio ds-current works-page">
    <a href="#main" className="ds-skip">本文へ移動</a><GroupHeader worksPage />
    <main id="main" className="research-page-main">
      <nav aria-label="パンくず" className="research-breadcrumb"><a href="/">ホーム</a><span aria-hidden="true">/</span><span aria-current="page">研究業績</span></nav>
      <header className="works-introduction"><p className="research-eyebrow">PUBLICATIONS & PRESENTATIONS</p><h1>研究業績</h1><p>須賀健介のこれまでの研究業績と、グループの研究発表を紹介します。</p><ResearchProfileLinks orcid={profile.orcid} /></header>
      <WorkList works={works} taxonomy={workTaxonomy} />
      <div className="research-return"><a className="ds-link" href="/#works">← トップへ戻る</a><a href="#main">ページの先頭へ ↑</a></div>
    </main>
    <footer className="ds-footer"><div><a href="/">SUGA GROUP</a><span>有機化学 / 計算化学 / 量子化学 / 高分子科学</span></div><p>© SUGA GROUP</p></footer>
  </div>;
}
