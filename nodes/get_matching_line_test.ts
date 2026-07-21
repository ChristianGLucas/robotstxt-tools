import { GetMatchingLineInput, RobotsDocument } from '../gen/messages_pb';
import { getMatchingLine } from './get_matching_line';
import { testContext } from './lib/test_context';

function input(robotsTxt: string, url: string, userAgent: string): GetMatchingLineInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  const inp = new GetMatchingLineInput();
  inp.setDoc(doc);
  inp.setUrl(url);
  inp.setUserAgent(userAgent);
  return inp;
}

describe('GetMatchingLine', () => {
  it('finds the 1-based line of the governing Disallow rule', () => {
    const robotsTxt = ['User-agent: *', 'Disallow: /a', 'Disallow: /private/'].join('\n');
    const result = getMatchingLine(testContext, input(robotsTxt, '/private/x', '*'));
    expect(result.getOk()).toBe(true);
    expect(result.getMatched()).toBe(true);
    expect(result.getLine()).toBe(3);
  });

  it('reports matched=false and line=-1 when no explicit rule governs the URL', () => {
    const result = getMatchingLine(testContext, input('User-agent: *\nDisallow: /private/', '/public/x', '*'));
    expect(result.getOk()).toBe(true);
    expect(result.getMatched()).toBe(false);
    expect(result.getLine()).toBe(-1);
  });

  it('returns a structured error for a malformed url', () => {
    const result = getMatchingLine(testContext, input('User-agent: *\nDisallow: /x', 'not-a-url', '*'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('INVALID_URL');
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = getMatchingLine(testContext, input('', '/x', '*'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
