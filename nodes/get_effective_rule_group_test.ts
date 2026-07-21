import { GetEffectiveRuleGroupInput, RobotsDocument } from '../gen/messages_pb';
import { getEffectiveRuleGroup } from './get_effective_rule_group';
import { testContext } from './lib/test_context';

function input(robotsTxt: string, userAgent: string): GetEffectiveRuleGroupInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  const inp = new GetEffectiveRuleGroupInput();
  inp.setDoc(doc);
  inp.setUserAgent(userAgent);
  return inp;
}

describe('GetEffectiveRuleGroup', () => {
  it('resolves the exact-match named group, including its crawl-delay', () => {
    const result = getEffectiveRuleGroup(
      testContext,
      input('User-agent: Googlebot\nDisallow: /x\nAllow: /y\nCrawl-delay: 2', 'Googlebot')
    );
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(true);
    const group = result.getGroup()!;
    expect(group.getUserAgentsList()).toEqual(['googlebot']);
    expect(group.getDisallowList().map((r) => r.getPath())).toEqual(['/x']);
    expect(group.getAllowList().map((r) => r.getPath())).toEqual(['/y']);
    expect(group.getHasCrawlDelay()).toBe(true);
    expect(group.getCrawlDelay()).toBeCloseTo(2);
  });

  it('falls back to the "*" wildcard group when no named group matches', () => {
    const result = getEffectiveRuleGroup(testContext, input('User-agent: *\nDisallow: /admin/', 'RandomBot'));
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(true);
    expect(result.getGroup()!.getUserAgentsList()).toEqual(['*']);
    expect(result.getGroup()!.getDisallowList().map((r) => r.getPath())).toEqual(['/admin/']);
  });

  it('reports found=false when neither a named nor a wildcard group exists', () => {
    const result = getEffectiveRuleGroup(testContext, input('User-agent: SpecificBot\nDisallow: /x', 'OtherBot'));
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(false);
  });

  it('normalizes a versioned user-agent to its base product token', () => {
    const result = getEffectiveRuleGroup(
      testContext,
      input('User-agent: Googlebot\nDisallow: /x', 'Googlebot/2.1')
    );
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(true);
    expect(result.getGroup()!.getDisallowList().map((r) => r.getPath())).toEqual(['/x']);
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = getEffectiveRuleGroup(testContext, input('', 'AnyBot'));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
