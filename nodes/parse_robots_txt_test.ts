import { ParseRobotsInput, RobotsDocument } from '../gen/messages_pb';
import { parseRobotsTxt } from './parse_robots_txt';
import { testContext } from './lib/test_context';

function input(robotsTxt: string): ParseRobotsInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  const inp = new ParseRobotsInput();
  inp.setDoc(doc);
  return inp;
}

const SAMPLE = [
  '# comment line, should be ignored',
  'User-agent: Googlebot',
  'User-agent: Bingbot',
  'Disallow: /private/',
  'Allow: /private/public-page.html',
  'Crawl-delay: 5',
  '',
  'User-agent: *',
  'Disallow: /admin/',
  'Disallow: /tmp/',
  '',
  'Sitemap: https://example.com/sitemap.xml',
  'Sitemap: https://example.com/sitemap-news.xml',
  'Host: example.com',
].join('\n');

describe('ParseRobotsTxt', () => {
  it('parses groups, rules, crawl-delay, sitemaps, and host correctly', () => {
    const result = parseRobotsTxt(testContext, input(SAMPLE));
    expect(result.getResult()?.getOk()).toBe(true);

    const groups = result.getResult()!.getGroupsList();
    expect(groups).toHaveLength(2);

    // First group: Googlebot + Bingbot, consecutive User-agent lines merged.
    const g0 = groups[0];
    expect(g0.getUserAgentsList()).toEqual(['Googlebot', 'Bingbot']);
    expect(g0.getDisallowList().map((r) => r.getPath())).toEqual(['/private/']);
    expect(g0.getDisallowList()[0].getLine()).toBe(4);
    expect(g0.getAllowList().map((r) => r.getPath())).toEqual(['/private/public-page.html']);
    expect(g0.getHasCrawlDelay()).toBe(true);
    expect(g0.getCrawlDelay()).toBeCloseTo(5);

    // Second group: wildcard, two disallow rules, no crawl-delay.
    const g1 = groups[1];
    expect(g1.getUserAgentsList()).toEqual(['*']);
    expect(g1.getDisallowList().map((r) => r.getPath())).toEqual(['/admin/', '/tmp/']);
    expect(g1.getHasCrawlDelay()).toBe(false);

    expect(result.getResult()!.getSitemapsList()).toEqual([
      'https://example.com/sitemap.xml',
      'https://example.com/sitemap-news.xml',
    ]);
    expect(result.getResult()!.getPreferredHost()).toBe('example.com');
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = parseRobotsTxt(testContext, input(''));
    expect(result.getResult()?.getOk()).toBe(false);
    expect(result.getResult()?.getError()?.getCode()).toBe('EMPTY_INPUT');
  });

  it('returns a structured error, not a crash, for oversized input', () => {
    const huge = 'User-agent: *\nDisallow: /' + 'a'.repeat(3 * 1024 * 1024);
    const result = parseRobotsTxt(testContext, input(huge));
    expect(result.getResult()?.getOk()).toBe(false);
    expect(result.getResult()?.getError()?.getCode()).toBe('INPUT_TOO_LARGE');
  });

  it('is deterministic across repeated calls with the same input', () => {
    const r1 = parseRobotsTxt(testContext, input(SAMPLE));
    const r2 = parseRobotsTxt(testContext, input(SAMPLE));
    expect(r1.getResult()!.toObject()).toEqual(r2.getResult()!.toObject());
  });
});
