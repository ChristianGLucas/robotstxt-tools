import { ExtractSitemapLocsInput, SitemapDocument } from '../gen/messages_pb';
import { extractSitemapLocs } from './extract_sitemap_locs';
import { testContext } from './lib/test_context';

function input(xml: string): ExtractSitemapLocsInput {
  const doc = new SitemapDocument();
  doc.setXml(xml);
  const inp = new ExtractSitemapLocsInput();
  inp.setDoc(doc);
  return inp;
}

describe('ExtractSitemapLocs', () => {
  it('extracts <loc> values from a urlset', () => {
    const xml = '<urlset><url><loc>https://example.com/a</loc></url><url><loc>https://example.com/b</loc></url></urlset>';
    const result = extractSitemapLocs(testContext, input(xml));
    expect(result.getOk()).toBe(true);
    expect(result.getDocType()).toBe('urlset');
    expect(result.getLocsList()).toEqual(['https://example.com/a', 'https://example.com/b']);
  });

  it('extracts <loc> values from a sitemapindex', () => {
    const xml =
      '<sitemapindex><sitemap><loc>https://example.com/s1.xml</loc></sitemap>' +
      '<sitemap><loc>https://example.com/s2.xml</loc></sitemap></sitemapindex>';
    const result = extractSitemapLocs(testContext, input(xml));
    expect(result.getOk()).toBe(true);
    expect(result.getDocType()).toBe('sitemapindex');
    expect(result.getLocsList()).toEqual(['https://example.com/s1.xml', 'https://example.com/s2.xml']);
  });

  it('returns a structured error for an unrecognized root element', () => {
    const result = extractSitemapLocs(testContext, input('<rss></rss>'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('WRONG_ROOT_ELEMENT');
  });

  it('rejects external XML entities (XXE) with a structured error', () => {
    const xxe =
      '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>' +
      '<urlset><url><loc>&xxe;</loc></url></urlset>';
    const result = extractSitemapLocs(testContext, input(xxe));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('XML_UNSAFE_ENTITY');
  });

  it('returns a structured error for empty input', () => {
    const result = extractSitemapLocs(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
