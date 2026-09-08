import { EnglishFrame } from '@/components/english-site';
import profile from '@/data/profile.json';
import support from '@/data/research-support.json';
import { biographyEn, careerEn, awardsEn, supportEn } from '@/lib/english-content';
export const metadata = { title: 'Kensuke Suga | Suga Group', description: 'Kensuke Suga, Assistant Professor at The University of Osaka. Biography, education, appointments, awards, and research support.' };
function SupportList({ items }: { items: typeof support }) {
  return <ul className="people-support-list">{items.map(item => {
    const translated = supportEn[item.grantNumber || item.start] || item;
    return <li key={item.url}><span className="people-period">{item.start}–{item.end}</span><p className="people-support-program">{translated.organization} / {translated.program}</p><a href={item.url}>{translated.title} ↗</a>{item.grantNumber && <small className="people-grant-number">Grant number {item.grantNumber}</small>}</li>;
  })}</ul>;
}
export default function Page() {
  const month = new Date().toISOString().slice(0, 7);
  return <EnglishFrame title="Kensuke Suga" section="people"><div className="profile-page group-people"><header className="profile-introduction"><div className="people-leader-heading"><img className="people-portrait" src={profile.photo} width={150} height={200} alt="Kensuke Suga" /><div><p className="ds-kicker">GROUP LEADER</p><h1>Kensuke Suga</h1><p>Assistant Professor<br />Graduate School of Science, The University of Osaka<br />Ph.D. in Science, Kyoto University</p></div></div><p className="people-biography">{biographyEn}</p><div className="people-profile-links"><a href={profile.researchmap}>researchmap ↗</a><a href={`https://orcid.org/${profile.orcid}`}>ORCID {profile.orcid} ↗</a></div></header><section className="profile-career-section"><h2>Education & appointments</h2><dl className="people-career">{profile.career.map((c, i) => <div key={c.period}><dt>{c.period}</dt><dd>{careerEn[i] || c.text}</dd></div>)}</dl></section><div className="people-achievements"><section className="people-awards"><h2>Awards</h2><ul>{profile.awards.map(a => <li key={a.url}><time className="people-period" dateTime={a.date}>{a.date}</time><a href={a.url}>{awardsEn[a.date]?.name || a.name} ↗</a><span className="people-award-organization">{awardsEn[a.date]?.organization || a.organization}</span></li>)}</ul></section><section className="people-support"><h2>Research support</h2><SupportList items={support.filter(s => s.start <= month && s.end >= month)} /><details className="people-details"><summary>Previous support <span aria-hidden="true">＋</span></summary><SupportList items={support.filter(s => s.end < month)} /></details></section></div></div></EnglishFrame>;
}
export function generateStaticParams() { return [{ lang: 'en' }]; }
