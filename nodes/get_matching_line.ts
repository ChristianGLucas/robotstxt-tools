import { GetMatchingLineInput, GetMatchingLineOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty } from './lib/guard';
import { resolveTarget } from './lib/robots_parser_client';

function errorOutput(code: string, message: string): GetMatchingLineOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new GetMatchingLineOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Find the 1-based source line number of the Allow/Disallow rule that
 * governs a given URL/user-agent pair under a supplied robots.txt document
 * — useful for auditing or explaining an IsAllowed/IsDisallowed decision.
 * `matched=false` (line=-1) when no explicit rule matched (RFC 9309
 * default-allow applies).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getMatchingLine(ax: AxiomContext, input: GetMatchingLineInput): GetMatchingLineOutput {
  const doc = input.getDoc();
  const robotsTxt = doc?.getRobotsTxt() ?? '';

  const emptyErr = checkEmpty(robotsTxt, 'doc.robots_txt');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const resolved = resolveTarget(robotsTxt, doc?.getSiteUrl() ?? '', input.getUrl());
  if ('error' in resolved) return errorOutput(resolved.error.code, resolved.error.message);

  const { robots, url } = resolved;
  const line = robots.getMatchingLineNumber(url, input.getUserAgent());
  const matchedLine = typeof line === 'number' ? line : -1;

  const out = new GetMatchingLineOutput();
  out.setLine(matchedLine);
  out.setMatched(matchedLine !== -1);
  out.setOk(true);
  return out;
}
