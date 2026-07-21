// Shared robots.txt parsing helpers used by every robots.txt node.
//
// The RFC 9309 group-selection + longest-match-precedence algorithm itself
// (the "hard part") is owned by the `robots-parser` library (MIT, Sam
// Clarke) and used directly by the nodes that need it (IsAllowed,
// IsDisallowed, GetMatchingLine, GetCrawlDelay, ExtractRobotsSitemapUrls,
// GetPreferredHost — see robots_parser_client.ts).
//
// This file only does straightforward, well-defined glue: (1) segmenting a
// robots.txt document into its literal RFC 9309 rule groups (a run of
// consecutive "User-agent:" lines followed by the Allow/Disallow/Crawl-delay
// lines that apply to them), mirroring the exact same line-grammar
// robots-parser's own parser uses, and (2) merging groups that share a
// user-agent token into that token's effective rule set — again the same
// bucket-per-token algorithm robots-parser uses internally (see its
// `addRule`/`_getRule`), reimplemented here only because robots-parser does
// not expose that intermediate structure publicly. Neither step involves
// wildcard/anchor pattern matching.

export const MAX_INPUT_BYTES = 3 * 1024 * 1024; // 3 MiB — matches the platform's ~4 MiB gRPC message cap with headroom.

export interface RawRule {
  path: string;
  line: number;
}

export interface RawGroup {
  userAgents: string[]; // as written in the document, not normalized
  allow: RawRule[];
  disallow: RawRule[];
  hasCrawlDelay: boolean;
  crawlDelay: number;
  startLine: number;
  endLine: number;
}

export interface ParsedDocument {
  groups: RawGroup[];
  sitemaps: string[];
  preferredHost: string;
}

function removeComment(line: string): string {
  const idx = line.indexOf('#');
  return idx > -1 ? line.slice(0, idx) : line;
}

function splitDirective(line: string): [string, string] | null {
  const idx = line.indexOf(':');
  if (idx < 0) return null;
  return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
}

/**
 * Parse a robots.txt document into its literal RFC 9309 rule groups plus
 * document-level Sitemap:/Host: directives. Faithfully mirrors the line
 * grammar robots-parser's own internal parser uses (comments stripped at
 * '#', directive:value split at the first ':', consecutive "User-agent:"
 * lines accumulate into one group, a non-user-agent directive line ends
 * accumulation so the next "User-agent:" line starts a new group).
 */
export function parseRobotsTxt(content: string): ParsedDocument {
  const rawLines = content.split(/\r\n|\r|\n/);
  const groups: RawGroup[] = [];
  const sitemaps: string[] = [];
  let preferredHost = '';
  let current: RawGroup | null = null;
  let expectingNewGroup = true; // mirrors robots-parser's `isNoneUserAgentState`

  for (let i = 0; i < rawLines.length; i++) {
    const lineNum = i + 1;
    const parts = splitDirective(removeComment(rawLines[i]));
    if (!parts || !parts[0]) continue;

    const directive = parts[0].toLowerCase();
    const value = parts[1];

    switch (directive) {
      case 'user-agent': {
        if (expectingNewGroup || !current) {
          current = {
            userAgents: [],
            allow: [],
            disallow: [],
            hasCrawlDelay: false,
            crawlDelay: 0,
            startLine: lineNum,
            endLine: lineNum,
          };
          groups.push(current);
        }
        if (value) current.userAgents.push(value);
        current.endLine = lineNum;
        break;
      }
      case 'disallow':
        if (current && value) {
          current.disallow.push({ path: value, line: lineNum });
          current.endLine = lineNum;
        }
        break;
      case 'allow':
        if (current && value) {
          current.allow.push({ path: value, line: lineNum });
          current.endLine = lineNum;
        }
        break;
      case 'crawl-delay':
        if (current) {
          const delay = Number(value);
          if (!Number.isNaN(delay)) {
            current.hasCrawlDelay = true;
            current.crawlDelay = delay;
            current.endLine = lineNum;
          }
        }
        break;
      case 'sitemap':
        if (value) sitemaps.push(value);
        break;
      case 'host':
        if (value) preferredHost = value.toLowerCase();
        break;
      default:
        break;
    }

    expectingNewGroup = directive !== 'user-agent';
  }

  return { groups, sitemaps, preferredHost };
}

/**
 * Normalize a user-agent product token for comparison: lower-case and
 * truncate at the first "/" (strips a version suffix like "Googlebot/2.1"
 * down to "googlebot"). Mirrors robots-parser's `formatUserAgent`.
 */
export function formatUserAgent(userAgent: string): string {
  let formatted = (userAgent || '*').toLowerCase();
  const idx = formatted.indexOf('/');
  if (idx > -1) formatted = formatted.slice(0, idx);
  return formatted.trim();
}

export interface EffectiveBucket {
  allow: RawRule[];
  disallow: RawRule[];
  hasCrawlDelay: boolean;
  crawlDelay: number;
}

/**
 * Merge every literal group that lists a given normalized user-agent token
 * into that token's effective rule bucket — the same per-token accumulation
 * robots-parser performs internally, so a caller resolving "what applies to
 * Googlebot" here gets a result consistent with what IsAllowed/IsDisallowed
 * (which delegate to robots-parser directly) actually decide.
 */
export function buildTokenBuckets(groups: RawGroup[]): Map<string, EffectiveBucket> {
  const buckets = new Map<string, EffectiveBucket>();

  for (const group of groups) {
    for (const rawToken of group.userAgents) {
      const token = formatUserAgent(rawToken);
      let bucket = buckets.get(token);
      if (!bucket) {
        bucket = { allow: [], disallow: [], hasCrawlDelay: false, crawlDelay: 0 };
        buckets.set(token, bucket);
      }
      bucket.allow.push(...group.allow);
      bucket.disallow.push(...group.disallow);
      if (group.hasCrawlDelay) {
        // Last write wins in document order, matching robots-parser's plain
        // property assignment (`rules[userAgent].crawlDelay = delay`).
        bucket.hasCrawlDelay = true;
        bucket.crawlDelay = group.crawlDelay;
      }
    }
  }

  return buckets;
}

export interface SelectedBucket {
  token: string; // the normalized token the bucket was actually selected under ("*" on wildcard fallback)
  bucket: EffectiveBucket | null;
  found: boolean;
}

/**
 * Select the effective bucket for a user-agent: an exact normalized-token
 * match, else the "*" wildcard bucket, else not found. Mirrors
 * robots-parser's `this._rules[userAgent] || this._rules['*']`.
 */
export function selectEffectiveBucket(
  buckets: Map<string, EffectiveBucket>,
  userAgent: string
): SelectedBucket {
  const formatted = formatUserAgent(userAgent);
  if (buckets.has(formatted)) {
    return { token: formatted, bucket: buckets.get(formatted)!, found: true };
  }
  if (buckets.has('*')) {
    return { token: '*', bucket: buckets.get('*')!, found: true };
  }
  return { token: formatted, bucket: null, found: false };
}
