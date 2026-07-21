import { ExtractRobotsSitemapUrlsInput, RobotsDocument } from '../gen/messages_pb';
import { extractRobotsSitemapUrls } from './extract_robots_sitemap_urls';
import { testContext } from './lib/test_context';

function input(robotsTxt: string): ExtractRobotsSitemapUrlsInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  const inp = new ExtractRobotsSitemapUrlsInput();
  inp.setDoc(doc);
  return inp;
}

describe('ExtractRobotsSitemapUrls', () => {
  it('extracts every Sitemap: URL in source order', () => {
    const robotsTxt = [
      'User-agent: *',
      'Disallow: /admin/',
      'Sitemap: https://example.com/sitemap.xml',
      'Sitemap: https://example.com/sitemap-news.xml',
    ].join('\n');
    const result = extractRobotsSitemapUrls(testContext, input(robotsTxt));
    expect(result.getOk()).toBe(true);
    expect(result.getSitemapUrlsList()).toEqual([
      'https://example.com/sitemap.xml',
      'https://example.com/sitemap-news.xml',
    ]);
  });

  it('returns an empty list, not an error, when no Sitemap: line is present', () => {
    const result = extractRobotsSitemapUrls(testContext, input('User-agent: *\nDisallow: /x'));
    expect(result.getOk()).toBe(true);
    expect(result.getSitemapUrlsList()).toEqual([]);
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = extractRobotsSitemapUrls(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
