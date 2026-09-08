import profile from '@/data/profile.json';
import { collaborationIntroduction } from '@/lib/research-content';

export function CollaborationGuide() {
  const contactHref = `mailto:${profile.email}?subject=${encodeURIComponent('共同研究の相談')}`;

  return <section id="collaborate" className="ds-section ds-collaboration collaboration-guide" aria-labelledby="collaboration-heading">
    <p className="ds-kicker">05 / COLLABORATION</p>
    <div>
      <h2 id="collaboration-heading">分子の問いを、<br />一緒に考える。</h2>
      <div className="collaboration-copy">
        <p>{collaborationIntroduction}</p>
        <p>大学・研究機関・企業からのご相談を歓迎します。対象分子や評価方法がまだ決まっていない構想段階から、研究の進め方を一緒に考えます。</p>
        <p>須賀グループが分子探索・計算を担い、共同研究先の合成や専門的な評価と組み合わせる形を基本としています。役割分担は、研究の目的と双方の強みに応じて相談します。この形に限らず、まずは関心のある課題をお聞かせください。</p>
        <a href={contactHref} className="ds-link">共同研究を相談する <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>;
}
