import { EnglishFrame } from '@/components/english-site';
import { WorkList } from '@/components/work-list';
import { works, workTaxonomy, profile } from '@/lib/works';
import { ResearchProfileLinks } from '@/components/research-profile-links';
import { themesEn } from '@/lib/english-content';
export const metadata = { title: 'Publications & Presentations | Suga Group', description: 'Articles, reviews, preprints, books, and English-language presentations by Kensuke Suga. Browse by research theme, research context, collaborator, and year.' };
export function generateStaticParams() { return [{ lang: 'en' }]; }
export default function Page() {
  const taxonomy = { ...workTaxonomy, themes: themesEn.map(t => ({ id: t.id, label: t.title })) };
  // English-titled entries from Suga's talk list are used for the English site.
  // Conference scope is independent: domestic conferences can have English talks.
  const englishWorks = works.filter(w => w.type !== 'presentation' || (w.category === 'lectures' && w.speakerRole === 'suga' && /[A-Za-z]/.test(w.title) && !/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(w.title)));
  return <EnglishFrame title="Publications & presentations" section="works"><header className="works-introduction"><p className="research-eyebrow">PUBLICATIONS & PRESENTATIONS</p><h1>Research output</h1><p>Articles, reviews, preprints, and books, alongside English-language presentations by Kensuke Suga. Bibliographic titles and author names are retained in their original language.</p><ResearchProfileLinks orcid={profile.orcid} /></header><WorkList works={englishWorks} taxonomy={taxonomy} english /></EnglishFrame>;
}
