import { ExtractRobotsSitemapUrlsInput, ExtractRobotsSitemapUrlsOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty, checkSize } from './lib/guard';
import { parseRobotsTxt, MAX_INPUT_BYTES } from './lib/robots_txt';

function errorOutput(code: string, message: string): ExtractRobotsSitemapUrlsOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new ExtractRobotsSitemapUrlsOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Extract every Sitemap: URL declared in a robots.txt document, in source
 * order. These are document discovery URLs only — this node does not fetch
 * them; feed one into ParseSitemap/ParseSitemapIndex once your own flow has
 * retrieved its content.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractRobotsSitemapUrls(ax: AxiomContext, input: ExtractRobotsSitemapUrlsInput): ExtractRobotsSitemapUrlsOutput {
  const doc = input.getDoc();
  const robotsTxt = doc?.getRobotsTxt() ?? '';

  const emptyErr = checkEmpty(robotsTxt, 'doc.robots_txt');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const sizeErr = checkSize(robotsTxt, MAX_INPUT_BYTES, 'doc.robots_txt');
  if (sizeErr) return errorOutput(sizeErr.code, sizeErr.message);

  const parsed = parseRobotsTxt(robotsTxt);

  const out = new ExtractRobotsSitemapUrlsOutput();
  out.setSitemapUrlsList(parsed.sitemaps);
  out.setOk(true);
  return out;
}
