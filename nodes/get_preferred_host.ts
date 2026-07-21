import { GetPreferredHostInput, GetPreferredHostOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty, checkSize } from './lib/guard';
import { parseRobotsTxt, MAX_INPUT_BYTES } from './lib/robots_txt';

function errorOutput(code: string, message: string): GetPreferredHostOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new GetPreferredHostOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Read the preferred-host value from a robots.txt document's Host:
 * directive (a widely-deployed extension beyond core RFC 9309).
 * `has_value=false` when the document declares no Host: line.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getPreferredHost(ax: AxiomContext, input: GetPreferredHostInput): GetPreferredHostOutput {
  const doc = input.getDoc();
  const robotsTxt = doc?.getRobotsTxt() ?? '';

  const emptyErr = checkEmpty(robotsTxt, 'doc.robots_txt');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const sizeErr = checkSize(robotsTxt, MAX_INPUT_BYTES, 'doc.robots_txt');
  if (sizeErr) return errorOutput(sizeErr.code, sizeErr.message);

  const parsed = parseRobotsTxt(robotsTxt);

  const out = new GetPreferredHostOutput();
  if (parsed.preferredHost) {
    out.setHost(parsed.preferredHost);
    out.setHasValue(true);
  } else {
    out.setHasValue(false);
  }
  out.setOk(true);
  return out;
}
