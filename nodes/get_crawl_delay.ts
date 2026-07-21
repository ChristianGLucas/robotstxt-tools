import { GetCrawlDelayInput, GetCrawlDelayOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import robotsParser from 'robots-parser';
import { checkEmpty, checkSize } from './lib/guard';
import { MAX_INPUT_BYTES } from './lib/robots_txt';

function errorOutput(code: string, message: string): GetCrawlDelayOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new GetCrawlDelayOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Read the Crawl-delay (in seconds) that applies to a user-agent under a
 * supplied robots.txt document, resolved through the same RFC 9309
 * group-selection as GetEffectiveRuleGroup (named group, or "*" fallback).
 * `has_value=false` when no Crawl-delay applies — RFC 9309 defines no
 * implicit default, so absence is reported explicitly rather than
 * defaulted to 0.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getCrawlDelay(ax: AxiomContext, input: GetCrawlDelayInput): GetCrawlDelayOutput {
  const doc = input.getDoc();
  const robotsTxt = doc?.getRobotsTxt() ?? '';

  const emptyErr = checkEmpty(robotsTxt, 'doc.robots_txt');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const sizeErr = checkSize(robotsTxt, MAX_INPUT_BYTES, 'doc.robots_txt');
  if (sizeErr) return errorOutput(sizeErr.code, sizeErr.message);

  const robots = robotsParser('/robots.txt', robotsTxt);
  const delay = robots.getCrawlDelay(input.getUserAgent());

  const out = new GetCrawlDelayOutput();
  if (typeof delay === 'number' && !Number.isNaN(delay)) {
    out.setCrawlDelay(delay);
    out.setHasValue(true);
  } else {
    out.setHasValue(false);
  }
  out.setOk(true);
  return out;
}
