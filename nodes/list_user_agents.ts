import { ListUserAgentsInput, ListUserAgentsOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty } from './lib/guard';
import { parseRobotsTxt } from './lib/robots_txt';

function errorOutput(code: string, message: string): ListUserAgentsOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new ListUserAgentsOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * List every user-agent product token mentioned in a robots.txt document's
 * "User-agent:" lines, exactly as written, de-duplicated, in
 * first-appearance order.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listUserAgents(ax: AxiomContext, input: ListUserAgentsInput): ListUserAgentsOutput {
  const doc = input.getDoc();
  const robotsTxt = doc?.getRobotsTxt() ?? '';

  const emptyErr = checkEmpty(robotsTxt, 'doc.robots_txt');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const parsed = parseRobotsTxt(robotsTxt);
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const group of parsed.groups) {
    for (const ua of group.userAgents) {
      if (!seen.has(ua)) {
        seen.add(ua);
        ordered.push(ua);
      }
    }
  }

  const out = new ListUserAgentsOutput();
  out.setUserAgentsList(ordered);
  out.setOk(true);
  return out;
}
