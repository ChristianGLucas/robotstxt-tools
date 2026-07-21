import { GetPreferredHostInput, RobotsDocument } from '../gen/messages_pb';
import { getPreferredHost } from './get_preferred_host';
import { testContext } from './lib/test_context';

function input(robotsTxt: string): GetPreferredHostInput {
  const doc = new RobotsDocument();
  doc.setRobotsTxt(robotsTxt);
  const inp = new GetPreferredHostInput();
  inp.setDoc(doc);
  return inp;
}

describe('GetPreferredHost', () => {
  it('reads the Host: directive value, lower-cased', () => {
    const result = getPreferredHost(testContext, input('User-agent: *\nDisallow: /x\nHost: Example.COM'));
    expect(result.getOk()).toBe(true);
    expect(result.getHasValue()).toBe(true);
    expect(result.getHost()).toBe('example.com');
  });

  it('reports has_value=false when no Host: directive is present', () => {
    const result = getPreferredHost(testContext, input('User-agent: *\nDisallow: /x'));
    expect(result.getOk()).toBe(true);
    expect(result.getHasValue()).toBe(false);
  });

  it('returns a structured error for empty robots_txt', () => {
    const result = getPreferredHost(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});
