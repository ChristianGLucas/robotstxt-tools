import { DetectSitemapTypeInput, SitemapDocument } from '../gen/messages_pb';
import { detectSitemapType } from './detect_sitemap_type';
import { testContext } from './lib/test_context';

function input(xml: string): DetectSitemapTypeInput {
  const doc = new SitemapDocument();
  doc.setXml(xml);
  const inp = new DetectSitemapTypeInput();
  inp.setDoc(doc);
  return inp;
}

describe('DetectSitemapType', () => {
  it('detects a urlset document', () => {
    const result = detectSitemapType(testContext, input('<urlset><url><loc>https://example.com/a</loc></url></urlset>'));
    expect(result.getOk()).toBe(true);
    expect(result.getDocType()).toBe('urlset');
  });

  it('detects a sitemapindex document', () => {
    const result = detectSitemapType(
      testContext,
      input('<sitemapindex><sitemap><loc>https://example.com/s.xml</loc></sitemap></sitemapindex>')
    );
    expect(result.getOk()).toBe(true);
    expect(result.getDocType()).toBe('sitemapindex');
  });

  it('reports "unknown" for a well-formed but unrelated XML document', () => {
    const result = detectSitemapType(testContext, input('<rss><channel><title>Not a sitemap</title></channel></rss>'));
    expect(result.getOk()).toBe(true);
    expect(result.getDocType()).toBe('unknown');
  });

  it('returns a structured error for malformed XML rather than "unknown"', () => {
    const result = detectSitemapType(testContext, input('<urlset><url>'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('PARSE_ERROR');
  });

  it('returns a structured error for empty input', () => {
    const result = detectSitemapType(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
