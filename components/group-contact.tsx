import profile from '@/data/profile.json';

export function GroupContact() {
  return <section id="contact" className="ds-section ds-contact group-contact" aria-labelledby="contact-heading">
    <p className="ds-kicker">06 / CONTACT & ACCESS</p>
    <div>
      <div><h2 id="contact-heading">お問い合わせ</h2><p>須賀グループ<br />{profile.affiliationJa}<br />{profile.positionJa}　{profile.nameJa}</p></div>
      <div className="group-contact-address">
        <h3>研究室見学・進学・共同研究のご相談</h3>
        <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
        <p>見学・オンライン相談は随時受け付けています。<br />日程や相談したい内容を、メールでお知らせください。</p>
        <div className="contact-location" id="access"><h3>所在地・アクセス</h3><address>〒{profile.postalCode}<br />{profile.addressJa}<br />大阪大学 {profile.roomJa}</address><p>見学をご希望の方は、事前にメールで日程をご相談ください。</p></div>
      </div>
    </div>
  </section>;
}
