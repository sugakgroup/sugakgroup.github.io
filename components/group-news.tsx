import { news, getSchedule, type NewsItem } from '@/lib/news';

export function NewsList({ items }: { items: NewsItem[] }) {
  return <ul className="group-news-list">{items.map(item => <li key={`${item.date}-${item.order}`}>
    <time dateTime={item.date}>{item.date.replaceAll('-', '.')}</time>
    <span className="group-news-category">{item.category}</span>
    {item.url ? <a href={item.url}>{item.title} <span aria-hidden="true">↗</span></a> : <p>{item.title}</p>}
  </li>)}</ul>;
}

export function GroupNews() {
  const { upcoming } = getSchedule();
  return <section id="news" className="group-news" aria-labelledby="news-heading">
    <div className="group-news-heading"><div><p className="ds-kicker">FROM THE GROUP</p><h2 id="news-heading">お知らせ・予定</h2></div><a className="ds-link" href="/news">一覧へ <span aria-hidden="true">↗</span></a></div>
    <div className="group-upcoming"><h3>これからの予定</h3>{upcoming.length ? <NewsList items={upcoming.slice(0, 3)} /> : <p className="schedule-empty">学会参加・発表などの予定は、決まり次第お知らせします。</p>}</div>
    {news.length > 0 && <div><h3 className="group-news-subheading">最近のお知らせ</h3><NewsList items={news.slice(0, 5)} /></div>}
  </section>;
}
