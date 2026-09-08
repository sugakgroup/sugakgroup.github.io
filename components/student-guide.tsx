import profile from '@/data/profile.json';

export function StudentGuide() {
  const inquiry = `mailto:${profile.email}?subject=${encodeURIComponent('研究室見学・進学の相談')}`;
  return <section id="join" className="ds-section ds-join student-guide" aria-labelledby="join-heading">
    <div className="ds-join-intro">
      <p className="ds-kicker">04 / JOIN THE GROUP</p>
      <h2 id="join-heading">まだ知らない性質を、<br />自分の手で見つける。</h2>
      <p>計算で分子を探す。自分で合成し、その性質を確かめる。高分子の構造をつくり、力学応答を調べる。須賀グループでは、それぞれの興味を出発点に、研究テーマを考えていきます。</p>
      <p>学部生の研究室配属から、修士・博士課程への進学まで、他大学や海外からの参加も歓迎します。有機合成・量子化学・プログラミングの経験は問いません。研究に必要な知識や技術を、実際の研究を通じて身につけていきます。</p>
      <a href={inquiry} className="ds-link">見学・オンライン相談を申し込む <span aria-hidden="true">↗</span></a>
      <p className="student-visit-note">相談は随時受け付けています。見学やオンラインでの面談の日程は、メールでご相談ください。</p>
    </div>
    <div className="ds-join-guide">
      <details open>
        <summary><span>01</span>研究テーマの決め方<b aria-hidden="true">＋</b></summary>
        <p>学生の興味や希望を聞いたうえで、須賀が最初のテーマを設定します。研究の進め方が身につくにつれて、学生自身が次の問いや展開を考える機会を増やし、裁量を広げていきます。</p>
      </details>
      <details open>
        <summary><span>02</span>相談とディスカッション<b aria-hidden="true">＋</b></summary>
        <p>研究を始めたばかりの時期は、必要に応じて毎日でも相談します。自分で研究を進められるようになってからも、少なくとも2週間に1度はディスカッションの時間を設けます。</p>
      </details>
      <details>
        <summary><span>03</span>研究の自由度<b aria-hidden="true">＋</b></summary>
        <p>学生の発想を尊重し、自分で考えた小さな試行を進める自由を大切にします。論文化を目指す研究テーマとして本格的に進める際には、須賀と相談し、承認を得たうえで取り組みます。</p>
      </details>
      <details>
        <summary><span>04</span>配属・進学について相談するには<b aria-hidden="true">＋</b></summary>
        <p>研究室見学やオンラインでの相談は、随時受け付けています。所属・学年、関心のある研究、希望する進学時期や相談方法を、分かる範囲でメールにお書きください。研究テーマがまだ具体的に決まっていない方も、お気軽にご相談ください。</p>
        <a className="student-email" href={inquiry}>{profile.email}</a>
      </details>
    </div>
  </section>;
}
