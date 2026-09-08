import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, encodeCsv, loadWorkCsv as loadCsv, publicationColumns, preprintColumns, presentationColumns, bookColumns } from '../lib/work-csv.mjs';
import { filterWorks } from '../lib/work-model.mjs';
const emptyCsv = {
  publications:encodeCsv([publicationColumns]),preprints:encodeCsv([preprintColumns]),books:encodeCsv([bookColumns]),lectures:encodeCsv([presentationColumns]),students:encodeCsv([presentationColumns]),
};
const loadWorkCsv = (papers, talks) => loadCsv({...emptyCsv,publications:papers,students:talks});
const papers = '年,タイトル,著者,掲載誌,DOI,責任著者,テーマ,共同研究,仕事区分\n2026,"Title, with comma",Author A; Author B,Journal,https://doi.org/10.1234/test,Author B,化学空間; 有機合成,共同研究A; 共同研究B,須賀グループ\n';
const talks = '年,演題,発表者,学会・講演会,日付,招待区分,発表形式\n2026,講演,学生A,学会,2026/9/5,招待,口頭\n';

test('externally led research can be recorded before partner names are known', () => {
  const rows = [['年','タイトル','著者','掲載誌','DOI','共同研究'],
    ['2026','Pending partner','Author','Journal','10.1234/pending','共同研究'],
    ['2026','Named partners','Author','Journal','10.1234/named','他グループ主導; Group A; Group B'],
    ['2026','Not external','Author','Journal','10.1234/no','なし'],
    ['2026','Unclassified','Author','Journal','10.1234/unknown','']];
  const data = loadCsv({...emptyCsv, publications:encodeCsv(rows)});
  assert.deepEqual(data.taxonomy.collaborations.map(p => p.label), ['Group A','Group B']);
  assert.deepEqual(data.publications[0].collaborationIds, []);
  assert.deepEqual(filterWorks(data.publications,{collaboration:'yes'}).map(p => p.title), ['Pending partner','Named partners']);
  assert.deepEqual(filterWorks(data.publications,{collaboration:'no'}).map(p => p.title), ['Not external']);
  assert.deepEqual(filterWorks(data.publications,{collaboration:'unclassified'}).map(p => p.title), ['Unclassified']);
  assert.deepEqual(filterWorks(data.publications,{collaboration:`project:${data.taxonomy.collaborations[0].id}`}).map(p => p.title), ['Named partners']);
});

test('three work categories are independent of named collaboration partners', () => {
  const rows = [['年','タイトル','著者','掲載誌','DOI','仕事区分','共同研究'],
    ['2026','Saito work','Author','Journal','10.1234/saito','齊藤グループ','Partner A'],
    ['2026','External work','Author','Journal','10.1234/external','他グループ主導','Partner A'],
    ['2026','Suga work','Author','Journal','10.1234/suga','須賀グループの仕事','Partner B'],
    ['2026','Unknown work','Author','Journal','10.1234/unknown','','Partner A']];
  const data = loadCsv({...emptyCsv,publications:encodeCsv(rows)});
  assert.deepEqual(data.publications.map(p => p.group), ['saito-group','externally-led','suga-group','unclassified']);
  const partner = `project:${data.taxonomy.collaborations.find(p => p.label === 'Partner A').id}`;
  assert.deepEqual(filterWorks(data.publications,{collaboration:partner}).map(p => p.title), ['Saito work','External work','Unknown work']);
  assert.deepEqual(filterWorks(data.publications,{group:'externally-led',collaboration:partner}).map(p => p.title), ['External work']);
  assert.deepEqual(filterWorks(data.publications,{group:'suga-group',collaboration:partner}), []);
  assert.equal(filterWorks(data.publications,{group:'saito-group'}).length, 1);
});
test('Excel CSV round trips BOM, commas, quotes, multiline cells and Japanese',()=>{
  const rows=[['見出し','著者'],['comma, quote " line\r\nbreak','須賀 健介']];
  assert.deepEqual(parseCsv(encodeCsv(rows)),rows);
  assert.throws(()=>parseCsv('a,b\n"unfinished,b'),/引用符/);
});

test('optional ChemRxiv links preserve publication identity and reject unrelated URLs',()=>{
  const row = ['2026','Article','Author','Journal','10.1234/paper'];
  const header = ['年','タイトル','著者','掲載誌','DOI'];
  const old = loadCsv({...emptyCsv,publications:encodeCsv([header,row])}).publications[0];
  assert.equal(old.chemrxivUrl,'');
  for (const url of ['https://chemrxiv.org/engage/chemrxiv/article-details/example','https://www.cambridge.org/engage/chemrxiv/article-details/example','https://doi.org/10.26434/chemrxiv-2024-example']) {
    const loaded = loadCsv({...emptyCsv,publications:encodeCsv([[...header,'ChemRxiv'],[...row,url]])}).publications;
    assert.equal(loaded.length,1);
    assert.equal(loaded[0].id,old.id);
    assert.equal(loaded[0].chemrxivUrl,url);
  }
  for (const url of ['javascript:alert(1)','https://example.com','https://chemrxiv.org.example.com/paper','https://doi.org/10.1021/example','https://user@chemrxiv.org/paper']) {
    assert.throws(()=>loadCsv({...emptyCsv,publications:encodeCsv([[...header,'ChemRxiv'],[...row,url]])}),/ChemRxiv/);
  }
});
test('conference scope can be entered and filtered for both presentation categories',()=>{
  for (const category of ['lectures','students']) {
    const rows = [['年','演題','発表者','学会・講演会','国内・国際'],
      ['2026','Domestic talk','Speaker','Conference','国内'],
      ['2026','International talk','Speaker','Conference','国際'],
      ['2026','Unknown talk','Speaker','Conference','']];
    const data = loadCsv({...emptyCsv,publications:papers,[category]:encodeCsv(rows)});
    const works = [...data.publications,...data.presentations];
    for (const [scope,title] of [['domestic','Domestic talk'],['international','International talk'],['unclassified','Unknown talk']]) {
      assert.deepEqual(filterWorks(works,{kind:category,scope,year:'2026'}).map(w=>w.title),[title]);
    }
    assert.equal(filterWorks(works,{kind:category}).length,3);
    rows[1][4] = '国債';
    assert.throws(()=>loadCsv({...emptyCsv,[category]:encodeCsv(rows)}),/国内・国際/);
  }
  assert.equal(loadWorkCsv(papers,talks).presentations[0].scope,'unclassified');
});
test('Japanese columns generate all filters and corresponding authors with minimal entry',()=>{
  const data=loadWorkCsv(papers,talks), p=data.publications[0], t=data.presentations[0];
  assert.equal(p.type,'article'); assert.equal(p.visible,true); assert.equal(p.featured,false);
  assert.deepEqual(p.correspondingAuthors,['Author B']);
  assert.deepEqual(p.themeIds,['chemical-space','organic-synthesis']);
  assert.equal(p.group,'suga-group'); assert.equal(p.doi,'10.1234/test');
  assert.equal(data.taxonomy.collaborations.length,2);
  assert.equal(t.collaborationIds,null);
  assert.equal(t.date,'2026-09-05'); assert.equal(t.speakerRole,'student'); assert.equal(t.invitation,'invited');
});
test('typos and nonexistent corresponding authors stop publication',()=>{
  assert.throws(()=>loadWorkCsv(papers.replace('Author B,化学空間','Unknown Author,化学空間'),talks),/correspondingAuthors/);
  assert.throws(()=>loadWorkCsv(papers.replace('化学空間','不明なテーマ'),talks),/テーマ/);
  assert.throws(()=>loadWorkCsv(papers.replace('仕事区分','typo'),talks),/列名/);
  assert.throws(()=>loadWorkCsv(papers.replace('2026,"Title','2026,extra,"Title'),talks),/列数/);
});

test('joint presentations preserve author order and identify only the actual speakers',()=>{
  const joint = '年,演題,著者,発表者,学会・講演会\n2026,Joint talk,学生A; 須賀 健介; 学生B,学生B; 学生A,学会\n';
  const talk = loadWorkCsv(papers,joint).presentations[0];
  assert.deepEqual(talk.authors,['学生A','須賀 健介','学生B']);
  assert.deepEqual(talk.authors.filter(name => talk.speakers.includes(name)),['学生A','学生B']);
  assert.equal(talk.speakerRole,'student');
  assert.deepEqual(loadWorkCsv(papers,talks).presentations[0].authors,['学生A']);
  assert.throws(()=>loadWorkCsv(papers,joint.replace('学生B; 学生A,学会','存在しない名前,学会')),/発表者は著者欄/);
});

test('oral and poster presentations of the same work are distinct, exact duplicates are rejected',()=>{
  const rows = parseCsv(talks);
  const poster = [...rows[1]]; poster[rows[0].indexOf('発表形式')] = 'ポスター';
  const both = loadWorkCsv(papers,encodeCsv([...rows,poster])).presentations;
  assert.equal(both.length,2);
  assert.notEqual(both[0].id,both[1].id);
  assert.throws(()=>loadWorkCsv(papers,encodeCsv([...rows,rows[1]])),/idは重複/);
});

test('year-only or author-only draft rows are skipped but incomplete named talks still fail',()=>{
  const drafts = '年,演題,発表者,学会・講演会\n2026,,,\n2025,,Kensuke Suga,\n';
  const result = loadWorkCsv(papers,drafts);
  assert.equal(result.presentations.length,0);
  assert.equal(result.draftPresentationCount,2);
  assert.throws(()=>loadWorkCsv(papers,drafts.replace('2026,,,','2026,演題のみ,,')),/speakersとevent/);
});

test('five source files map to separate categories and books need no DOI',()=>{
  const csv={...emptyCsv,publications:papers,students:talks,
    preprints:'年,タイトル,著者,掲載誌,DOI\n2026,Preprint,Author A,ChemRxiv,10.1234/preprint\n',
    books:'年,書名,著者,出版社,担当,ISBN,URL\n2025,Book title,Author A,Publisher,Chapter 2,978-4-000000-00-0,https://example.com/book\n',
    lectures:talks.replaceAll('学生A','Kensuke Suga'),
  };
  const result=loadCsv(csv), works=[...result.publications,...result.books,...result.presentations];
  for(const kind of ['publications','preprints','books','lectures','students']) assert.equal(filterWorks(works,{kind}).length,1,kind);
  assert.equal(result.books[0].contribution,'Chapter 2');
  assert.equal(result.presentations.find(t=>t.category==='students').speakerRole,'student');
  assert.throws(()=>loadCsv({...csv,books:csv.books.replace(',Publisher,',',,')}),/出版社/);
  assert.throws(()=>loadCsv({...csv,preprints:csv.preprints.replace('10.1234/preprint','10.1234/test')}),/doi/);
  assert.throws(()=>loadCsv({...csv,lectures:talks}),/idは重複/);
});

test('month-only presentation dates retain their precision and reject impossible dates',()=>{
  const month=loadWorkCsv(papers,talks.replace('2026/9/5','2026/9')).presentations[0];
  assert.equal(month.date,'2026-09');
  assert.equal(loadWorkCsv(papers,talks.replace('2026/9/5','Sep-26')).presentations[0].date,'2026-09');
  assert.equal(loadWorkCsv(papers,talks.replace('2026/9/5','26-Sep')).presentations[0].date,'2026-09');
  assert.equal(loadWorkCsv(papers,talks.replace('2026/9/5','2026-Apr')).presentations[0].date,'2026-04');
  assert.equal(loadWorkCsv(papers,talks.replace('2026/9/5','Apr-2026')).presentations[0].date,'2026-04');
  for(const date of ['2026-13','2026-00','2025-09','2026-02-30','Sep-25','25-Sep']) {
    assert.throws(()=>loadWorkCsv(papers,talks.replace('2026/9/5',date)),/date/,date);
  }
});
