import { ParseSitemapIndexInput, SitemapDocument } from '../gen/messages_pb';
import { parseSitemapIndex } from './parse_sitemap_index';
import { testContext } from './lib/test_context';

function input(xml: string): ParseSitemapIndexInput {
  const doc = new SitemapDocument();
  doc.setXml(xml);
  const inp = new ParseSitemapIndexInput();
  inp.setDoc(doc);
  return inp;
}

const GOLDEN_INDEX = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-1.xml</loc>
    <lastmod>2026-01-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-2.xml</loc>
  </sitemap>
</sitemapindex>`;

describe('ParseSitemapIndex', () => {
  it('parses loc and lastmod for each child <sitemap>', () => {
    const result = parseSitemapIndex(testContext, input(GOLDEN_INDEX));
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(2);

    const sitemaps = result.getSitemapsList();
    expect(sitemaps[0].getLoc()).toBe('https://example.com/sitemap-1.xml');
    expect(sitemaps[0].getLastmod()).toBe('2026-01-01');
    expect(sitemaps[1].getLoc()).toBe('https://example.com/sitemap-2.xml');
    expect(sitemaps[1].getLastmod()).toBe('');
  });

  it('returns a structured error when the root element is not <sitemapindex>', () => {
    const urlset = '<urlset><url><loc>https://example.com/a</loc></url></urlset>';
    const result = parseSitemapIndex(testContext, input(urlset));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('WRONG_ROOT_ELEMENT');
  });

  it('rejects external XML entities (XXE) with a structured error', () => {
    const xxe =
      '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>' +
      '<sitemapindex><sitemap><loc>&xxe;</loc></sitemap></sitemapindex>';
    const result = parseSitemapIndex(testContext, input(xxe));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('XML_UNSAFE_ENTITY');
  });

  it('returns a structured error for empty input', () => {
    const result = parseSitemapIndex(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
