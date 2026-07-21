import { ListDisallowedPathsInput, ListDisallowedPathsOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty, checkSize } from './lib/guard';
import { parseRobotsTxt, buildTokenBuckets, selectEffectiveBucket, MAX_INPUT_BYTES } from './lib/robots_txt';

function errorOutput(code: string, message: string): ListDisallowedPathsOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new ListDisallowedPathsOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * List every Disallow path pattern in the rule group that applies to a
 * given user-agent (resolved via the same RFC 9309 group-selection as
 * GetEffectiveRuleGroup: an exact/prefix product-token match, or the "*"
 * group on fallback). Returns an empty list, not an error, when the
 * selected group has no Disallow rules.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listDisallowedPaths(ax: AxiomContext, input: ListDisallowedPathsInput): ListDisallowedPathsOutput {
  const doc = input.getDoc();
  const robotsTxt = doc?.getRobotsTxt() ?? '';

  const emptyErr = checkEmpty(robotsTxt, 'doc.robots_txt');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const sizeErr = checkSize(robotsTxt, MAX_INPUT_BYTES, 'doc.robots_txt');
  if (sizeErr) return errorOutput(sizeErr.code, sizeErr.message);

  const parsed = parseRobotsTxt(robotsTxt);
  const buckets = buildTokenBuckets(parsed.groups);
  const selected = selectEffectiveBucket(buckets, input.getUserAgent());

  const out = new ListDisallowedPathsOutput();
  if (selected.found && selected.bucket) {
    out.setPathsList(selected.bucket.disallow.map((r) => r.path));
    out.setMatchedGroupUserAgent(selected.token);
  } else {
    out.setPathsList([]);
    out.setMatchedGroupUserAgent('');
  }
  out.setOk(true);
  return out;
}
