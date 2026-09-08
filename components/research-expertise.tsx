import { publications } from '@/lib/works';

export function ResearchExpertise({ english = false }: { english?: boolean }) {
  const references = ['10.1039/d6qm00409a', '10.1021/jacs.4c18623', '10.1039/d3tc02151c']
    .flatMap(doi => publications.filter(p => p.visible && p.doi === doi));
  const forceReference = publications.find(p => p.visible && p.doi === '10.1021/jacs.3c09175');
  return <section className="research-article research-other" id="other-research" aria-labelledby="other-research-title">
    <h2 id="other-research-title">{english ? 'Other research' : 'その他の研究'}</h2>
    <article className="research-subsection research-other-item" id="aromaticity" aria-labelledby="aromaticity-title">
    <h3 id="aromaticity-title">{english ? 'Aromaticity analysis' : '芳香族性の評価'}</h3>
    <p>{english
      ? 'We use quantum chemical calculations to evaluate molecular aromaticity in both ground and excited states. By examining how aromaticity changes with electronic state and molecular structure, we investigate the origins of distinctive properties and functions.'
      : '量子化学計算を用いて、基底状態から励起状態まで、分子の芳香族性を評価します。電子状態や分子構造の変化に伴って芳香族性がどう変わるかを調べ、特徴的な物性・機能が生じる理由を探ります。'}</p>
    <p>{english
      ? 'We also collaborate on aromaticity analysis to understand experimentally observed properties and phenomena in terms of molecular electronic states.'
      : '芳香族性の解析を通じて、実験で観測された性質や現象を分子の電子状態から理解する共同研究にも取り組みます。'}</p>
    {references.map(reference => <aside className="research-paper" aria-label={english ? 'Related publication' : '関連論文'} key={reference.doi}>
      <p className="research-eyebrow">{english ? 'RELATED PUBLICATION' : '関連論文'}</p>
      <a href={`https://doi.org/${reference.doi}`}>{reference.title}<span aria-hidden="true"> ↗</span></a>
      <p>{reference.journal} · {reference.year}</p>
      <span>DOI: {reference.doi}</span>
    </aside>)}
    </article>
    <article className="research-subsection research-other-item" id="molecular-force-response" aria-labelledby="molecular-force-response-title">
      <h3 id="molecular-force-response-title">{english ? 'Molecular responses to force' : '分子の力学応答'}</h3>
      <p>{english
        ? 'We investigate how molecules deform under force and how these changes affect fluorescence and other optical responses. By clarifying the relationship between molecular structure and response, we seek to understand how molecular responses can reveal the forces acting on them.'
        : '力を受けた分子がどのように変形し、その変化が蛍光などの光学応答にどう現れるかを調べます。分子構造と応答の関係を明らかにすることで、分子に働く力を読み取る仕組みの理解につなげます。'}</p>
      <p>{english
        ? 'We can also explore collaborations that incorporate force-responsive molecules into polymer materials and investigate their responses during stretching. By relating material deformation to molecular responses, we examine how force is transmitted within the material.'
        : '共同研究では、力に応答する分子を高分子材料に導入し、引き伸ばしたときの応答を調べる研究も検討できます。材料の変形と分子の応答を結びつけ、内部での力の伝わり方を探ります。'}</p>
      {forceReference && <aside className="research-paper" aria-label={english ? 'Related publication' : '関連論文'}>
        <p className="research-eyebrow">{english ? 'RELATED PUBLICATION' : '関連論文'}</p>
        <a href={`https://doi.org/${forceReference.doi}`}>{forceReference.title}<span aria-hidden="true"> ↗</span></a>
        <p>{forceReference.journal} · {forceReference.year}</p>
        <span>DOI: {forceReference.doi}</span>
      </aside>}
    </article>
  </section>;
}
