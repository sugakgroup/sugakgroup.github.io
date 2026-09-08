import type { Metadata } from 'next';
import { GroupHeader } from '@/components/group-header';
import photoData from '@/data/making-photos.json';
import './making.css';

type MakingPhoto = { src: string; alt: string; caption?: string; width?: number; height?: number };
function Photo({ photo }: { photo: MakingPhoto }) {
  return <figure className="making-photo">
    <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
    {photo.caption && <figcaption>{photo.caption}</figcaption>}
  </figure>;
}

export const metadata: Metadata = {
  title: 'つくる・いじる | 須賀 健介',
  description: '自作計算クラスター、Raspberry Pi PicoとRGBキーパッド、計算自動化ツールxtbflow・gaussflow。須賀健介の、研究の周辺でのものづくりを紹介します。',
};

export default function MakingPage() {
  const [cover, ...details]: MakingPhoto[] = photoData.cluster;
  return <div className="ds ds-folio ds-current making-page">
    <a href="#main" className="ds-skip">本文へ移動</a>
    <GroupHeader bilingual={false} />
    <main id="main" className="research-page-main">
      <nav className="research-breadcrumb" aria-label="パンくず">
        <a href="/">ホーム</a><span aria-hidden="true">/</span>
        <a href="/profile">須賀 健介</a><span aria-hidden="true">/</span>
        <span aria-current="page">つくる・いじる</span>
      </nav>
      <header className="research-introduction">
        <p className="research-eyebrow">研究の周辺 / 須賀 健介</p>
        <h1>つくる・いじる</h1>
        <div className="research-introduction-body">
          <p>コンピュータを、ソフトとハードの両面からいじるのが好きです。AIと一緒に便利なツールをつくったり、研究に使うPCや計算クラスターを組み上げたり。ここでは、日々の研究を支えるものづくりや、その過程で試したことを紹介します。</p>
        </div>
      </header>
      <article id="research-cluster" className={`research-article making-article${cover ? ' making-with-photos' : ''}`} aria-labelledby="cluster-heading">
        <p className="research-eyebrow">HARDWARE / 計算環境づくり</p>
        <h2 id="cluster-heading">研究用計算クラスターも、自作です。</h2>
        <div className="making-feature">
        <div className="making-description">
        <p>研究用の計算クラスターを自作し、分子探索と物性計算を自動で実行しています。現在、管理ノード1台とCPU計算ノード12台の計13台で構成し、各計算ノードにはRyzen 9 9950Xを搭載しています。計算を動かすハードウェアから、実行を管理するソフトウェアまで、自分たちの研究に合わせた環境づくりを進めています。</p>
        <dl className="making-specs">
          <div><dt>構成</dt><dd>管理ノード1台 ＋ CPU計算ノード12台<span>計13台</span></dd></div>
          <div><dt>計算ノードのCPU</dt><dd>Ryzen 9 9950X<span>12台それぞれに搭載</span></dd></div>
          <div><dt>用途</dt><dd>分子探索・物性計算<span>自動実行</span></dd></div>
        </dl>
        <p className="making-date">構成は2026年9月時点。</p>
        </div>
        {cover && <Photo photo={cover} />}
        </div>
        {details.length > 0 && <div className="making-gallery" role="group" aria-label="クラスターの写真">{details.map(photo => <Photo key={photo.src} photo={photo} />)}</div>}
      </article>
      <article id="rgb-keypad" className="research-article making-article making-with-photos making-keypad" aria-labelledby="keypad-heading">
        <p className="research-eyebrow">HARDWARE / 電子工作</p>
        <h2 id="keypad-heading">Codexを、手元のキーと光で。</h2>
        <div className="making-feature">
          <div className="making-description">
            <p>Raspberry Pi PicoとRGBキーパッドを組み合わせ、Codexを操作するための「CodexPicoPanel」をつくりました。16個の物理キーにショートカットなどの操作を割り当て、タスクの切り替えや音声入力などを手元で行えます。</p>
            <p>キーのLEDには、タスクの実行中・完了・操作待ちなどの状態を表示します。操作する道具に、進み具合を知らせる役割も持たせた、Windows版Codex用の自作パネルです。</p>
            <a className="ds-link" href="https://github.com/sgknsk526/CodexPicoPanel" target="_blank" rel="noopener noreferrer">CodexPicoPanelをGitHubで見る ↗</a>
          </div>
          {photoData.keypad.map(photo => <Photo key={photo.src} photo={photo} />)}
        </div>
      </article>
      <section id="calculation-tools" className="research-article making-article making-tools" aria-labelledby="tools-heading">
        <p className="research-eyebrow">SOFTWARE / 計算の自動化</p>
        <h2 id="tools-heading">繰り返す計算を、ひとつの流れに。</h2>
        <div className="making-description"><p>分子ごとに計算を準備し、実行して、結果を集める。その繰り返しを自動化するために、xtbflowとgaussflowを開発しています。分子一覧のCSVから計算を進め、必要な物性をまとめて取り出すためのツールです。</p></div>
        <div className="making-tool-list">
          <article aria-labelledby="xtbflow-heading">
            <h3 id="xtbflow-heading">xtbflow</h3>
            <p>xTBによる半経験的量子化学計算を自動化するPythonツール。分子の初期構造生成から計算の実行、結果の集約までをつなぎ、多数の分子をまとめて計算する作業を支えます。</p>
            <a className="ds-link" href="https://github.com/sugakgroup/xtbflow" target="_blank" rel="noopener noreferrer">xtbflowをGitHubで見る ↗</a>
          </article>
          <article aria-labelledby="gaussflow-heading">
            <h3 id="gaussflow-heading">gaussflow</h3>
            <p>Gaussianによる量子化学計算を自動化するPythonツール。Slurmで管理する計算クラスター上で、構造生成・計算・結果の集約を一連の手順として実行します。</p>
            <a className="ds-link" href="https://github.com/sugakgroup/gaussflow" target="_blank" rel="noopener noreferrer">gaussflowをGitHubで見る ↗</a>
          </article>
        </div>
        <p className="making-tool-status">どちらも須賀グループの計算環境を起点に開発中の初期公開版です。使い方や必要な環境は、各リポジトリで紹介しています。</p>
      </section>
      <div className="research-return"><a className="ds-link" href="/profile">← 須賀 健介のプロフィールへ</a><a href="#main">ページの先頭へ ↑</a></div>
    </main>
    <footer className="ds-footer"><div><a href="/">SUGA GROUP</a><span>有機化学 / 計算化学 / 量子化学 / 高分子科学</span></div><p>© SUGA GROUP</p></footer>
  </div>;
}
