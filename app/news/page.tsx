import type { Metadata } from 'next';
import { GroupHeader } from '@/components/group-header';
import { NewsList } from '@/components/group-news';
import { news, getSchedule } from '@/lib/news';

export const metadata: Metadata = { title: 'お知らせ・予定 | 須賀グループ', description: '須賀グループの学会参加・発表予定と、論文掲載、メンバー加入、イベントのお知らせ。' };

export default function NewsPage() {
  const years = [...new Set(news.map(item => item.date.slice(0, 4)))];
  const { upcoming, past } = getSchedule();
  return <div className="ds ds-folio ds-current news-page">
    <a href="#main" className="ds-skip">本文へ移動</a><GroupHeader />
    <main id="main" className="research-page-main">
      <nav className="research-breadcrumb" aria-label="パンくず"><a href="/">ホーム</a><span aria-hidden="true">/</span><span aria-current="page">お知らせ・予定</span></nav>
      <header className="news-introduction"><p className="ds-kicker">FROM THE GROUP</p><h1>お知らせ・予定</h1></header>
      <section className="news-upcoming" aria-labelledby="schedule-heading"><h2 id="schedule-heading">これからの予定</h2>{upcoming.length > 0 ? <NewsList items={upcoming} /> : <p>今後の予定は、決まり次第お知らせします。</p>}</section>
      {years.length ? years.map(year => <section className="news-year" key={year} aria-labelledby={`news-${year}`}><h2 id={`news-${year}`}>{year}</h2><NewsList items={news.filter(item => item.date.startsWith(year))} /></section>) : <p>現在、お知らせはありません。</p>}
      {past.length > 0 && <details className="people-details news-past-schedule"><summary>過去の予定 <span aria-hidden="true">＋</span></summary><NewsList items={past} /></details>}
      <div className="research-return"><a className="ds-link" href="/#news">← トップへ戻る</a><a href="#main">ページの先頭へ ↑</a></div>
    </main>
    <footer className="ds-footer"><div><a href="/">SUGA GROUP</a><span>有機化学 / 計算化学 / 量子化学 / 高分子科学</span></div><p>© SUGA GROUP</p></footer>
  </div>;
}
