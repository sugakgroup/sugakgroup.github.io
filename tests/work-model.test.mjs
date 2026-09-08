import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterWorks, selectedPublications, validateWorkContent } from '../lib/work-model.mjs';
import { loadWorkCsv, workCsvFiles } from '../lib/work-csv.mjs';

const read = file => readFileSync(new URL(`../data/${file}`,import.meta.url),'utf8');
const data = loadWorkCsv(Object.fromEntries(Object.entries(workCsvFiles).map(([key,file])=>[key,read(file)])));
const papers={publications:data.publications}, talks={presentations:data.presentations}, taxonomy=data.taxonomy;
const base={id:'fixture',year:2026,title:'Test fixture',visible:true,themeIds:['chemical-space'],collaborationIds:['project-a'],group:'suga-group'};
const studentTalk={...base,id:'student-talk',type:'presentation',category:'students',authors:['Test Student','Test Coauthor'],speakers:['Test Student'],speakerRole:'student',event:'Test conference',date:'2026-08-10',scope:'international',invitation:'invited',format:'oral'};
test('current CSV data validates without constraining future record counts',()=>{
  validateWorkContent(papers,talks,taxonomy,{books:data.books});
});
test('filters combine theme, collaboration, group, speaker, invitation and year',()=>{
  const list=[studentTalk,{...studentTalk,id:'suga-talk',speakerRole:'suga',category:'lectures'}, {...studentTalk,id:'other-project',collaborationIds:['project-b']}, {...studentTalk,id:'hidden',visible:false}, {...studentTalk,id:'ordinary',invitation:'contributed'}];
  const result=filterWorks(list,{kind:'students',theme:'chemical-space',collaboration:'project:project-a',group:'suga-group',speaker:'student',invitation:'invited',year:'2026'});
  assert.deepEqual(result.map(x=>x.id),['student-talk']);
  assert.equal(filterWorks(list,{kind:'publications'}).length,0);
});
test('unknown collaboration is not treated as no collaboration',()=>{
  const list=[{...base,id:'unknown',collaborationIds:null},{...base,id:'none',collaborationIds:[]},base];
  assert.deepEqual(filterWorks(list,{collaboration:'no'}).map(x=>x.id),['none']);
  assert.deepEqual(filterWorks(list,{collaboration:'unclassified'}).map(x=>x.id),['unknown']);
  assert.deepEqual(filterWorks(list,{collaboration:'yes'}).map(x=>x.id),['fixture']);
});
test('hidden records never appear, including representative selection',()=>{
  const hidden={...papers.publications[0],visible:false};
  assert.equal(filterWorks([hidden],{}).length,0);
  assert.equal(selectedPublications([hidden]).length,0);
});
test('duplicate DOI and unknown classification prevent publication',()=>{
  const duplicate=structuredClone(papers); duplicate.publications.push({...duplicate.publications[0],id:'different-id',doi:duplicate.publications[0].doi.toUpperCase()});
  assert.throws(()=>validateWorkContent(duplicate,talks,taxonomy),/doi/);
  const invalid=structuredClone(papers);invalid.publications[0].themeIds=['typo'];
  assert.throws(()=>validateWorkContent(invalid,talks,taxonomy),/themeIds/);
});
test('a student talk addition is valid and filterable',()=>{
  const tax={...taxonomy,collaborations:[...taxonomy.collaborations,{id:'project-a',label:'Test project'}]};
  validateWorkContent(papers,{presentations:[studentTalk]},tax);
  assert.equal(filterWorks([...papers.publications,studentTalk],{kind:'students',speaker:'student',invitation:'invited'}).length,1);
  assert.throws(()=>validateWorkContent(papers,{presentations:[{...studentTalk,date:'2026-02-30'}]},tax),/date/);
});
