import type { Metadata } from 'next';
import './globals.css';
import './lab-design.css';
import './design-studies.css';
import './research.css';
import './works.css';
import './join.css';
import './people.css';
import './news.css';
import './english.css';

export const metadata: Metadata = {
  icons: { icon: [{ url: '/favicon.svg?v=suga-reverse-1', type: 'image/svg+xml' }] },
  title: '須賀グループ | SUGA GROUP',
  description: '須賀グループは、化学空間の構築と分子探索、π共役分子の合成と機能探索、高分子の構造制御と力学物性を研究します。',
};

export default async function RootLayout({
  children, params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang === 'en' ? 'en' : 'ja'}>
      <body>{children}</body>
    </html>
  );
}
