import { CountSitemapUrlsInput, SitemapDocument } from '../gen/messages_pb';
import { countSitemapUrls } from './count_sitemap_urls';
import { testContext } from './lib/test_context';

function input(xml: string): CountSitemapUrlsInput {
  const doc = new SitemapDocument();
  doc.setXml(xml);
  const inp = new CountSitemapUrlsInput();
  inp.setDoc(doc);
  return inp;
}

describe('CountSitemapUrls', () => {
  it('counts <url> entries in a urlset', () => {
    const xml = '<urlset><url><loc>a</loc></url><url><loc>b</loc></url><url><loc>c</loc></url></urlset>';
    const result = countSitemapUrls(testContext, input(xml));
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(3);
    expect(result.getDocType()).toBe('urlset');
    expect(result.getTruncated()).toBe(false);
  });

  it('counts <sitemap> entries in a sitemapindex', () => {
    const xml = '<sitemapindex><sitemap><loc>a</loc></sitemap><sitemap><loc>b</loc></sitemap></sitemapindex>';
    const result = countSitemapUrls(testContext, input(xml));
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(2);
    expect(result.getDocType()).toBe('sitemapindex');
  });

  it('counts 0 for a urlset with no <url> children (not an error)', () => {
    const result = countSitemapUrls(testContext, input('<urlset></urlset>'));
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(0);
  });

  it('returns a structured error when the root element is neither urlset nor sitemapindex', () => {
    const result = countSitemapUrls(testContext, input('<rss></rss>'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('WRONG_ROOT_ELEMENT');
  });

  it('returns a structured error for empty input', () => {
    const result = countSitemapUrls(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
