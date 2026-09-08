import { EnglishFrame, EnglishNewsList } from '@/components/english-site';
import { news, getSchedule } from '@/lib/news';
export const metadata = { title: 'News & Upcoming Events | Suga Group', description: 'Publication news, upcoming conference participation and presentations, and other updates from Suga Group.' };
export default function Page() {
  const years = [...new Set(news.map(n => n.date.slice(0, 4)))];
  const { upcoming, past } = getSchedule();
  return <EnglishFrame title="News & upcoming events" section="news"><header className="news-introduction"><p className="ds-kicker">FROM THE GROUP</p><h1>News & upcoming events</h1></header><section className="news-upcoming"><h2>Coming up</h2>{upcoming.length ? <EnglishNewsList items={upcoming} /> : <p>Conference participation and presentations will be announced as plans are confirmed.</p>}</section>{years.map(year => <section className="news-year" key={year}><h2>{year}</h2><EnglishNewsList items={news.filter(n => n.date.startsWith(year))} /></section>)}{past.length > 0 && <details className="people-details"><summary>Past plans <span aria-hidden="true">＋</span></summary><EnglishNewsList items={past} /></details>}</EnglishFrame>;
}
export function generateStaticParams() { return [{ lang: 'en' }]; }
