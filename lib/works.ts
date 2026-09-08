import publicationCsv from '@/data/publications.csv?raw';
import presentationCsv from '@/data/presentations.csv?raw';
import preprintCsv from '@/data/preprints.csv?raw';
import bookCsv from '@/data/books.csv?raw';
import studentCsv from '@/data/student-presentations.csv?raw';
import profileData from '@/data/profile.json';
import { selectedPublications } from '@/lib/work-model.mjs';
import { loadWorkCsv } from '@/lib/work-csv.mjs';
import type { Publication, Presentation, Book, Work, WorkTaxonomy } from '@/lib/work-types';

const data = loadWorkCsv({publications:publicationCsv,preprints:preprintCsv,books:bookCsv,lectures:presentationCsv,students:studentCsv});
export const publications = data.publications as Publication[];
export const presentations = data.presentations as Presentation[];
export const books = data.books as Book[];
export const workTaxonomy: WorkTaxonomy = data.taxonomy;
export const profile = profileData;
export const featuredPublications: Publication[] = selectedPublications(publications);
export const works: Work[] = [...publications, ...books, ...presentations].filter(w => w.visible).sort((a,b) => b.year-a.year || (a.type === 'presentation' && b.type === 'presentation' ? (b.date || '').localeCompare(a.date || '') : 0));
export function researchPublications(themeId: string) {
  return publications.filter(p => p.visible && p.themeIds.includes(themeId));
}
