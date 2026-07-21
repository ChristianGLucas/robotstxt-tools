import { ListUserAgentsInput, RobotsDocument } from '../gen/messages_pb';
import { listUserAgents } from './list_user_agents';
import { testContext } from './lib/test_context';

function input(robotsTxt: string): ListUserAgentsInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  const inp = new ListUserAgentsInput();
  inp.setDoc(doc);
  return inp;
}

describe('ListUserAgents', () => {
  it('lists every distinct user-agent, de-duplicated, in first-appearance order', () => {
    const robotsTxt = [
      'User-agent: Googlebot',
      'Disallow: /a',
      'User-agent: Bingbot',
      'User-agent: Googlebot',
      'Disallow: /b',
      'User-agent: *',
      'Disallow: /c',
    ].join('\n');
    const result = listUserAgents(testContext, input(robotsTxt));
    expect(result.getOk()).toBe(true);
    expect(result.getUserAgentsList()).toEqual(['Googlebot', 'Bingbot', '*']);
  });

  it('returns an empty list, not an error, for a document with no User-agent lines', () => {
    const result = listUserAgents(testContext, input('Sitemap: https://example.com/sitemap.xml'));
    expect(result.getOk()).toBe(true);
    expect(result.getUserAgentsList()).toEqual([]);
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = listUserAgents(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
