import { parseCsv } from './work-csv.mjs';

export const newsCategories = ['論文掲載', '学会発表', 'メンバー加入', 'イベント'];
export function loadNewsCsv(source, { filename = 'news.csv', categories = newsCategories } = {}) {
  const columns = ['日付', '種別', '見出し', 'リンク'];
  const allowedColumns = [...columns, '英語見出し'];
  const [header, ...rows] = parseCsv(source);
  if (!header || new Set(header).size !== header.length || columns.some(c => !header.includes(c)) || header.some(c => !allowedColumns.includes(c))) {
    throw new Error(`${filename}: 列名は 日付,種別,見出し,リンク と、任意の 英語見出し にしてください。`);
  }
  return rows.map((cells, index) => {
    const fail = message => { throw new Error(`${filename} ${index + 2}行目: ${message}`); };
    if (cells.length !== header.length) fail('列数を確認してください。');
    const row = Object.fromEntries(header.map((key, i) => [key, cells[i]]));
    const match = row['日付'].match(/^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?$/);
    if (!match) fail('日付は YYYY-MM-DD または YYYY-MM にしてください。');
    const [, year, month, day] = match;
    const fullDate = `${year}-${month.padStart(2, '0')}-${(day || '1').padStart(2, '0')}`;
    const parsed = new Date(`${fullDate}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== fullDate) fail('存在しない日付です。');
    if (!categories.includes(row['種別'])) fail(`種別は ${categories.join('／')} から選んでください。`);
    if (!row['見出し']) fail('見出しを入力してください。');
    const url = row['リンク'];
    if (url) {
      if (/[\u0000-\u0020\\]/.test(url)) fail('リンクに空白や不正な文字が含まれています。');
      const internal = url.startsWith('/') && !url.startsWith('//');
      if (!internal) {
        try { if (!['https:', 'http:'].includes(new URL(url).protocol)) fail('リンクは https:// または / で始めてください。'); }
        catch { fail('リンクは有効なURL、または / から始まるサイト内のパスにしてください。'); }
      }
    }
    return { date: day ? fullDate : fullDate.slice(0, 7), category: row['種別'], title: row['見出し'], titleEn: row['英語見出し'] || '', url, order: index };
  }).sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order);
}

export function loadScheduleCsv(source) {
  return loadNewsCsv(source, { filename: 'schedule.csv', categories: [...newsCategories, '学会参加'] });
}

// A date passing does not prove that the planned event took place.
export function partitionSchedule(items, today) {
  const isUpcoming = item => item.date >= (item.date.length === 7 ? today.slice(0, 7) : today);
  return {
    upcoming: items.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date) || a.order - b.order),
    past: items.filter(item => !isUpcoming(item)).sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order),
  };
}
