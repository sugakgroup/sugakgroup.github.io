import { validateWorkContent } from './work-model.mjs';

export const publicationColumns = ['年','タイトル','著者','責任著者','掲載誌','巻','号','ページ','DOI','種別','テーマ','共同研究','仕事区分','代表','紹介文','注記','表示','確認元','ChemRxiv'];
export const preprintColumns = publicationColumns.filter(name => name !== '種別');
export const presentationColumns = ['年','演題','著者','発表者','学会・講演会','日付','国内・国際','招待区分','発表形式','テーマ','仕事区分','表示'];
export const bookColumns = ['年','書名','著者','出版社','ISBN','担当','ページ','テーマ','共同研究','仕事区分','URL','表示'];
export const workCsvFiles = {publications:'publications.csv',preprints:'preprints.csv',books:'books.csv',lectures:'presentations.csv',students:'student-presentations.csv'};
const themes = [
  {id:'chemical-space',label:'化学空間の構築と分子探索',short:'化学空間'},
  {id:'organic-synthesis',label:'π共役分子の合成と機能探索',short:'有機合成'},
  {id:'polymer-structure',label:'高分子の構造制御と力学物性',short:'高分子'},
];

// Excel's UTF-8 BOM, quoted commas, escaped quotes and multiline cells.
export function parseCsv(input) {
  const source = input.replace(/^\uFEFF/, '');
  const rows = []; let row = [], cell = '', quoted = false, closed = false;
  const finishCell = () => { row.push(cell.trim()); cell = ''; closed = false; };
  const finishRow = () => { finishCell(); if (row.some(Boolean)) rows.push(row); row = []; };
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (c === '"' && source[i+1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else cell += c;
    } else if (c === ',') finishCell();
    else if (c === '\n' || c === '\r') { if (c === '\r' && source[i+1] === '\n') i++; finishRow(); }
    else if (c === '"' && cell === '' && !closed) quoted = true;
    else if (closed || c === '"') throw new Error('CSVの引用符を確認してください。ExcelからCSV UTF-8で保存できます。');
    else cell += c;
  }
  if (quoted) throw new Error('CSVの引用符が閉じられていません。');
  if (cell || row.length || closed) finishRow();
  return rows;
}

export function encodeCsv(rows) {
  const escape = value => { const s = String(value ?? ''); return /[",\r\n]/.test(s) ? `"${s.replaceAll('"','""')}"` : s; };
  return '\uFEFF' + rows.map(row => row.map(escape).join(',')).join('\r\n') + '\r\n';
}

function records(source, columns, required, filename) {
  const [header, ...rows] = parseCsv(source);
  if (!header || new Set(header).size !== header.length || header.some(h => !columns.includes(h)) || required.some(h => !header.includes(h))) throw new Error(`${filename}: 列名を確認してください。必須列: ${required.join('、')}`);
  return rows.map((row, i) => {
    if (row.length !== header.length) throw new Error(`${filename}: ${i+2}番目のレコードの列数が見出しと一致しません。`);
    return Object.fromEntries(header.map((name, j) => [name, row[j]]));
  });
}
const split = value => (value || '').split(/[;；]/).map(s => s.trim()).filter(Boolean);
function choice(value, choices, fallback, field) {
  if (!value || value === '未分類') return fallback;
  if (Object.hasOwn(choices, value)) return choices[value];
  throw new Error(`${field}: 「${value}」は使えません。${Object.keys(choices).join('／')} または空欄にしてください。`);
}
function key(value) {
  // Stable IDs without asking editors to maintain an extra column.
  return Array.from(value).map(c => c.codePointAt(0).toString(16)).join('-');
}
export function loadWorkCsv(csv) {
  const projects = new Set();
  const common = row => {
    const collaborations = !row['共同研究'] || row['共同研究'] === '未分類' ? null : row['共同研究'] === 'なし' ? [] : split(row['共同研究']);
    const externallyLed = collaborations === null ? null : collaborations.length > 0;
    const partners = collaborations?.filter(name => !['共同研究', 'あり', '他グループ主導'].includes(name));
    partners?.forEach(name => projects.add(name));
    return {
      year:Number(row['年']), title:row['タイトル'] || row['演題'] || row['書名'],
      visible:choice(row['表示'],{'表示':true,'非表示':false},true,'表示'),
      themeIds:split(row['テーマ']).filter(name => name !== '未分類').map(name => {
        const theme = themes.find(t => [t.id,t.label,t.short].includes(name));
        if (!theme) throw new Error(`テーマ: 「${name}」は使えません。化学空間／有機合成／高分子を指定してください。`);
        return theme.id;
      }),
      externallyLed,
      collaborationIds:partners?.map(name => `project-${key(name)}`) ?? null,
      group:choice(row['仕事区分'],{'齊藤グループ':'saito-group','齊藤グループでの仕事':'saito-group','他グループ主導':'externally-led','須賀グループ':'suga-group','須賀グループの仕事':'suga-group','Suga Group':'suga-group','その他':'unclassified'},'unclassified','仕事区分'),
    };
  };
  const publications = ['publications', 'preprints'].flatMap(category => records(csv[category],category === 'preprints' ? preprintColumns : publicationColumns,['年','タイトル','著者','掲載誌','DOI'],workCsvFiles[category]).map(row => {
    const doi = row['DOI'].replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'').trim();
    const featured = !!row['代表'];
    if (featured && !/^[1-9]\d*$/.test(row['代表'])) throw new Error('代表: 掲載順を1、2、3…で指定するか、空欄にしてください。');
    return {...common(row), id:`paper-${key(doi.toLowerCase())}`,doi,
      type:category === 'preprints' ? 'preprint' : choice(row['種別'],{'論文':'article','総説':'review'},'article','種別'),
      authors:split(row['著者']), correspondingAuthors:row['責任著者'] ? split(row['責任著者']) : null,
      journal:row['掲載誌'],volume:row['巻'] || '',issue:row['号'] || '',pages:row['ページ'] || '',
      chemrxivUrl:row['ChemRxiv'] || '',
      featured,featuredOrder:featured ? Number(row['代表']) : 0,summary:row['紹介文'] || '',publicationNote:row['注記'] || '',sources:split(row['確認元']),
    };
  }));
  let draftPresentationCount = 0;
  const presentations = ['lectures', 'students'].flatMap(category => {
    const presentationRows = records(csv[category],presentationColumns,['年','演題','発表者','学会・講演会'],workCsvFiles[category]);
    draftPresentationCount += presentationRows.filter(row => !row['演題'] && !row['学会・講演会']).length;
    return presentationRows.filter(row => row['演題'] || row['学会・講演会']).map(row => {
    let date = row['日付'] || '';
    // Excel may save the same year/month cell in either order.
    date = date.replace(/^(\d{2}|\d{4})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i, '$2-$1');
    const excelMonth = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}|\d{4})$/i.exec(date);
    if (excelMonth && (excelMonth[2].length === 2 ? String(row['年']).slice(-2) === excelMonth[2] : row['年'] === excelMonth[2])) {
      const month = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(excelMonth[1].toLowerCase())+1;
      date = `${row['年']}-${String(month).padStart(2,'0')}`;
    }
    const parts = /^(\d{4})[\/-](\d{1,2})(?:[\/-](\d{1,2}))?$/.exec(date);
    if (parts) date = `${parts[1]}-${parts[2].padStart(2,'0')}${parts[3] ? `-${parts[3].padStart(2,'0')}` : ''}`;
    return {...common(row),id:`talk-${key([row['年'],date,row['演題'],row['発表者'],row['学会・講演会'],row['発表形式'] || ''].join('|'))}`,type:'presentation',category,
      authors:split(row['著者'] || row['発表者']),
      speakers:split(row['発表者']),speakerRole:category === 'students' ? 'student' : split(row['発表者']).every(name => ['須賀 健介','須賀健介','Kensuke Suga'].includes(name)) ? 'suga' : 'other',
      event:row['学会・講演会'],date,
      scope:choice(row['国内・国際'],{'国内':'domestic','国際':'international'},'unclassified','国内・国際'),
      invitation:choice(row['招待区分'],{'招待':'invited','一般':'contributed'},'unclassified','招待区分'),
      format:choice(row['発表形式'],{'口頭':'oral','ポスター':'poster','その他':'other'},'unclassified','発表形式'),
    };
    });
  });
  const books = records(csv.books,bookColumns,['年','書名','著者','出版社'],workCsvFiles.books).map(row => ({
    ...common(row),id:`book-${key([row['年'],row['書名'],row['著者'],row['担当'] || ''].join('|'))}`,type:'book',
    authors:split(row['著者']),publisher:row['出版社'],isbn:row['ISBN'] || '',contribution:row['担当'] || '',pages:row['ページ'] || '',url:row['URL'] || '',
  }));
  const taxonomy = {themes:themes.map(({id,label}) => ({id,label})),collaborations:[...projects].sort().map(label => ({id:`project-${key(label)}`,label}))};
  validateWorkContent({publications},{presentations},taxonomy,{books});
  return {publications,presentations,books,taxonomy,draftPresentationCount};
}
