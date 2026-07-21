// Thin, deterministic wrapper around robots-parser (MIT, Sam Clarke) — the
// library that owns the actual RFC 9309 hard part: wildcard/"$"-anchor path
// matching with longest-match precedence (Allow-wins-on-tie). Every node
// that needs that algorithm (IsAllowed, IsDisallowed, GetMatchingLine,
// GetCrawlDelay, ExtractRobotsSitemapUrls, GetPreferredHost) goes through
// this file rather than re-deriving matching semantics itself.
//
// robots-parser resolves relative vs. absolute test URLs against the base
// URL it was constructed with, and requires the two to be in the *same*
// mode (both relative, or both absolute with a matching origin) — see its
// README's "relative URLs" section. This wrapper hides that by picking the
// mode itself, deterministically, from the shape of the caller-supplied
// `url` — no network, no guessing beyond that.

import robotsParser from 'robots-parser';

const ABSOLUTE_URL_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//;

export type ClientError = { code: string; message: string };

export interface ResolvedTarget {
  robots: ReturnType<typeof robotsParser>;
  url: string;
}

/**
 * Build a robots-parser instance whose base matches the mode (relative vs.
 * absolute) of `url`, and validate `url` itself. Returns a structured error
 * instead of ever letting robots-parser silently return `undefined` for an
 * origin/mode mismatch.
 */
export function resolveTarget(
  robotsTxt: string,
  siteUrl: string,
  url: string
): ResolvedTarget | { error: ClientError } {
  if (!url) {
    return { error: { code: 'EMPTY_URL', message: '`url` must not be empty.' } };
  }

  if (url.startsWith('/')) {
    // Relative mode: both the robots.txt base and the test URL are treated
    // as paths on the same (unspecified) site. `site_url` is irrelevant
    // here — matching is scheme/host-agnostic by construction.
    return { robots: robotsParser('/robots.txt', robotsTxt), url };
  }

  if (!ABSOLUTE_URL_RE.test(url)) {
    return {
      error: {
        code: 'INVALID_URL',
        message: `\`url\` must be an absolute URL (e.g. "https://example.com/page") or begin with "/" (e.g. "/page"); got ${JSON.stringify(
          url
        )}.`,
      },
    };
  }

  let targetOrigin: string;
  try {
    targetOrigin = new URL(url).origin;
  } catch {
    return { error: { code: 'INVALID_URL', message: `\`url\` is not a valid absolute URL: ${JSON.stringify(url)}.` } };
  }

  if (siteUrl) {
    let declaredOrigin: string;
    try {
      declaredOrigin = new URL(siteUrl).origin;
    } catch {
      return {
        error: {
          code: 'INVALID_SITE_URL',
          message: `\`doc.site_url\` is not a valid URL: ${JSON.stringify(siteUrl)}.`,
        },
      };
    }
    if (declaredOrigin !== targetOrigin) {
      return {
        error: {
          code: 'URL_ORIGIN_MISMATCH',
          message: `\`url\` origin (${targetOrigin}) does not match \`doc.site_url\` origin (${declaredOrigin}).`,
        },
      };
    }
  }

  return { robots: robotsParser(`${targetOrigin}/robots.txt`, robotsTxt), url };
}
