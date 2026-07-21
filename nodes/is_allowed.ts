import { CheckAccessInput, CheckAccessOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { computeCheckAccess } from './lib/check_access';

/**
 * Test whether a URL or path is ALLOWED for a given user-agent under a
 * supplied robots.txt document, using RFC 9309 longest-match precedence
 * (the most specific — longest — matching Allow/Disallow rule wins; a tie
 * between an Allow and a Disallow of equal length resolves to Allow).
 * Accepts an absolute URL or a path starting with "/". No matching rule at
 * all is a valid, allowed outcome (`matched=false, allowed=true`) per RFC
 * 9309's default-allow.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function isAllowed(ax: AxiomContext, input: CheckAccessInput): CheckAccessOutput {
  const doc = input.getDoc();
  const result = computeCheckAccess(doc?.getRobotsTxt() ?? '', doc?.getSiteUrl() ?? '', input.getUrl(), input.getUserAgent());

  const out = new CheckAccessOutput();
  if ('error' in result) {
    const err = new RobotsToolsError();
    err.setCode(result.error.code);
    err.setMessage(result.error.message);
    out.setOk(false);
    out.setError(err);
    return out;
  }

  out.setAllowed(result.allowed);
  out.setDisallowed(!result.allowed);
  out.setMatched(result.matched);
  out.setMatchedLine(result.matchedLine);
  out.setOk(true);
  return out;
}
