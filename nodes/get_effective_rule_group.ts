import {
  GetEffectiveRuleGroupInput,
  GetEffectiveRuleGroupOutput,
  RobotsRuleGroup,
  RobotsPathRule,
  RobotsToolsError,
} from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty, checkSize } from './lib/guard';
import { parseRobotsTxt, buildTokenBuckets, selectEffectiveBucket, MAX_INPUT_BYTES } from './lib/robots_txt';

function errorOutput(code: string, message: string): GetEffectiveRuleGroupOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new GetEffectiveRuleGroupOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Resolve which RFC 9309 rule group actually governs a given user-agent:
 * the most specific group whose user-agent token matches
 * (case-insensitive), falling back to the "*" wildcard group when no named
 * group matches. `found=false` when neither a named nor a wildcard group
 * exists in the document at all.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getEffectiveRuleGroup(ax: AxiomContext, input: GetEffectiveRuleGroupInput): GetEffectiveRuleGroupOutput {
  const doc = input.getDoc();
  const robotsTxt = doc?.getRobotsTxt() ?? '';

  const emptyErr = checkEmpty(robotsTxt, 'doc.robots_txt');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const sizeErr = checkSize(robotsTxt, MAX_INPUT_BYTES, 'doc.robots_txt');
  if (sizeErr) return errorOutput(sizeErr.code, sizeErr.message);

  const parsed = parseRobotsTxt(robotsTxt);
  const buckets = buildTokenBuckets(parsed.groups);
  const selected = selectEffectiveBucket(buckets, input.getUserAgent());

  const out = new GetEffectiveRuleGroupOutput();
  if (selected.found && selected.bucket) {
    const group = new RobotsRuleGroup();
    group.setUserAgentsList([selected.token]);
    group.setAllowList(
      selected.bucket.allow.map((r) => {
        const rule = new RobotsPathRule();
        rule.setPath(r.path);
        rule.setLine(r.line);
        return rule;
      })
    );
    group.setDisallowList(
      selected.bucket.disallow.map((r) => {
        const rule = new RobotsPathRule();
        rule.setPath(r.path);
        rule.setLine(r.line);
        return rule;
      })
    );
    group.setHasCrawlDelay(selected.bucket.hasCrawlDelay);
    group.setCrawlDelay(selected.bucket.crawlDelay);
    // Synthesized (possibly merged from multiple source groups sharing this
    // token) — not a single source line range.
    group.setStartLine(-1);
    group.setEndLine(-1);
    out.setGroup(group);
    out.setFound(true);
  } else {
    out.setFound(false);
  }
  out.setOk(true);
  return out;
}
