import { CheckAccessInput, CheckAccessOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { computeCheckAccess } from './lib/check_access';

/**
 * Test whether a URL or path is DISALLOWED for a given user-agent under a
 * supplied robots.txt document — the exact logical negation of IsAllowed's
 * `allowed` field (surfaced here as `disallowed`), for callers whose flow
 * reads more naturally as a disallow check. Same RFC 9309 longest-match
 * precedence and input contract as IsAllowed; the two nodes share their
 * output shape and always agree.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function isDisallowed(ax: AxiomContext, input: CheckAccessInput): CheckAccessOutput {
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
