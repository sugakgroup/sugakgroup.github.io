import type { Metadata } from 'next';
import { GroupHeader } from '@/components/group-header';
import profile from '@/data/profile.json';
import support from '@/data/research-support.json';

export const metadata: Metadata = {
  title: '須賀 健介 | 須賀グループ',
  description: '須賀健介のプロフィール。略歴、受賞歴、研究支援を紹介します。',
};

function SupportList({ items }: { items: typeof support }) {
  return <ul className="people-support-list">
    {items.map(item => <li key={item.url}>
      <span className="people-period">{item.start.replace('-', '.')}–{item.end.replace('-', '.')}</span>
      <div>
        <p className="people-support-program">{item.organization} ／ {item.program}</p>
        <a href={item.url}>{item.title} <span aria-hidden="true">↗</span></a>
        {item.grantNumber && <small className="people-grant-number">課題番号 {item.grantNumber}</small>}
      </div>
    </li>)}
  </ul>;
}

export default function ProfilePage() {
  const month = new Date().toISOString().slice(0, 7);
  const currentSupport = support.filter(item => item.start <= month && item.end >= month);
  const pastSupport = support.filter(item => item.end < month);

  return <div className="ds ds-folio ds-current profile-page">
    <a href="#main" className="ds-skip">本文へ移動</a>
    <GroupHeader />
    <main id="main" className="research-page-main group-people">
      <nav aria-label="パンくず" className="research-breadcrumb"><a href="/">ホーム</a><span aria-hidden="true">/</span><a href="/#people">メンバー</a><span aria-hidden="true">/</span><span aria-current="page">{profile.nameJa}</span></nav>
      <header className="profile-introduction">
        <div className="people-leader-heading">
          <img className="people-portrait" src={profile.photo} alt="須賀 健介" width={150} height={200} />
          <div>
            <p className="ds-kicker">GROUP LEADER</p>
            <h1>{profile.nameJa}<small className="profile-english">{profile.nameEn}</small></h1>
            <p>{profile.affiliationJa}<br />{profile.positionJa} ／ {profile.degree}</p>
          </div>
        </div>
        <p className="people-biography">{profile.biography}</p>
        <div className="people-profile-links">
          <a href={profile.researchmap}>researchmap <span aria-hidden="true">↗</span></a>
          <a href={`https://orcid.org/${profile.orcid}`}>ORCID <span>{profile.orcid} ↗</span></a>
        </div>
        <a className="ds-link" href="/making">研究の周辺：つくる・いじる <span aria-hidden="true">↗</span></a>
      </header>
      <section className="profile-career-section" aria-labelledby="career-heading">
        <h2 id="career-heading">略歴</h2>
        <dl className="people-career">{profile.career.map(item => <div key={item.period}><dt>{item.period}</dt><dd>{item.text}</dd></div>)}</dl>
      </section>
      <div className="people-achievements">
        <section className="people-awards" aria-labelledby="awards-heading">
          <h2 id="awards-heading">受賞</h2>
          <ul>{profile.awards.map(award => <li key={award.url}>
            <time className="people-period" dateTime={award.date}>{award.date.replace('-', '.')}</time>
            <a href={award.url}>{award.name} <span aria-hidden="true">↗</span></a>
            <span className="people-award-organization">{award.organization}</span>
          </li>)}</ul>
        </section>
        <section className="people-support" aria-labelledby="support-heading">
          <h2 id="support-heading">研究支援</h2>
          <SupportList items={currentSupport} />
          {pastSupport.length > 0 && <details className="people-details">
            <summary>過去の研究支援 <span aria-hidden="true">＋</span></summary>
            <SupportList items={pastSupport} />
          </details>}
        </section>
      </div>
      <div className="research-return"><a className="ds-link" href="/#people">← メンバー紹介へ戻る</a><a href="#main">ページの先頭へ ↑</a></div>
    </main>
    <footer className="ds-footer"><div><a href="/">SUGA GROUP</a><span>有機化学 / 計算化学 / 量子化学 / 高分子科学</span></div><p>© SUGA GROUP</p></footer>
  </div>;
}
