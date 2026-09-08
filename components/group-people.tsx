import profile from '@/data/profile.json';
import members from '@/data/members.json';
import { researchThemes } from '@/lib/research-content';

type Member = { name: string; grade: string; themes: string[]; note?: string; visiting?: boolean };

function MemberList({ items, alumni = false }: { items: Member[]; alumni?: boolean }) {
  return <ul className="people-member-list">{items.map(member => <li key={member.name}>
    <div className="people-member-heading"><h4>{member.name}</h4><span>{alumni ? `${member.visiting ? '参加時' : '在籍時'} ${member.grade}` : member.grade}</span></div>
    <ul className="people-member-themes">{member.themes.map(id => {
      const theme = researchThemes.find(item => item.id === id);
      if (!theme) throw new Error(`学生メンバーの担当テーマが不明です: ${id}`);
      return <li key={id}><a href={`/research#${theme.id}`}><span>{theme.number}</span> {theme.title}</a></li>;
    })}</ul>
    {member.note && <p className="people-member-note">{member.note}</p>}
  </li>)}</ul>;
}

export function GroupPeople() {
  return <section id="people" className="ds-section group-people" aria-labelledby="people-heading">
    <div className="ds-section-head"><p>02 / PEOPLE</p><h2 id="people-heading">須賀グループの人たち</h2></div>
    <div className="people-overview">
      <article className="people-leader">
        <div className="people-leader-heading">
          <img className="people-portrait" src={profile.photo} alt="須賀 健介" width={150} height={200} loading="lazy" />
          <div>
            <p className="ds-kicker">GROUP LEADER</p>
            <h3>{profile.nameJa}<small className="profile-english">{profile.nameEn}</small></h3>
            <p>{profile.affiliationJa}<br />{profile.positionJa}</p>
          </div>
        </div>
        <p className="people-biography">分子探索を軸に、計算化学・有機合成・高分子科学をつなぐ研究に取り組んでいます。</p>
        <div className="people-profile-links">
          <a className="ds-link" href="/profile">須賀 健介のプロフィール <span aria-hidden="true">↗</span></a>
          <a className="ds-link" href="/making">つくる・いじる <span aria-hidden="true">↗</span></a>
        </div>
      </article>
      <div className="people-students">
        {members.students.length > 0 && <div><h3>学生メンバー</h3><MemberList items={members.students} /></div>}
        {members.projectStudents.length > 0 && <div className="people-member-group"><h3>プロジェクト参加</h3><MemberList items={members.projectStudents} /></div>}
        {members.alumni.length > 0 && <details className="people-details people-member-group">
          <summary>卒業生・過去の参加者 <span aria-hidden="true">＋</span></summary><MemberList items={members.alumni} alumni />
        </details>}
      </div>
    </div>
  </section>;
}
