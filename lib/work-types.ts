export type WorkGroup = 'saito-group' | 'externally-led' | 'suga-group' | 'unclassified';
export type WorkBase = {
  id: string; title: string; year: number; visible: boolean;
  themeIds: string[]; collaborationIds: string[] | null; group: WorkGroup;
  externallyLed?: boolean | null;
};
export type Publication = WorkBase & {
  type: 'article' | 'review' | 'preprint'; authors: string[]; journal: string;
  correspondingAuthors?: string[] | null;
  volume?: string; issue?: string; pages?: string; doi: string;
  featured: boolean; featuredOrder?: number; summary?: string; publicationNote?: string;
  sources?: string[]; chemrxivUrl?: string;
};
export type Presentation = WorkBase & {
  type: 'presentation'; authors: string[]; speakers: string[]; speakerRole: 'suga' | 'student' | 'other';
  category: 'lectures' | 'students';
  event: string; date?: string;
  scope: 'domestic' | 'international' | 'unclassified';
  invitation: 'invited' | 'contributed' | 'unclassified';
  format: 'oral' | 'poster' | 'other' | 'unclassified';
};
export type Book = WorkBase & {
  type: 'book'; authors: string[]; publisher: string;
  isbn?: string; contribution?: string; pages?: string; url?: string;
};
export type Work = Publication | Presentation | Book;
export type WorkTaxonomy = {
  themes: Array<{ id: string; label: string }>;
  collaborations: Array<{ id: string; label: string }>;
};
