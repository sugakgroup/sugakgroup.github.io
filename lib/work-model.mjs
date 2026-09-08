export const defaultWorkFilters = {
  kind: 'all', theme: 'all', collaboration: 'all', group: 'all',
  speaker: 'all', invitation: 'all', year: 'all', scope: 'all',
};

export function filterWorks(works, filters) {
  const f = { ...defaultWorkFilters, ...filters };
  return works.filter(work => {
    if (!work.visible) return false;
    const talk = work.type === 'presentation';
    const externallyLed = work.externallyLed ?? (work.collaborationIds === null ? null : !!work.collaborationIds?.length);
    if (f.kind === 'publications' && !['article', 'review'].includes(work.type)) return false;
    if (f.kind === 'lectures' && (!talk || work.category !== 'lectures')) return false;
    if (f.kind === 'students' && (!talk || work.category !== 'students')) return false;
    if (f.kind === 'books' && work.type !== 'book') return false;
    if (f.kind === 'preprints' && work.type !== 'preprint') return false;
    if (f.theme === 'unclassified' ? work.themeIds.length !== 0 : f.theme !== 'all' && !work.themeIds.includes(f.theme)) return false;
    if (f.group !== 'all' && work.group !== f.group) return false;
    if (f.year !== 'all' && String(work.year) !== f.year) return false;
    if (f.collaboration === 'unclassified' && externallyLed !== null) return false;
    if (f.collaboration === 'yes' && externallyLed !== true) return false;
    if (f.collaboration === 'no' && externallyLed !== false) return false;
    if (f.collaboration.startsWith('project:') && !work.collaborationIds?.includes(f.collaboration.slice(8))) return false;
    if (f.speaker !== 'all' && (!talk || work.speakerRole !== f.speaker)) return false;
    if (f.invitation !== 'all' && (!talk || work.invitation !== f.invitation)) return false;
    if (f.scope !== 'all' && (!talk || work.scope !== f.scope)) return false;
    return true;
  });
}

export function selectedPublications(publications) {
  return publications.filter(p => p.visible && p.featured).sort((a, b) =>
    (a.featuredOrder || 0) - (b.featuredOrder || 0) || b.year - a.year || a.id.localeCompare(b.id));
}

export function isPresentationDate(value, year) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}(?:-\d{2})?$/.test(value) || Number(value.slice(0,4)) !== year) return false;
  const fullDate = value.length === 7 ? `${value}-01` : value;
  const timestamp = Date.parse(fullDate);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0,10) === fullDate;
}

export function validateWorkContent(publicationData, presentationData, taxonomy, bookData = { books: [] }) {
  const errors = [];
  const fail = (where, message) => errors.push(`${where}: ${message}`);
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const list = value => Array.isArray(value) && value.every(text);
  const reserved = ['all', 'unclassified', 'yes', 'no'];
  for (const key of ['themes', 'collaborations']) {
    if (!Array.isArray(taxonomy?.[key])) { fail(key, '配列が必要です'); continue; }
    const seen = new Set();
    for (const item of taxonomy[key]) {
      if (!item || !text(item.id) || !text(item.label) || reserved.includes(item.id) || seen.has(item.id)) fail(key, 'idとlabelを指定し、idの重複・予約語を避けてください');
      if (item) seen.add(item.id);
    }
  }
  const themes = new Set((taxonomy?.themes || []).map(x => x?.id));
  const collaborations = new Set((taxonomy?.collaborations || []).map(x => x?.id));
  const ids = new Set(), dois = new Set();
  for (const [key, data] of [['publications', publicationData], ['presentations', presentationData], ['books', bookData]]) {
    if (!Array.isArray(data?.[key])) { fail(key, '配列が必要です'); continue; }
    for (const [i, work] of data[key].entries()) {
      const where = `${key}[${i}] (${work?.id || 'id未設定'})`;
      if (!work || typeof work !== 'object') { fail(where, 'オブジェクトが必要です'); continue; }
      if (!text(work.id) || !/^[a-z0-9][a-z0-9-]*$/.test(work.id) || ids.has(work.id)) fail(where, 'idは重複しない英小文字・数字・ハイフンにしてください');
      ids.add(work.id);
      if (!text(work.title)) fail(where, 'titleが必要です');
      if (!Number.isInteger(work.year) || work.year < 1900 || work.year > 2200) fail(where, 'yearは西暦の数値で指定してください');
      if (typeof work.visible !== 'boolean') fail(where, 'visibleはtrueまたはfalseです');
      if (!['saito-group', 'externally-led', 'suga-group', 'unclassified'].includes(work.group)) fail(where, 'groupが不正です');
      if (work.externallyLed != null && typeof work.externallyLed !== 'boolean') fail(where, 'externallyLedはtrue、false、nullです');
      if (!list(work.themeIds) || work.themeIds.some(id => !themes.has(id))) fail(where, 'themeIdsは設定済みのテーマIDの配列にしてください');
      if (work.collaborationIds !== null && (!list(work.collaborationIds) || work.collaborationIds.some(id => !collaborations.has(id)))) fail(where, 'collaborationIdsはnullまたは設定済みの共同研究IDの配列です');
      if (key === 'publications') {
        if (!['article', 'review', 'preprint'].includes(work.type)) fail(where, 'typeが不正です');
        if (!list(work.authors) || !work.authors.length || !text(work.journal)) fail(where, 'authorsとjournalが必要です');
        if (work.correspondingAuthors != null && (!list(work.correspondingAuthors) || new Set(work.correspondingAuthors).size !== work.correspondingAuthors.length || work.correspondingAuthors.some(author => !work.authors?.includes(author)))) fail(where, 'correspondingAuthorsはauthorsと同じ表記の著者名を重複なく指定してください');
        const doi = typeof work.doi === 'string' ? work.doi.toLowerCase() : '';
        if (!/^10\.\d{4,9}\/\S+$/.test(doi) || dois.has(doi)) fail(where, 'doiはURLを付けず、重複しない値にしてください');
        dois.add(doi);
        if (typeof work.featured !== 'boolean') fail(where, 'featuredはtrueまたはfalseです');
        if (work.chemrxivUrl) {
          try {
            const url = new URL(work.chemrxivUrl);
            const chemrxiv = url.hostname === 'chemrxiv.org' || url.hostname === 'www.chemrxiv.org';
            const cambridge = ['cambridge.org','www.cambridge.org'].includes(url.hostname) && url.pathname.startsWith('/engage/chemrxiv/');
            const doiLink = url.hostname === 'doi.org' && /^\/10\.26434\/chemrxiv[.-]/i.test(url.pathname);
            if (url.protocol !== 'https:' || url.username || url.password || !(chemrxiv || cambridge || doiLink)) throw new Error();
          } catch { fail(where, 'ChemRxivにはChemRxiv掲載ページまたはChemRxiv DOIのhttps URLを入力してください'); }
        }
        if (work.featured && !text(work.summary)) fail(where, '代表論文にはsummaryを設定してください');
        if (work.featuredOrder !== undefined && (!Number.isInteger(work.featuredOrder) || work.featuredOrder < 0)) fail(where, 'featuredOrderは0以上の整数です');
        for (const field of ['volume', 'issue', 'pages', 'summary', 'publicationNote']) if (work[field] !== undefined && typeof work[field] !== 'string') fail(where, `${field}は文字列です`);
      } else if (key === 'books') {
        if (work.type !== 'book') fail(where, 'typeはbookです');
        if (!list(work.authors) || !work.authors.length || !text(work.publisher)) fail(where, '著書の著者と出版社が必要です');
        for (const field of ['isbn', 'contribution', 'pages']) if (work[field] !== undefined && typeof work[field] !== 'string') fail(where, `${field}は文字列です`);
        if (work.url) { try { if (new URL(work.url).protocol !== 'https:') fail(where, 'urlはhttpsで指定してください'); } catch { fail(where, 'urlが不正です'); } }
      } else {
        if (work.type !== 'presentation') fail(where, 'typeはpresentationです');
        if (!['lectures', 'students'].includes(work.category)) fail(where, '講演・学生発表の区分が不正です');
        if (!list(work.speakers) || !work.speakers.length || !text(work.event)) fail(where, 'speakersとeventが必要です');
        if (!list(work.authors) || !work.authors.length) fail(where, '講演の著者が必要です');
        if (list(work.speakers) && (new Set(work.speakers).size !== work.speakers.length || work.speakers.some(name => !work.authors?.includes(name)))) fail(where, '発表者は著者欄と同じ表記で、重複なく指定してください');
        if (!['suga', 'student', 'other'].includes(work.speakerRole)) fail(where, 'speakerRoleが不正です');
        if (!['invited', 'contributed', 'unclassified'].includes(work.invitation)) fail(where, 'invitationが不正です');
        if (!['domestic', 'international', 'unclassified'].includes(work.scope)) fail(where, '国内・国際の区分が不正です');
        if (!['oral', 'poster', 'other', 'unclassified'].includes(work.format)) fail(where, 'formatが不正です');
        if (work.date && !isPresentationDate(work.date,work.year)) fail(where, 'dateはyearと一致する実在の年月YYYY-MMまたは日付YYYY-MM-DDです');
        if (work.url) { try { if (new URL(work.url).protocol !== 'https:') fail(where, 'urlはhttpsで指定してください'); } catch { fail(where, 'urlが不正です'); } }
      }
    }
  }
  if (errors.length) throw new Error(`業績データを確認してください。\n${errors.join('\n')}`);
}
