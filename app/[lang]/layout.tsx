import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Suga Group | The University of Osaka', description: 'Exploring chemical space, synthesizing functional π-conjugated molecules, and investigating polymer structure and mechanics.' };
export const dynamicParams = false;
export function generateStaticParams() { return [{ lang: 'en' }]; }
export default async function EnglishLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  if ((await params).lang !== 'en') notFound();
  return <div lang="en">{children}</div>;
}
