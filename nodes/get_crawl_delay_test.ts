import { GetCrawlDelayInput, RobotsDocument } from '../gen/messages_pb';
import { getCrawlDelay } from './get_crawl_delay';
import { testContext } from './lib/test_context';

function input(robotsTxt: string, userAgent: string): GetCrawlDelayInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  const inp = new GetCrawlDelayInput();
  inp.setDoc(doc);
  inp.setUserAgent(userAgent);
  return inp;
}

describe('GetCrawlDelay', () => {
  it('returns the crawl-delay declared for an exact user-agent match', () => {
    const result = getCrawlDelay(testContext, input('User-agent: Googlebot\nCrawl-delay: 10', 'Googlebot'));
    expect(result.getOk()).toBe(true);
    expect(result.getHasValue()).toBe(true);
    expect(result.getCrawlDelay()).toBeCloseTo(10);
  });

  it('falls back to the "*" group crawl-delay when no named group matches', () => {
    const result = getCrawlDelay(testContext, input('User-agent: *\nCrawl-delay: 3', 'SomeOtherBot'));
    expect(result.getOk()).toBe(true);
    expect(result.getHasValue()).toBe(true);
    expect(result.getCrawlDelay()).toBeCloseTo(3);
  });

  it('reports has_value=false when no Crawl-delay applies', () => {
    const result = getCrawlDelay(testContext, input('User-agent: *\nDisallow: /x', 'AnyBot'));
    expect(result.getOk()).toBe(true);
    expect(result.getHasValue()).toBe(false);
  });

  it('ignores a non-numeric Crawl-delay value rather than crashing', () => {
    const result = getCrawlDelay(testContext, input('User-agent: *\nCrawl-delay: not-a-number', 'AnyBot'));
    expect(result.getOk()).toBe(true);
    expect(result.getHasValue()).toBe(false);
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = getCrawlDelay(testContext, input('', 'AnyBot'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
