import { ListDisallowedPathsInput, RobotsDocument } from '../gen/messages_pb';
import { listDisallowedPaths } from './list_disallowed_paths';
import { testContext } from './lib/test_context';

function input(robotsTxt: string, userAgent: string): ListDisallowedPathsInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  const inp = new ListDisallowedPathsInput();
  inp.setDoc(doc);
  inp.setUserAgent(userAgent);
  return inp;
}

// Independently confirmed against robots-parser's own isAllowed() (which
// this package delegates the RFC 9309 matching algorithm to): with two
// non-adjacent "User-agent: Googlebot" groups, isAllowed("/a","Googlebot")
// and isAllowed("/b","Googlebot") are both false and isAllowed("/shared",
// "Googlebot") is true — i.e. the two groups' Disallow rules merge for
// Googlebot, and the wildcard group's own rule does NOT leak in once an
// exact token match exists. ListDisallowedPaths must report the same
// merged, non-leaking rule set.
const NON_ADJACENT_GROUPS = [
  'User-agent: Googlebot',
  'Disallow: /a',
  '',
  'User-agent: *',
  'Disallow: /shared',
  '',
  'User-agent: Googlebot',
  'Disallow: /b',
].join('\n');

describe('ListDisallowedPaths', () => {
  it('lists the Disallow paths for an exact user-agent match', () => {
    const result = listDisallowedPaths(testContext, input('User-agent: Googlebot\nDisallow: /x\nDisallow: /y', 'Googlebot'));
    expect(result.getOk()).toBe(true);
    expect(result.getPathsList()).toEqual(['/x', '/y']);
    expect(result.getMatchedGroupUserAgent()).toBe('googlebot');
  });

  it('merges rules from every non-adjacent group sharing the same user-agent token, without wildcard leakage', () => {
    const result = listDisallowedPaths(testContext, input(NON_ADJACENT_GROUPS, 'Googlebot'));
    expect(result.getOk()).toBe(true);
    expect(result.getPathsList()).toEqual(['/a', '/b']);
    expect(result.getPathsList()).not.toContain('/shared');
  });

  it('falls back to the "*" group when no named group matches', () => {
    const result = listDisallowedPaths(testContext, input(NON_ADJACENT_GROUPS, 'SomeOtherBot'));
    expect(result.getOk()).toBe(true);
    expect(result.getPathsList()).toEqual(['/shared']);
    expect(result.getMatchedGroupUserAgent()).toBe('*');
  });

  it('returns an empty list and empty matched_group_user_agent when no group exists at all', () => {
    const result = listDisallowedPaths(testContext, input('User-agent: SpecificBot\nDisallow: /x', 'OtherBot'));
    expect(result.getOk()).toBe(true);
    expect(result.getPathsList()).toEqual([]);
    expect(result.getMatchedGroupUserAgent()).toBe('');
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = listDisallowedPaths(testContext, input('', 'AnyBot'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
