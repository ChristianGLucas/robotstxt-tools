import { CheckAccessInput, RobotsDocument } from '../gen/messages_pb';
import { isAllowed } from './is_allowed';
import { testContext } from './lib/test_context';
import { ORACLE_CASES } from './lib/oracle_cases';

function input(robotsTxt: string, url: string, userAgent: string, siteUrl = ''): CheckAccessInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  doc.setSiteUrl(siteUrl);
  const inp = new CheckAccessInput();
  inp.setDoc(doc);
  inp.setUrl(url);
  inp.setUserAgent(userAgent);
  return inp;
}

describe('IsAllowed', () => {
  it.each(ORACLE_CASES)('$name', (c) => {
    const result = isAllowed(testContext, input(c.robotsTxt, c.path, c.userAgent));
    expect(result.getOk()).toBe(true);
    expect(result.getAllowed()).toBe(c.expectedAllowed);
    expect(result.getDisallowed()).toBe(!c.expectedAllowed);
  });

  it('accepts an absolute URL and derives the origin from it', () => {
    const result = isAllowed(
      testContext,
      input('User-agent: *\nDisallow: /private/', 'https://example.com/private/x', '*')
    );
    expect(result.getOk()).toBe(true);
    expect(result.getAllowed()).toBe(false);
  });

  it('reports the matched rule line number', () => {
    const result = isAllowed(testContext, input('User-agent: *\nDisallow: /private/', '/private/x', '*'));
    expect(result.getOk()).toBe(true);
    expect(result.getMatched()).toBe(true);
    expect(result.getMatchedLine()).toBe(2);
  });

  it('reports matched=false and line=-1 on default-allow (no explicit rule)', () => {
    const result = isAllowed(testContext, input('User-agent: *\nDisallow: /private/', '/public/x', '*'));
    expect(result.getOk()).toBe(true);
    expect(result.getMatched()).toBe(false);
    expect(result.getMatchedLine()).toBe(-1);
  });

  it('returns a structured error when the absolute url origin conflicts with doc.site_url', () => {
    const result = isAllowed(
      testContext,
      input('User-agent: *\nDisallow: /x', 'https://example.com/x', '*', 'https://other.com')
    );
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('URL_ORIGIN_MISMATCH');
  });

  it('returns a structured error for a url that is neither absolute nor a path', () => {
    const result = isAllowed(testContext, input('User-agent: *\nDisallow: /x', 'relative/no-slash', '*'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('INVALID_URL');
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = isAllowed(testContext, input('', '/x', '*'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });

  it('is deterministic: invoking twice with the same input yields the same result', () => {
    const i = input('User-agent: *\nAllow: /p\nDisallow: /', '/page', 'AnyBot');
    const r1 = isAllowed(testContext, i);
    const r2 = isAllowed(testContext, i);
    expect(r1.toObject()).toEqual(r2.toObject());
  });
});
