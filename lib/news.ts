import source from '@/data/news.csv?raw';
import scheduleSource from '@/data/schedule.csv?raw';
import { loadNewsCsv, loadScheduleCsv, partitionSchedule } from '@/lib/news-model.mjs';

export type NewsItem = { date: string; category: string; title: string; titleEn: string; url: string; order: number };
export const news: NewsItem[] = loadNewsCsv(source);
export const schedule: NewsItem[] = loadScheduleCsv(scheduleSource);
export function getSchedule(): { upcoming: NewsItem[]; past: NewsItem[] } {
  const todayInJapan = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return partitionSchedule(schedule, todayInJapan);
}
