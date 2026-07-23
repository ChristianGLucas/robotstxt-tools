import { ParseSitemapInput, SitemapDocument } from '../gen/messages_pb';
import { parseSitemap } from './parse_sitemap';
import { testContext } from './lib/test_context';

function input(xml: string): ParseSitemapInput {
  const doc = new SitemapDocument();
  doc.setXml(xml);
  const inp = new ParseSitemapInput();
  inp.setDoc(doc);
  return inp;
}

const GOLDEN_URLSET = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/a</loc>
    <lastmod>2026-01-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/b</loc>
  </url>
</urlset>`;

describe('ParseSitemap', () => {
  it('parses loc, lastmod, changefreq, and priority for each <url>', () => {
    const result = parseSitemap(testContext, input(GOLDEN_URLSET));
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(2);

    const urls = result.getUrlsList();
    expect(urls[0].getLoc()).toBe('https://example.com/a');
    expect(urls[0].getLastmod()).toBe('2026-01-01');
    expect(urls[0].getChangefreq()).toBe('daily');
    expect(urls[0].getHasPriority()).toBe(true);
    expect(urls[0].getPriority()).toBeCloseTo(0.8);

    // Entry with only <loc> — the other fields are absent, not defaulted.
    expect(urls[1].getLoc()).toBe('https://example.com/b');
    expect(urls[1].getLastmod()).toBe('');
    expect(urls[1].getHasPriority()).toBe(false);
  });

  it('returns a structured error when the root element is not <urlset>', () => {
    const index = '<sitemapindex><sitemap><loc>https://example.com/s.xml</loc></sitemap></sitemapindex>';
    const result = parseSitemap(testContext, input(index));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('WRONG_ROOT_ELEMENT');
  });

  it('rejects external XML entities (XXE) with a structured error, not a crash', () => {
    const xxe =
      '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>' +
      '<urlset><url><loc>&xxe;</loc></url></urlset>';
    const result = parseSitemap(testContext, input(xxe));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('XML_UNSAFE_ENTITY');
  });

  it('returns a structured error for malformed (unclosed-tag) XML', () => {
    const malformed = '<urlset><url><loc>https://example.com/a</loc></urlset>';
    const result = parseSitemap(testContext, input(malformed));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('PARSE_ERROR');
  });

  it('returns a structured error for empty input', () => {
    const result = parseSitemap(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });

  it('is deterministic across repeated calls with the same input', () => {
    const r1 = parseSitemap(testContext, input(GOLDEN_URLSET));
    const r2 = parseSitemap(testContext, input(GOLDEN_URLSET));
    expect(r1.toObject()).toEqual(r2.toObject());
  });
});
