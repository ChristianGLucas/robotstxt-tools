// Shared implementation for IsAllowed/IsDisallowed — both nodes evaluate the
// exact same RFC 9309 decision (delegated to robots-parser) and differ only
// in which boolean field of the result they exist to make a caller's flow
// read naturally. Keeping one implementation guarantees they can never
// silently disagree.

import { checkEmpty, GuardError } from './guard';
import { resolveTarget } from './robots_parser_client';

export interface CheckAccessResult {
  allowed: boolean;
  matched: boolean;
  matchedLine: number;
}

export function computeCheckAccess(
  robotsTxt: string,
  siteUrl: string,
  url: string,
  userAgent: string
): CheckAccessResult | { error: GuardError } {
  const emptyErr = checkEmpty(robotsTxt, 'doc.robots_txt');
  if (emptyErr) return { error: emptyErr };

  const resolved = resolveTarget(robotsTxt, siteUrl, url);
  if ('error' in resolved) return { error: resolved.error };

  const { robots, url: resolvedUrl } = resolved;
  const allowed = robots.isAllowed(resolvedUrl, userAgent);

  if (allowed === undefined) {
    // Should not be reachable — resolveTarget already guarantees a
    // same-mode, same-origin base — but never surface `undefined` as a
    // silently-coerced boolean.
    return {
      error: {
        code: 'URL_ORIGIN_MISMATCH',
        message: `robots-parser could not evaluate ${JSON.stringify(resolvedUrl)} against this document.`,
      },
    };
  }

  const line = robots.getMatchingLineNumber(resolvedUrl, userAgent);
  const matchedLine = typeof line === 'number' ? line : -1;

  return { allowed, matched: matchedLine !== -1, matchedLine };
}
