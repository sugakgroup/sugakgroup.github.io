import { test } from 'node:test';
import assert from 'node:assert/strict';
import { englishSiteHref } from '../lib/site-links.mjs';

test('news links localize translated pages while preserving query and fragment', () => {
  assert.equal(englishSiteHref('/'), '/en');
  assert.equal(englishSiteHref('/#news'), '/en#news');
  assert.equal(englishSiteHref('/research/#chemical-space'), '/en/research#chemical-space');
  assert.equal(englishSiteHref('/works?year=2026#main'), '/en/works?year=2026#main');
});

test('Japanese-only pages, files and external URLs never gain a broken English prefix', () => {
  for (const href of ['/making', '/making#research-cluster', '/photos/cluster.jpg', '/en/news', 'https://example.org/', '//example.org/news', '#main', '']) {
    assert.equal(englishSiteHref(href), href);
  }
});
