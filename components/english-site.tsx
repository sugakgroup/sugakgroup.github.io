import type { ReactNode } from 'react';
import { GroupHeader } from '@/components/group-header';
import { ChemicalVoyage } from '@/components/chemical-voyage';
import { PublicationEntry } from '@/components/publication-entry';
import { news, getSchedule, type NewsItem } from '@/lib/news';
import { featuredPublications } from '@/lib/works';
import { introductionEn, themesEn, newsCategoriesEn } from '@/lib/english-content';
import profile from '@/data/profile.json';
import members from '@/data/members.json';
import { englishSiteHref } from '@/lib/site-links.mjs';

export function EnglishFooter() {
  return <footer className="ds-footer"><div><a href="/en">SUGA GROUP</a><span>Organic / Computational / Quantum Chemistry / Polymer Science</span></div><p>© SUGA GROUP</p></footer>;
}
export function EnglishFrame({ children, title, section }: { children: ReactNode; title: string; section?: string }) {
  return <div className="ds ds-folio ds-current english-site"><a href="#main" className="ds-skip">Skip to content</a><GroupHeader english researchPage={section === 'research'} worksPage={section === 'works'} /><main className="research-page-main" id="main"><nav className="research-breadcrumb" aria-label="Breadcrumb"><a href="/en">Home</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>{children}<div className="research-return"><a className="ds-link" href={`/en${section ? `/#${section}` : ''}`}>← Back to home</a><a href="#main">Back to top ↑</a></div></main><EnglishFooter /></div>;
}
export function EnglishNewsList({ items }: { items: NewsItem[] }) {
  return <ul className="group-news-list">{items.map(item => {
    const title = item.titleEn || item.title;
    const url = englishSiteHref(item.url);
    return <li key={`${item.date}-${item.order}`}><time dateTime={item.date}>{item.date.replaceAll('-', '.')}</time><span className="group-news-category">{newsCategoriesEn[item.category] || item.category}</span>{url ? <a href={url}>{title} ↗</a> : <p>{title}</p>}</li>;
  })}</ul>;
}
export function EnglishNews() {
  const { upcoming } = getSchedule();
  return <section id="news" className="group-news"><div className="group-news-heading"><div><p className="ds-kicker">FROM THE GROUP</p><h2>News & upcoming events</h2></div><a className="ds-link" href="/en/news">View all ↗</a></div><div className="group-upcoming"><h3>Coming up</h3>{upcoming.length ? <EnglishNewsList items={upcoming.slice(0, 3)} /> : <p className="schedule-empty">Conference participation and presentations will be announced here as plans are confirmed.</p>}</div><h3 className="group-news-subheading">Latest news</h3><EnglishNewsList items={news.slice(0, 5)} /></section>;
}
export function EnglishResearchOverview() {
  return <section id="research" className="ds-section research-overview"><div className="ds-section-head"><p>01 / RESEARCH</p><h2>Research</h2><a className="research-all" href="/en/research">Explore our research ↗</a></div><div className="research-overview-grid">{themesEn.map(t => <article className="research-overview-item" key={t.id}><div className="research-topic-label"><span>{t.number}</span><small>{t.english}</small></div><h3><a href={`/en/research#${t.id}`}>{t.title}</a></h3><p className="research-topic-copy">{t.copy}</p><p className="research-topic-summary">{t.summary}</p><a className="ds-link research-topic-link" href={`/en/research#${t.id}`}>Read more ↗</a></article>)}</div></section>;
}
type Member = { name: string; nameEn?: string; grade: string; themes: string[]; note?: string; noteEn?: string; visiting?: boolean };
function EnglishMemberList({ items, alumni = false }: { items: Member[]; alumni?: boolean }) {
  return <ul className="people-member-list">{items.map(m => <li key={m.name}><div className="people-member-heading"><h4>{m.nameEn || m.name}</h4><span>{alumni ? `${m.visiting ? "At time of visit" : "At time of membership"}: ${m.grade}` : m.grade}</span></div><ul className="people-member-themes">{m.themes.map(id => <li key={id}><a href={`/en/research#${id}`}>{themesEn.find(t => t.id === id)?.title}</a></li>)}</ul>{(m.noteEn || m.note) && <p className="people-member-note">{m.noteEn || m.note}</p>}</li>)}</ul>;
}
export function EnglishPeople() {
  return <section id="people" className="ds-section group-people"><div className="ds-section-head"><p>02 / PEOPLE</p><h2>Our group</h2></div><div className="people-overview"><article className="people-leader"><div className="people-leader-heading"><img className="people-portrait" src={profile.photo} alt="Kensuke Suga" width={150} height={200} loading="lazy" /><div><p className="ds-kicker">GROUP LEADER</p><h3>Kensuke Suga</h3><p>Graduate School of Science<br />The University of Osaka<br />Assistant Professor</p></div></div><p className="people-biography">Connecting computational chemistry, organic synthesis, and polymer science through molecular exploration.</p><a className="ds-link" href="/en/profile">Full profile ↗</a></article><div className="people-students"><h3>Students</h3><EnglishMemberList items={members.students} /><div className="people-member-group"><h3>Project students</h3><EnglishMemberList items={members.projectStudents} /></div><details className="people-details people-member-group"><summary>Alumni & past visitors <span aria-hidden="true">＋</span></summary><EnglishMemberList items={members.alumni} alumni /></details><p className="people-member-note">M1/M2: master’s year 1/2. B4: undergraduate year 4.</p></div></div></section>;
}
export function EnglishJoin() {
  const inquiry = `mailto:${profile.email}?subject=${encodeURIComponent('Visiting or joining Suga Group')}`;
  const guidance = [
    ['Choosing a research topic', 'Suga sets the initial research topic after discussing your interests and preferences. As you learn how to conduct research, you will have more opportunities to develop your own questions and directions, with increasing autonomy.'],
    ['Discussion and supervision', 'At the beginning, we discuss your work as often as needed, including daily. Once you can work independently, we still meet for a research discussion at least once every two weeks.'],
    ['Freedom to explore', 'We value students’ ideas and the freedom to pursue small exploratory trials of their own. Before taking an idea forward as a full research project intended for publication, discuss it with Suga and obtain his approval.'],
    ['Getting in touch', 'We welcome requests for laboratory visits and online discussions at any time. In your email, please share your institution, year of study, research interests, intended start date, and preferred meeting format, where possible. You are welcome to get in touch even if you have not yet decided on a specific research topic.'],
  ];
  return <section id="join" className="ds-section ds-join student-guide"><div className="ds-join-intro"><p className="ds-kicker">04 / JOIN THE GROUP</p><h2>Discover new properties.<br />Make the discovery your own.</h2><p>Search for molecules through computation. Synthesize them yourself and test their properties. Create polymer structures and investigate their mechanical responses. At Suga Group, we develop research topics with your interests as the starting point.</p><p>We welcome undergraduate, master’s, and doctoral students, including those joining us from other universities or overseas. Prior experience in organic synthesis, quantum chemistry, or programming is not required. You will develop the knowledge and skills you need through research.</p><a className="ds-link" href={inquiry}>Arrange a visit or online meeting ↗</a><p className="student-visit-note">Inquiries are welcome at any time. Please email us to arrange a meeting.</p></div><div className="ds-join-guide">{guidance.map(([title, body], i) => <details open={i < 2} key={title}><summary><span>{String(i + 1).padStart(2, '0')}</span>{title}<b aria-hidden="true">＋</b></summary><p>{body}</p>{i === 3 && <a className="student-email" href={inquiry}>{profile.email}</a>}</details>)}</div></section>;
}
export function EnglishCollaboration({ id = 'collaborate', compact = false }: { id?: string; compact?: boolean } = {}) {
  return <section id={id} className={compact ? 'research-detail-collaboration' : 'ds-section ds-collaboration collaboration-guide'}><p className="ds-kicker">{compact ? 'COLLABORATION' : '05 / COLLABORATION'}</p><div><h2>A molecular question.<br />A shared exploration.</h2><div className="collaboration-copy">
    <p>“If only a molecule had these properties.” We turn such questions into concrete molecular exploration. Combining collaborators’ expertise with our exploration framework, we search for new molecular candidates while considering the target properties and synthetic feasibility.</p>
    {!compact && <><p>We welcome inquiries from universities, research institutes, and companies. We can work together to shape a research approach from the initial idea stage, even before target molecules or evaluation methods have been defined.</p><p>Typically, Suga Group contributes molecular exploration and computation, combined with synthesis or specialized evaluation by our collaborators. We agree on roles based on the research goals and each partner’s expertise. Other arrangements are welcome; please tell us about the questions you would like to explore.</p></>}
    <a className="ds-link" href={compact ? '/en/#contact' : 'mailto:' + profile.email + '?subject=Research%20collaboration'}>Discuss a collaboration ↗</a>
  </div></div></section>;
}
export function EnglishContact() {
  return <section id="contact" className="ds-section ds-contact group-contact"><p className="ds-kicker">06 / CONTACT & ACCESS</p><div><div><h2>Contact</h2><p>Suga Group<br />Graduate School of Science<br />The University of Osaka<br />Kensuke Suga, Assistant Professor</p></div><div className="group-contact-address"><h3>Visits, study, and research collaboration</h3><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a><p>Laboratory visits and online meetings are welcome. Please email us in advance to arrange a time.</p><div className="contact-location" id="access"><h3>Location</h3><address>{profile.roomEn}<br />The University of Osaka<br />{profile.addressEn}</address></div></div></div></section>;
}
export function EnglishHome() {
  return <div className="ds ds-folio ds-current english-site"><a className="ds-skip" href="#main">Skip to content</a><div className="ds-frame"><GroupHeader english /><main id="main"><div id="top"><section className="folio-hero"><div className="folio-stage"><div className="folio-mast"><p>SUGA GROUP / ORGANIC & COMPUTATIONAL CHEMISTRY</p><h1>Beyond<br /><i>the familiar.</i></h1><span>A world of molecules beyond our imagination.</span></div><div className="folio-entity"><ChemicalVoyage theme="silver" speed={2.5} english label="A conceptual journey through chemical space, toward a small light of discovery among countless possibilities." /></div></div><div className="folio-cover"><span className="folio-margin">THE UNKNOWN</span><div className="folio-intro"><h2>Searching for molecules beyond our imagination.</h2><p>{introductionEn}</p></div><a className="ds-link" href="#research">Our research ↘</a></div></section></div><div className="ds-body"><EnglishNews /><EnglishResearchOverview /><EnglishPeople /><section id="works" className="ds-section selected-publications"><div className="ds-section-head"><p>03 / SELECTED WORK</p><h2>{featuredPublications.length === 1 ? 'Selected publication' : 'Selected publications'}</h2><a className="research-all" href="/en/works">All research output ↗</a></div>{featuredPublications.map(p => <PublicationEntry key={p.id} publication={{...p, summary: p.doi === '10.1021/acs.jcim.6c00213' ? 'We developed CARBOT, a molecular generation method that defines a chemical space of π-conjugated hydrocarbons through structural transformation rules. By systematically generating diverse molecular frameworks, it provides a foundation for molecular exploration.' : p.summary}} compact english />)}</section><EnglishJoin /><EnglishCollaboration /><EnglishContact /></div></main></div><EnglishFooter /></div>;
}
