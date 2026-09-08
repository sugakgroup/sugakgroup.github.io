import { directions, themes, type Direction } from '@/lib/lab-content';

const nav = [['research', '研究内容'], ['people', 'メンバー'], ['publications', '業績'], ['students', '学生の皆さんへ'], ['contact', 'お問い合わせ']] as const;

function Heading({ english, title, note }: { english: string; title: string; note?: string }) {
  return <div className="section-heading"><div><p className="eyebrow">{english}</p><h2>{title}</h2></div>{note && <p>{note}</p>}</div>;
}

function Research() {
  return <section id="research" className="lab-section research-section"><Heading english="RESEARCH" title="私たちの研究" note="問い・手法・応用の3つの視点から。" /><div className="research-grid">{themes.map(theme => <article className="research-item" key={theme.id}><div className="theme-top"><span className="theme-index">{theme.id}</span><span>{theme.subtitle}</span></div><h3>{theme.title}</h3><p>{theme.description}</p><details><summary>テーマの概要 <span aria-hidden="true">＋</span></summary><div className="detail-copy"><span className="placeholder-label">掲載予定</span><p>{theme.detail}</p></div></details></article>)}</div><p className="section-footnote">研究テーマ名・説明は構成サンプルです。実際の研究内容に合わせて差し替えます。</p></section>;
}

function News() {
  const items = [
    ['研究成果', '代表論文・新しい研究成果の紹介', '論文の概要と、何が新しく分かったかを紹介します。'],
    ['研究室', '学会発表・研究室の活動報告', '発表内容や研究室の日々の活動を写真とともに掲載します。'],
    ['学生向け', '研究室見学・進学に関するご案内', '見学方法、募集対象、入試情報を確定後に掲載します。'],
  ];
  return <section id="news" className="news-section"><Heading english="NEWS & TOPICS" title="お知らせ" /><div className="news-list">{items.map(([tag, title, description]) => <details className="news-item" key={tag}><summary><span className="news-date">日付未設定</span><span className="news-tag">{tag}</span><span className="news-title">{title}<small>掲載例</small></span><span aria-hidden="true">＋</span></summary><p>{description}</p></details>)}</div></section>;
}

function EntryPoints() {
  return <aside className="entry-points" aria-label="目的別の入口"><p className="eyebrow">CONNECT WITH US</p><a href="#collaboration"><span>共同研究をお考えの方へ<small>研究テーマと連携の接点を知る</small></span><span aria-hidden="true">→</span></a><a href="#students"><span>学生の皆さんへ<small>研究と研究室での学びを知る</small></span><span aria-hidden="true">→</span></a><a href="#people"><span>メンバーを知る<small>研究を進める人たち</small></span><span aria-hidden="true">→</span></a></aside>;
}

function People() {
  return <section id="people" className="lab-section people-section"><Heading english="PEOPLE" title="研究を、ともにつくる人たち。" note="一人ひとりの問いが、グループの研究をつくる。" /><div className="people-layout"><article className="pi-card"><div className="person-monogram" aria-hidden="true">須賀</div><div><span className="eyebrow">GROUP LEADER</span><h3>須賀 <small>氏名・職位を掲載予定</small></h3><p>専門分野、略歴、研究への考え方を紹介します。</p><details><summary>プロフィール <span aria-hidden="true">＋</span></summary><p className="detail-copy">所属・職位・学歴・職歴・受賞歴と、研究者情報へのリンクを掲載予定です。</p></details></div></article><div className="member-groups">{[['研究メンバー', '研究員・大学院生・学部生など、実際の在籍者と研究テーマを紹介します。'], ['卒業生・共同研究者', '卒業後の進路や、グループとつながる研究者を紹介します。']].map(([title, description]) => <article key={title}><span className="member-mark" aria-hidden="true">↗</span><div><h3>{title}</h3><p>{description}</p><span className="placeholder-label">メンバー情報を掲載予定</span></div></article>)}</div></div></section>;
}

function Publications() {
  return <section id="publications" className="lab-section publications-section"><Heading english="PUBLICATIONS & PROJECTS" title="論文・研究実績" note="研究の成果と、そこに至る取り組み。" /><div className="publication-list">{[['01', 'PAPER', '代表論文のタイトル', '著者名 / 掲載誌 / 発表年 / DOI'], ['02', 'PROJECT', '共同研究・プロジェクト名', '研究期間 / 連携機関 / 研究成果'], ['03', 'PRESENTATION', '学会発表・受賞のタイトル', '発表者 / 学会名・賞名 / 発表年']].map(([id, tag, title, metadata]) => <article key={id}><span className="publication-number">{id}</span><div><span className="eyebrow">{tag} <span className="placeholder-label">掲載予定</span></span><h3>{title}</h3><p>{metadata}</p></div><details><summary>掲載内容 <span aria-hidden="true">＋</span></summary><p>正式な書誌情報と研究概要を登録します。論文には DOI・本文へのリンクを、プロジェクトには取り組みと成果を掲載します。</p></details></article>)}</div></section>;
}

function Students() {
  return <section id="students" className="lab-section students-section"><div className="student-intro"><p className="eyebrow">JOIN OUR GROUP</p><h2>ここから始まる、<br />あなたの研究。</h2><p>研究テーマだけでなく、日々の学び方や研究室の雰囲気も。進学や配属を考えるための情報をまとめます。</p><a href="#student-guide" className="text-link">研究室を知る <span aria-hidden="true">↓</span></a></div><div id="student-guide" className="student-guide">{[['01', 'どんな研究ができる？', '現在の研究テーマと、学生が取り組む課題の例を紹介します。'], ['02', '研究室での過ごし方は？', 'ゼミ、ディスカッション、研究の進め方を紹介します。'], ['03', '見学・進学の相談は？', '募集対象、入試情報、見学の手順を確定後にご案内します。']].map(([number, title, body]) => <details key={number}><summary><span>{number}</span>{title}<span className="expand-mark" aria-hidden="true">＋</span></summary><p>{body}</p></details>)}<p className="section-footnote">募集状況・指導方針・見学方法は未確定です。</p></div></section>;
}

function Collaboration() {
  return <section id="collaboration" className="lab-section collaboration-section"><div><p className="eyebrow">COLLABORATION</p><h2>新しい問いを、<br />一緒に考える。</h2><p>研究課題の相談から、具体的なプロジェクトの検討まで。グループの専門性と、連携できるテーマを紹介します。</p></div><div className="collaboration-steps"><ol><li><span>01</span><div><h3>課題や関心を共有</h3><p>取り組みたい課題と、その背景をお聞かせください。</p></div></li><li><span>02</span><div><h3>研究の接点を探す</h3><p>関連するテーマや手法をもとに、進め方を検討します。</p></div></li></ol><a className="lab-button" href="#contact">共同研究の相談窓口 <span aria-hidden="true">→</span></a></div></section>;
}

function Contact() {
  return <section id="contact" className="lab-section contact-section"><Heading english="CONTACT & ACCESS" title="お問い合わせ・アクセス" /><div className="contact-grid"><div><h3>須賀グループ</h3><p>所属大学・研究科・専攻を掲載予定<br />所在地・建物名・アクセス情報を掲載予定</p></div><div><h3>共同研究・研究室見学のご相談</h3><p>連絡先メールアドレスを設定後にご案内します。</p><span className="contact-status">お問い合わせ窓口は準備中です</span></div></div></section>;
}

function ResearchDiagram() {
  return <figure className="research-diagram"><figcaption><span>OUR RESEARCH</span><span>研究のつながり / 構成イメージ</span></figcaption><div className="diagram-question"><span>QUESTION</span><strong>問いから始まる</strong></div><span className="diagram-arrow" aria-hidden="true">↓</span><div className="diagram-methods"><span>考える<small>仮説・理論</small></span><span>確かめる<small>実験・解析</small></span><span>議論する<small>対話・協働</small></span></div><span className="diagram-arrow" aria-hidden="true">↓</span><div className="diagram-result">新しい知見へ <span>DISCOVERY</span></div></figure>;
}

function Hero({ direction }: { direction: Direction }) {
  const current = directions.find(d => d.slug === direction)!;
  return <section id="top" className="lab-hero"><div className="hero-copy"><p className="eyebrow">SUGA RESEARCH GROUP</p><h1>{current.preview[0]}<br />{current.preview[1]}</h1><p className="hero-description">須賀グループは、研究者と学生がともに問いを探究する研究グループです。研究を通じて新しい知見を生み出し、学内外とのつながりを育てます。</p><p className="field-placeholder">研究領域・所属をここに掲載</p><div className="hero-actions"><a className="lab-button" href={direction === 'commons' ? '#people' : '#research'}>{direction === 'commons' ? 'グループを知る' : '研究内容を見る'} <span aria-hidden="true">→</span></a><a className="text-link" href={direction === 'frontier' ? '#collaboration' : '#students'}>{direction === 'frontier' ? '共同研究をお考えの方へ' : '学生の皆さんへ'} <span aria-hidden="true">↗</span></a></div></div>{direction === 'commons' ? <aside className="commons-welcome"><span className="eyebrow">IN OUR LAB</span><h2>問いを持ち寄る。<br />対話から、深める。</h2><p>研究室での学びや活動を紹介するスペースです。</p><div><a href="#people">メンバー <span>→</span></a><a href="#students">研究室での日々 <span>→</span></a></div></aside> : <ResearchDiagram />}</section>;
}

export function LabPage({ direction }: { direction: Direction }) {
  const current = directions.find(d => d.slug === direction)!;
  return <div className={`lab-site lab-${direction}`}><a className="lab-skip" href="#main">本文へ移動</a><div className="review-bar"><a href="/">← 3案を比較</a><nav aria-label="デザイン案の切り替え">{directions.map(d => <a key={d.slug} href={`/lab/${d.slug}`} aria-current={d.slug === direction ? 'page' : undefined}>{d.number} <span>{d.english}</span></a>)}</nav><span className="review-note">デザイン案・仮コンテンツ</span></div><header className="lab-header"><a className="group-brand" href="#top"><span className="brand-symbol">S<span>G</span></span><span>須賀グループ<small>SUGA RESEARCH GROUP</small></span></a><nav className="desktop-nav" aria-label="メインナビゲーション">{nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav><details className="mobile-nav"><summary>メニュー <span aria-hidden="true">＋</span></summary><nav aria-label="モバイルナビゲーション">{nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav></details></header><main id="main"><Hero direction={direction} /><div className="lab-content">{direction === 'academic' ? <><div className="news-and-entry"><News /><EntryPoints /></div><Research /><People /><Publications /><Students /><Collaboration /></> : direction === 'frontier' ? <><Research /><Publications /><Collaboration /><People /><div className="news-and-entry"><News /><EntryPoints /></div><Students /></> : <><People /><Students /><Research /><div className="news-and-entry"><News /><EntryPoints /></div><Publications /><Collaboration /></>}<Contact /></div></main><footer className="lab-footer"><div><a className="group-brand" href="#top">須賀グループ<small>SUGA RESEARCH GROUP</small></a><p>研究・対話・発見を、ともに。</p></div><div><a href="#top">ページの先頭へ ↑</a><p>© Suga Group · Design concept {current.number}</p></div></footer><div className="sample-note">デザイン確認用：文章は仮案です。研究内容・業績・在籍者・募集情報は、正式な資料に基づいて更新します。</div></div>;
}
