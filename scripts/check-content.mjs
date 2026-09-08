import { readFileSync } from 'node:fs';
import { loadWorkCsv, workCsvFiles } from '../lib/work-csv.mjs';
import { loadNewsCsv, loadScheduleCsv } from '../lib/news-model.mjs';
const read = path => readFileSync(new URL(`../data/${path}`, import.meta.url), 'utf8');
console.log(`お知らせ ${loadNewsCsv(read('news.csv')).length}件。`);
console.log(`予定 ${loadScheduleCsv(read('schedule.csv')).length}件。`);
const data = loadWorkCsv(Object.fromEntries(Object.entries(workCsvFiles).map(([key,file])=>[key,read(file)])));
console.log(`論文・総説 ${data.publications.filter(p=>p.type!=='preprint').length}件、プレプリント ${data.publications.filter(p=>p.type==='preprint').length}件、著書 ${data.books.length}件、講演 ${data.presentations.filter(t=>t.category==='lectures').length}件、学生発表 ${data.presentations.filter(t=>t.category==='students').length}件。`);
console.log(`入力チェック完了。演題と学会名が空欄の記入途中の行 ${data.draftPresentationCount}件は表示しません。`);
