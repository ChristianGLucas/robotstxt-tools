import { CheckAccessInput, RobotsDocument } from '../gen/messages_pb';
import { isDisallowed } from './is_disallowed';
import { isAllowed } from './is_allowed';
import { testContext } from './lib/test_context';
import { ORACLE_CASES } from './lib/oracle_cases';

function input(robotsTxt: string, url: string, userAgent: string): CheckAccessInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  const inp = new CheckAccessInput();
  inp.setDoc(doc);
  inp.setUrl(url);
  inp.setUserAgent(userAgent);
  return inp;
}

describe('IsDisallowed', () => {
  it.each(ORACLE_CASES)('$name', (c) => {
    const result = isDisallowed(testContext, input(c.robotsTxt, c.path, c.userAgent));
    expect(result.getOk()).toBe(true);
    // IsDisallowed shares CheckAccessOutput with IsAllowed and populates
    // both fields identically: `allowed` is the RFC 9309 allowed-ness,
    // `disallowed` its exact negation — see the node's doc comment.
    expect(result.getAllowed()).toBe(c.expectedAllowed);
    expect(result.getDisallowed()).toBe(!c.expectedAllowed);
  });

  it('agrees with IsAllowed on the same input (never silently diverges)', () => {
    const i = input('User-agent: *\nAllow: /page\nDisallow: /*.htm', '/page.htm', 'AnyBot');
    const allowedResult = isAllowed(testContext, i);
    const disallowedResult = isDisallowed(testContext, i);
    expect(disallowedResult.getAllowed()).toBe(allowedResult.getAllowed());
    expect(disallowedResult.getDisallowed()).toBe(allowedResult.getDisallowed());
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = isDisallowed(testContext, input('', '/x', '*'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
