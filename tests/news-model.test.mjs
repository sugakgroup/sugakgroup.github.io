import test from 'node:test';
import assert from 'node:assert/strict';
import { loadNewsCsv, loadScheduleCsv, partitionSchedule } from '../lib/news-model.mjs';
import { encodeCsv } from '../lib/work-csv.mjs';
const csv = rows => encodeCsv([['日付','種別','見出し','リンク'], ...rows]);

test('English headlines stay attached to their Japanese record through CSV escaping and sorting', () => {
  const english = 'A poster, with "new molecules"\nat the symposium';
  const rows = [['リンク','英語見出し','日付','見出し','種別'],
    ['/works',english,'2026-09','ポスター発表予定','学会発表'],
    ['', '', '2026-11', '参加予定（発表未定）', '学会参加']];
  const items = loadScheduleCsv(encodeCsv(rows));
  assert.equal(items[1].titleEn, english);
  assert.equal(items[1].title, 'ポスター発表予定');
  assert.equal(items[0].titleEn, '');
  assert.equal(items[0].date, '2026-11');
  const upcoming = partitionSchedule(items, '2026-09-07').upcoming;
  assert.equal(upcoming[0].titleEn, english);
  assert.equal(upcoming[1].title, '参加予定（発表未定）');
  assert.equal(loadNewsCsv(csv([['2026-09','イベント','旧4列','']]))[0].titleEn, '');
});

test('misspelled, duplicate and missing headline columns are rejected', () => {
  for (const header of [
    ['日付','種別','見出し','リンク','英文見出し'],
    ['日付','種別','見出し','リンク','英語見出し','英語見出し'],
    ['日付','種別','英語見出し','リンク'],
  ]) assert.throws(() => loadNewsCsv(encodeCsv([header])));
});

test('upcoming includes today and this month, ordered soonest first without treating past plans as achievements', () => {
  const items = loadScheduleCsv(csv([
    ['2026-10-02','学会発表','次月の発表',''],
    ['2026-09-06','学会参加','過去の参加予定',''],
    ['2026-09-07','イベント','今日の予定',''],
    ['2026-09','学会発表','今月の日付未記入',''],
  ]));
  const now = partitionSchedule(items, '2026-09-07');
  assert.deepEqual(now.upcoming.map(i => i.date), ['2026-09','2026-09-07','2026-10-02']);
  assert.deepEqual(now.past.map(i => i.title), ['過去の参加予定']);
  const later = partitionSchedule(items, '2026-10-01');
  assert.equal(later.upcoming.length, 1);
  assert.equal(later.past.length, 3);
});

test('news preserves date precision and CSV order within the same date', () => {
  const items = loadNewsCsv(csv([
    ['2026/4/17','論文掲載','論文, 掲載','https://doi.org/10.1021/acs.jcim.6c00213'],
    ['2026-09','学会発表','発表','/works'],
    ['2026-09','イベント','研究室イベント',''],
    ['2026-04','メンバー加入','加入','/#people'],
  ]));
  assert.deepEqual(items.map(i => [i.date,i.title]), [['2026-09','発表'],['2026-09','研究室イベント'],['2026-04-17','論文, 掲載'],['2026-04','加入']]);
});
test('news rejects nonexistent dates and unrecognized categories', () => {
  for (const date of ['2026-02-29','2026-13','2026-04-31']) assert.throws(() => loadNewsCsv(csv([[date,'イベント','題','']])));
  assert.equal(loadNewsCsv(csv([['2024-02-29','イベント','題','']])).length,1);
  assert.throws(() => loadNewsCsv(csv([['2026-04','科研費','題','']])));
});
test('news accepts optional links but rejects executable or malformed URLs', () => {
  for (const url of ['javascript:alert(1)','//external.example','/\\external.example','https://','https://exam ple.org']) assert.throws(() => loadNewsCsv(csv([['2026-04','イベント','題',url]])));
  assert.equal(loadNewsCsv(csv([])).length,0);
  assert.throws(() => loadNewsCsv(csv([['2026-04','イベント','','']])));
});
