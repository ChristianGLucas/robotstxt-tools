import { ParseRobotsInput, ParseRobotsOutput, ParsedRobots, RobotsRuleGroup, RobotsPathRule, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty } from './lib/guard';
import { parseRobotsTxt as parseDoc } from './lib/robots_txt';

function errorOutput(code: string, message: string): ParseRobotsOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const result = new ParsedRobots();
  result.setOk(false);
  result.setError(err);
  const out = new ParseRobotsOutput();
  out.setResult(result);
  return out;
}

/**
 * Parse a robots.txt document into its full structured form: every RFC 9309
 * rule group (the user-agent tokens it applies to, its Allow and Disallow
 * path rules with source line numbers, and its Crawl-delay if any), plus
 * the document-level Sitemap: URLs and Host: directive. The general-purpose
 * parse the other robots.txt nodes are specialized views of.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseRobotsTxt(ax: AxiomContext, input: ParseRobotsInput): ParseRobotsOutput {
  const doc = input.getDoc();
  const robotsTxt = doc?.getRobotsTxt() ?? '';

  const emptyErr = checkEmpty(robotsTxt, 'doc.robots_txt');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const parsed = parseDoc(robotsTxt);

  const result = new ParsedRobots();
  for (const g of parsed.groups) {
    const group = new RobotsRuleGroup();
    group.setUserAgentsList(g.userAgents);
    group.setAllowList(
      g.allow.map((r) => {
        const rule = new RobotsPathRule();
        rule.setPath(r.path);
        rule.setLine(r.line);
        return rule;
      })
    );
    group.setDisallowList(
      g.disallow.map((r) => {
        const rule = new RobotsPathRule();
        rule.setPath(r.path);
        rule.setLine(r.line);
        return rule;
      })
    );
    group.setHasCrawlDelay(g.hasCrawlDelay);
    group.setCrawlDelay(g.crawlDelay);
    group.setStartLine(g.startLine);
    group.setEndLine(g.endLine);
    result.addGroups(group);
  }
  result.setSitemapsList(parsed.sitemaps);
  result.setPreferredHost(parsed.preferredHost);
  result.setOk(true);

  const out = new ParseRobotsOutput();
  out.setResult(result);
  return out;
}
