const conceptLinks = [
  { id: '01', href: '/concepts/editorial', label: '静かな知性' },
  { id: '02', href: '/concepts/signal', label: '強いシグナル' },
  { id: '03', href: '/concepts/studio', label: 'ひらかれた研究室' },
  { id: '04', href: '/concepts/atlas', label: '研究の地図' },
  { id: '05', href: '/concepts/notebook', label: '思考の途中' },
  { id: '06', href: '/concepts/modern', label: '端正な存在感' },
] as const;

export function ConceptSwitcher({ current }: { current: string }) {
  return (
    <nav className="concept-switcher" aria-label="デザイン案の切り替え">
      <a href="/" className="concept-switcher-home">6案を比較</a>
      <span className="concept-switcher-divider" aria-hidden="true" />
      {conceptLinks.map((concept) => (
        <a
          key={concept.id}
          href={concept.href}
          aria-label={`${concept.id} ${concept.label}`}
          aria-current={current === concept.id ? 'page' : undefined}
          className={current === concept.id ? 'is-current' : undefined}
        >
          {concept.id}
        </a>
      ))}
    </nav>
  );
}
